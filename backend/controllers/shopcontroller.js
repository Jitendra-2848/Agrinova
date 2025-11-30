const { v4: uuidv4 } = require('uuid');
const product = require("../models/product.js");
const shop = require("../models/shop.js"); 
const track = require("../models/track.js");
const farmer = require("../models/user_detail/farmer.js");
const vendor = require("../models/user_detail/vendor.js");
const getPincodeDistance = require('./distance.js'); 

const paymentSuccess = async (req, res) => {
  console.log(req.body)
  // Track what we've created/modified for rollback
  let createdShopId = null;
  let createdTrackId = null;
  let productUpdated = false;
  let farmerUpdated = false;
  let vendorUpdated = false;

  try {
    const { 
      productid, 
      quantity, 
      delivery, 
      payment,
    } = req.body;

    // ========== STEP 1: Update Product Quantity ==========
    const initialproduct = await product.findByIdAndUpdate(
      productid,
      { $inc: { Product_Qty: -quantity } },
      { new: true }
    );

    if (!initialproduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    productUpdated = true; // Mark for potential rollback

    // Check if out of stock
    if (initialproduct.Product_Qty <= 0) {
      await product.findByIdAndUpdate(productid, { Product_status: "Out-Of-Stock" });
    }

    // ========== STEP 2: Calculate Distance & Validate Pincode ==========
    let distanceKm = -1;
    let distanceError = "Unknown distance error";

    try {
      const distResult = await getPincodeDistance(initialproduct.location_pin, delivery.pincode);
      
      if (typeof distResult === 'object' && distResult.success) {
        distanceKm = distResult.distance;
      } else if (typeof distResult === 'number' && distResult !== -1) {
        distanceKm = distResult;
      } else {
        distanceError = distResult.error || "Invalid Pincode or API Error";
        distanceKm = -1;
      }
    } catch (err) {
      distanceError = err.message;
      distanceKm = -1;
    }

    // 🛑 ROLLBACK: Invalid Distance
    if (distanceKm === -1 || distanceKm < 0) {
      console.error(`Distance Invalid (${distanceKm}). Rolling back...`);
      
      await product.findByIdAndUpdate(
        productid,
        { 
          $inc: { Product_Qty: quantity }, 
          Product_status: initialproduct.Product_Qty > 0 ? "In-Stock" : "Out-Of-Stock" 
        }
      );

      return res.status(400).json({ 
        message: "Delivery not available for this Pincode.", 
        error: distanceError 
      });
    }

    // ========== STEP 3: Prepare Data ==========
    const trackingId = uuidv4();
    const now = new Date();
    
    // Determine Unit Price (Negotiated or Regular)
    const productPrice = Number(initialproduct.Product_price);
    let unitPrice = productPrice;

    if (payment?.isNegotiated && payment?.negotiatedPrice) {
      const negPrice = Number(payment.negotiatedPrice);
      if (!isNaN(negPrice) && negPrice > 0) {
        unitPrice = negPrice;
      }
    }

    // Revenue Calculation with validation
    const orderRevenue = unitPrice * Number(quantity);
    if (isNaN(orderRevenue) || orderRevenue <= 0) {
      throw new Error(`Invalid revenue calculation. Price: ${unitPrice}, Qty: ${quantity}`);
    }

    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    const monthIdentifier = `${currentMonthName} ${currentYear}`;

    // ========== STEP 4: Create Shop Record ==========
    const shopRecord = new shop({
      farmer: initialproduct.userId,
      vendor: req.user, 
      productid: productid,
      quantity: quantity,
      distance: distanceKm,
      tracking_id: trackingId,
      status: "Paid", 
      price: payment,
      city: delivery.city || initialproduct.city || "unknown",
      delivery: {
        address: delivery.address,
        pincode: delivery.pincode,
        city: delivery.city || "unknown"
      }
    });

    const savedShop = await shopRecord.save();
    createdShopId = savedShop._id; // Track for rollback

    // ========== STEP 5: Create Track Record ==========
    const trackRecord = new track({
      user: req.user,
      tracking_id: trackingId,
      reached: initialproduct.location_pin, 
      charge: delivery.charge || 50, 
      total_distance: distanceKm,
      product: [savedShop], // Array as per your schema
      status: "Placed"
    });

    const savedTrack = await trackRecord.save();
    createdTrackId = savedTrack._id; // Track for rollback

    // ========== STEP 6: Update Farmer Stats ==========
    const farmerUpdate = await farmer.findOneAndUpdate(
      { user: initialproduct.userId },
      {
        $inc: {
          Total_Revenue: orderRevenue,
          Active_Crops: 1, 
        },
        $push: {
          Orders: {
            date: now,
            products_sold: quantity,
            revenue: orderRevenue,
          },
        },
      },
      { new: true }
    );

    if (!farmerUpdate) {
      throw new Error("Farmer profile not found");
    }

    farmerUpdated = true; // Track for rollback

    // ========== STEP 7: Update Farmer Monthly History ==========
    const farmerDoc = await farmer.findOne({ user: initialproduct.userId });
    
    if (farmerDoc) {
      const monthExists = farmerDoc.Monthly_Sales_History.find(m => m.month === monthIdentifier);
      
      if (monthExists) {
        await farmer.findOneAndUpdate(
          { user: initialproduct.userId, "Monthly_Sales_History.month": monthIdentifier },
          { 
            $inc: { 
              "Monthly_Sales_History.$.revenue": orderRevenue,
              "Monthly_Sales_History.$.products_sold": quantity,
            }
          }
        );
      } else {
        await farmer.findOneAndUpdate(
          { user: initialproduct.userId },
          {
            $push: {
              Monthly_Sales_History: {
                month: monthIdentifier,
                revenue: orderRevenue,
                products_sold: quantity,
                crops_active: 1,
              },
            },
          }
        );
      }
    }

    // ========== STEP 8: Update Vendor Stats ==========
    const vendorUpdate = await vendor.findOneAndUpdate(
      { user: req.user },
      {
        $inc: {
          Active_Orders: 1,
          Total_Purchases: quantity,
          Total_Spent: payment.amount 
        },
        $push: {
          Purchase_History: {
            date: now,
            product_id: productid,
            quantity: quantity,
            amount: payment.amount,
            status: "completed"
          }
        }
      },
      { upsert: true, new: true }
    );

    if (!vendorUpdate) {
      throw new Error("Failed to update vendor profile");
    }

    vendorUpdated = true; // Track for rollback

    // ========== SUCCESS ==========
    return res.status(200).json({
      message: "Order placed successfully",
      tracking_id: trackingId,
      distance: distanceKm
    });

  } catch (error) {
    console.error("❌ paymentSuccess error:", error);

    // ========== COMPREHENSIVE ROLLBACK ==========
    console.log("🔄 Starting rollback process...");

    try {
      // 1. Delete Track Record
      if (createdTrackId) {
        await track.findByIdAndDelete(createdTrackId);
        console.log("✅ Deleted track record:", createdTrackId);
      }

      // 2. Delete Shop Record
      if (createdShopId) {
        await shop.findByIdAndDelete(createdShopId);
        console.log("✅ Deleted shop record:", createdShopId);
      }

      // 3. Restore Product Quantity
      if (productUpdated && req.body.productid) {
        const restoredProduct = await product.findByIdAndUpdate(
          req.body.productid,
          { 
            $inc: { Product_Qty: req.body.quantity },
            Product_status: "In-Stock" 
          },
          { new: true }
        );
        console.log("✅ Restored product quantity:", restoredProduct?.Product_Qty);
      }

      // 4. Rollback Farmer Stats (if updated)
      if (farmerUpdated && req.body.productid) {
        const initialproduct = await product.findById(req.body.productid);
        if (initialproduct) {
          const productPrice = Number(initialproduct.Product_price);
          let unitPrice = productPrice;

          if (req.body.payment?.isNegotiated && req.body.payment?.negotiatedPrice) {
            const negPrice = Number(req.body.payment.negotiatedPrice);
            if (!isNaN(negPrice) && negPrice > 0) {
              unitPrice = negPrice;
            }
          }

          const orderRevenue = unitPrice * Number(req.body.quantity);

          await farmer.findOneAndUpdate(
            { user: initialproduct.userId },
            {
              $inc: {
                Total_Revenue: -orderRevenue,
                Active_Crops: -1,
              },
              $pull: {
                Orders: { 
                  products_sold: req.body.quantity,
                  revenue: orderRevenue 
                }
              }
            }
          );
          console.log("✅ Rolled back farmer stats");
        }
      }

      // 5. Rollback Vendor Stats (if updated)
      if (vendorUpdated && req.user) {
        await vendor.findOneAndUpdate(
          { user: req.user },
          {
            $inc: {
              Active_Orders: -1,
              Total_Purchases: -req.body.quantity,
              Total_Spent: -req.body.payment.amount
            },
            $pull: {
              Purchase_History: {
                product_id: req.body.productid,
                amount: req.body.payment.amount
              }
            }
          }
        );
        console.log("✅ Rolled back vendor stats");
      }

      console.log("✅ Rollback completed successfully");

    } catch (rollbackError) {
      console.error("❌ CRITICAL: Rollback failed:", rollbackError);
      // Log to external monitoring service (e.g., Sentry)
    }

    return res.status(500).json({ 
      message: "Order failed. All changes have been reverted.", 
      error: error.message 
    });
  }
};

module.exports = { paymentSuccess };

module.exports = { paymentSuccess };
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.body;

    // Get shop record to restore product quantity
    const shopRecord = await shop.findOne({ tracking_id: id });
    
    if (shopRecord) {
      // Restore product quantity
      for (const product of shopRecord.products) {
        await product.findByIdAndUpdate(
          product.product_id,
          { 
            $inc: { product_Qty: product.quantity },
            product_status: "In-Stock"
          }
        );
      }

      // Update farmer stats
      const orderRevenue = shopRecord.products.reduce(
        (sum, p) => sum + (p.final_price * p.quantity), 0
      );
      
      await farmer.findOneAndUpdate(
        { user: shopRecord.farmer_id },
        {
          $inc: {
            Total_Revenue: -orderRevenue,
            Active_Crops: -1,
            Total_Orders: -1,
          },
        }
      );

      // Update vendor stats
      await vendor.findOneAndUpdate(
        { user: shopRecord.buyer_id },
        {
          $inc: {
            Total_Orders: -1,
            Total_Spent: -shopRecord.payment.amount,
            Total_Savings: -shopRecord.payment.discount,
          },
        }
      );
    }

    await shop.deleteOne({ tracking_id: id });
    await track.deleteOne({ tracking_id: id });

    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("cancelOrder error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { tracking_id } = req.params;
    
    const order = await shop.findOne({ tracking_id })
      .populate('buyer_id', 'name email phone')
      .populate('farmer_id', 'name email phone');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    return res.status(200).json({ order });
  } catch (error) {
    console.error("getOrderDetails error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  paymentSuccess,
  cancelOrder,
  getOrderDetails,
};