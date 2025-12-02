const { api } = require("../utils/transporter.js");
const Track = require("../models/track.js");
const shop = require("../models/shop.js");
const transporter_data = require("../models/user_detail/transporter.js")
const Product = require("../models/product");
const farmer = require("../models/user_detail/farmer.js");
const vendor = require("../models/user_detail/vendor.js");
//     Update tracking while shipment is moving
const updateTrack = async (req, res) => {
  try {
    const { id, reachedAt, transporter } = req.body;
    if (transporter != req.user) {
      return res.status(500).json({ message: "Chalaki nhi mittar jo tera kaam hai vo kar dusro ki chize change mat kar." });
    }



    //here you have to update the distance also DEVANASH   


    const updated = await Track.findOneAndUpdate(
      { tracking_id: id },
      {
        reached: reachedAt, status: "Delivering",
        // distance_cover:"Here devansh"
      }

    );
    await updated.save();
    return res.status(200).json({
      message: "Tracking updated",
      data: updated
    });
  } catch (error) {
    console.error("updateTrack error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const accepting = async (req, res) => {
  try {
    const { tracking_id, pincode, earning, distance } = req.body;
    console.log(req.body);
    // 1. Update tracking record
    const record = await Track.findOneAndUpdate(
      { tracking_id },
      {
        reached: pincode,
        status: "Shipping",
        transporter: req.user,
      },
      { new: true }
    );
    const product = await shop.findOne({ tracking_id: tracking_id })
    // 2. Update transporter data
    const updating_detail = await transporter_data.findOneAndUpdate(
      { user: req.user },
      {
        $inc: {
          Active_Deliveries: 1,
          Total_Distance: distance,
          Earnings: earning,
        },
        $push: {
          Delivery_History: {
            distance: distance,
            earnings: earning,
          }
        }
      },
      { new: true }
    );
    await record.save();
    return res.status(200).json({ record, updating_detail });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.." });
  }
}
const find = async (req, res) => {
  try {
    const tracks = await Track.find({ transporter: null }).lean();
    const result = await Promise.all(
      tracks.map(async (track) => {
        const payments = await shop.find({ tracking_id: track.tracking_id }).lean();
        const productDetails = await Promise.all(
          payments.map(async (p) => {
            const product = await Product.findById(p.productid).lean();
            return {
              productId: p.productid,
              vendor: p.vendor,
              quantity: p.quantity,
              status: p.status,
              distance: p.distance,
              product_city: product?.city || "unknown_x",
              delivery_city: p.delivery?.city || "unknown_y",
              delivery_pincode: p.delivery?.pincode || "unknown_y",
            };
          })
        );

        return {
          // Tracking information
          tracking_id: track.tracking_id,
          status: track.status,
          charge: track.charge,
          reached: track.reached || null,
          transporter: track.transporter || null,
          products: productDetails,
        };
      })
    );

    // Send final response
    return res.status(200).json({ data: result });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

};
//     Final Delivery Completed
const delivered = async (req, res) => {
  try {
    const { id, reachedAt, transporter } = req.body;
    if (transporter != req.user) {
      return res.status(500).json({ message: "Chalaki nhi mittar jo tera kaam hai vo kar dusro ki chize change mat kar." });
    }
    const updated = await Track.findOneAndUpdate(
      { tracking_id: id },
      { reached: reachedAt, status: "Delivered" },
      { new: true }
    );
    const updating_detail = await transporter_data.findOneAndUpdate(
      { user: req.user },
      {
        $inc: {
          Active_Deliveries: -1,
          Completed_jobs: 1,
        },
      },
      { new: true }
    );
    const initialProduct = await shop.findOne({tracking_id:id})
    const data = await farmer.findOneAndUpdate({ user: initialProduct.farmer }, {
      $inc: {
        Active_Crops: -1,
      }
    })
    const data2 = await vendor.findOneAndUpdate(
          { user: initialProduct.vendor },
          {
            $inc: {
              Active_Orders:-1,
            }
          }
        );
        console.log(data)
        console.log(data2)
    return res.status(200).json({
      message: "Order Delivered",
      data: updated
    });
  } catch (error) {
    console.error("delivered error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//     Order Rejected (Future logic placeholder)
const rejected = async (req, res) => {
  try {
    const { id } = req.body;

    return res.status(200).json({
      message: "Currently no functionality for rejection",
      tracking_id: id
    });
  } catch (error) {
    console.error("rejected error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const history = async (req, res) => {
  try {
    const tracks = await Track.find({
      transporter: req.user,
      status: "Delivered"
    }).lean();

    const result = await Promise.all(
      tracks.map(async (track) => {
        const products = await shop.find({ tracking_id: track.tracking_id }).lean();

        const productDetails = products.map((p) => ({
          productId: p.productid,
          vendor: p.vendor,
          quantity: p.quantity,
          status: p.status,
          delivery: p.delivery,
        }));
        return {
          tracking_id: track.tracking_id,
          status: track.status,
          distance_cover: track.total_distance,
          charge: track.charge,
          reached: track.reached || null,
          transporter: track.transporter || null,
          products: productDetails,
          date: track.updatedAt,
        };
      })
    );

    return res.status(200).json({ data: result });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

}
const aiTest = async (req, res) => {
  try {
    const result = await api({
      apiKey: process.env.API_KEY,
      systemPrompt: `
        Give me the exact driving distance (as per Google Maps) 
        between the following two Indian pincodes: [PINCODE_1] and [PINCODE_2].

        Respond only in JSON:
        {
          "pincode_from": "[PINCODE_1]",
          "pincode_to": "[PINCODE_2]",
          "distance": "X km"
        }
      `,
      content: { from: 382405, to: 400001 }
    });

    return res.status(200).json({ ai_result: result });

  } catch (error) {
    console.error("aiTest error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const Activejobs = async (req, res) => {
  try {
    const tracks = await Track.find({ transporter: req.user }).lean();
    if (tracks.length === 0) return res.status(200).json([]);

    const trackingIds = tracks.map((t) => t.tracking_id);

    const payments = await shop.find({
      tracking_id: { $in: trackingIds },
    }).lean();

    const productIds = [...new Set(payments.map((p) => p.productid.toString()))];

    const productsData = await Product.find({
      _id: { $in: productIds },
    })
      .select("_id city")
      .lean();

    const productCityMap = {};
    productsData.forEach((prod) => {
      productCityMap[prod._id] = prod.city || "unknown";
    });

    const productMap = {};

    payments.forEach((p) => {
      if (!productMap[p.tracking_id]) productMap[p.tracking_id] = [];

      productMap[p.tracking_id].push({
        productId: p.productid,
        name: p.name,
        vendor: p.vendor,
        quantity: p.quantity,
        status: p.status,
        delivery: p.delivery,
        product_city: productCityMap[p.productid] || "unknown",
        delivery_city: p.delivery?.city || "unknown",
      });
    });

    const activeJobs = tracks
      .filter((track) => track.status !== "Delivered")
      .map((track) => ({
        _id: track._id,
        tracking_id: track.tracking_id,
        status: track.status,
        reached: track.reached || null,
        transporter: track.transporter,
        products: productMap[track.tracking_id] || [],
      }));

    return res.status(200).json(activeJobs);

  } catch (error) {
    console.error("getActiveJobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

}

module.exports = {
  updateTrack,
  delivered,
  rejected,
  aiTest,
  accepting,
  find,
  Activejobs,
  history
}