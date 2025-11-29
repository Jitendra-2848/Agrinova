const { v4: uuidv4 } = require('uuid');
const product = require("../models/product.js");
const shop = require("../models/shop.js"); // Assuming this is your 'payment' model
const track = require("../models/track.js");
const farmer = require("../models/user_detail/farmer.js");
const vendor = require("../models/user_detail/vendor.js");
const getPincodeDistance  = require('./distance'); // Ensure correct path

const paymentSuccess = async (req, res) => {
  try {
    const { 
      productid, 
      quantity, 
      status, 
      delivery,
      payment 
    } = req.body;

    // 1. Update product Quantity
    const initialproduct = await product.findByIdAndUpdate(
      productid,
      { $inc: { product_Qty: -quantity } },
      { new: true }
    );

    if (!initialproduct) {
      return res.status(404).json({ message: "product not found" });
    }

    // Mark as Out-Of-Stock if qty is 0
    if (initialproduct.product_Qty <= 0) {
      await product.findByIdAndUpdate(productid, { product_status: "Out-Of-Stock" });
    }
    const distResult = await getPincodeDistance(initialproduct.location_pin, delivery.pincode);
    const distanceKm = distResult.success ? distResult.distance : 0;

    const trackingId = uuidv4();
    const now = new Date();
    const unitPrice = payment?.isNegotiated && payment?.negotiatedPrice 
      ? payment.negotiatedPrice 
      : initialproduct.product_price;
    
    const orderRevenue = unitPrice * quantity;
    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    const monthIdentifier = `${currentMonthName} ${currentYear}`;

    // 3. Create Payment Record (shop Model)
    const shopRecord = new shop({
      farmer: initialproduct.userId,
      vendor: req.user, // Assuming req.user is the vendor ID from auth middleware
      productid: productid,
      quantity: quantity,
      distance: distanceKm,
      tracking_id: trackingId,
      status: "Paid", // Or based on payment method
      city: delivery.city || initialproduct.city,
      delivery: {
        address: delivery.address,
        pincode: delivery.pincode,
        city: delivery.city || "unknown"
      }
    });

    // 4. Create track Record
    const trackRecord = new track({
      user: req.user,
      tracking_id: trackingId,
      reached: initialproduct.location_pin, // Initially at product location
      charge: delivery.charge || 50, // Delivery charge
      total_distance: distanceKm,
      status: "Placed"
    });

    // 5. Update farmer Stats
    await farmer.findOneAndUpdate(
      { user: initialproduct.userId },
      {
        $inc: {
          Total_Revenue: orderRevenue,
          // Only increment Active_Crops if it's a new product type logic, 
          // or simply treat every sale as activity
          Active_Crops: 1, 
        },
        $push: {
          Orders: {
            date: now,
            products_sold: quantity,
            revenue: orderRevenue,
          },
        },
      }
    );

    // Update Monthly History for farmer
    const farmerDoc = await farmer.findOne({ user: initialproduct.userId });
    if(farmerDoc){
       const monthExists = farmerDoc.Monthly_Sales_History.find(m => m.month === monthIdentifier);
       
       if(monthExists){
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

    // 6. Update vendor Stats
    await vendor.findOneAndUpdate(
      { user: req.user },
      {
        $inc: {
          Active_Orders: 1,
          Total_Purchases: quantity,
          Total_Spent: payment.amount // Total amount paid including delivery
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
      { upsert: true } // Create if doesn't exist
    );

    // Save everything
    await shopRecord.save();
    await trackRecord.save();

    return res.status(200).json({
      message: "Order placed successfully",
      tracking_id: trackingId,
      distance: distanceKm
    });

  } catch (error) {
    console.error("paymentSuccess error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

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