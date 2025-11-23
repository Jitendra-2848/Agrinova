const { api } = require("../utils/transporter.js");
const Track = require("../models/track.js");
const shop = require("../models/shop.js");
// ✅ Update tracking while shipment is moving
const updateTrack = async (req, res) => {
  try {
    const { id, reachedAt,transporter } = req.body;
    if(transporter != req.user){
      return res.status(500).json({ message: "Chalaki nhi mittar jo tera kaam hai vo kar dusro ki chize change mat kar."});
    }



    //here you have to update the distance also DEVANASH   


    const updated = await Track.findOneAndUpdate(
      {tracking_id:id},
      { reached: reachedAt, status: "Delivering",
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
    const { tracking_id, pincode} = req.body;
    console.log(req.body);
    const record = await Track.findOneAndUpdate({ tracking_id: tracking_id }, {
      reached: pincode,
      status: "Shipping",
      transporter: req.user,
    })
    await record.save()
    return res.status(200).json(record)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server errror.." });
  }
}
const find = async (req, res) => {
  try {
    // 1️⃣ Fetch all Track entries with no transporter
    const tracks = await Track.find({ transporter: null }).lean();

    // 2️⃣ For each track, fetch related products from Payment collection
    const result = await Promise.all(
      tracks.map(async (track) => {
        const products = await shop.find({ tracking_id: track.tracking_id }).lean();

        // Map products to include only relevant details (avoid sending Mongo internals)
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
          charge:track.charge,
          reached: track.reached || null,
          transporter: track.transporter || null,
          products: productDetails,
        };
      })
    );

    // 3️⃣ Send response
    return res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ✅ Final Delivery Completed
const delivered = async (req, res) => {
  try {
    const { id, reachedAt,transporter } = req.body;
    if(transporter != req.user){
      return res.status(500).json({ message: "Chalaki nhi mittar jo tera kaam hai vo kar dusro ki chize change mat kar."});
    }
    const updated = await Track.findOneAndUpdate(
      {tracking_id:id},
      { reached: reachedAt, status: "Delivered" },
      { new: true }
    );
    return res.status(200).json({
      message: "Order Delivered",
      data: updated
    });
  } catch (error) {
    console.error("delivered error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Order Rejected (Future logic placeholder)
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
const history = async(req,res)=>{
  try {
    // 1️⃣ Fetch all delivered tracks for this transporter
    const tracks = await Track.find({
        transporter: req.user,
        status: "Delivered"
    }).lean();

    // 2️⃣ For each track, fetch related products from shop collection
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
          distance_cover:track.distance_cover,
          charge:track.charge,
          reached: track.reached || null,
          transporter: track.transporter || null,
          products: productDetails,
          date:track.updatedAt,
        };
      })
    );

    // 3️⃣ Send response
    return res.status(200).json({ data: result });

} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
}

}
// ✅ AI Test Helper (For debugging only)
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
const Activejobs = async(req,res)=>{
  try {
  // 1️⃣ Fetch tracks for this transporter
  const tracks = await Track.find({ transporter: req.user }).lean();
  const trackingIds = tracks.map((t) => t.tracking_id);

  // 2️⃣ Fetch products for these tracking IDs
  const products = await shop.find({ tracking_id: { $in: trackingIds } }).lean();

  // 3️⃣ Group products by tracking_id
  const productMap = {};
  products.forEach((p) => {
    if (!productMap[p.tracking_id]) productMap[p.tracking_id] = [];
    productMap[p.tracking_id].push({
      productId: p.productid,
      name: p.name,
      vendor: p.vendor,
      quantity: p.quantity,
      status: p.status,
      delivery: p.delivery,
    });
  });

  // 4️⃣ Build active jobs excluding Delivered ones
  let activeJobs = tracks
    .map((track) => ({
      _id: track._id,
      tracking_id: track.tracking_id,
      status: track.status,
      reached: track.reached || null,
      transporter: track.transporter,
      products: productMap[track.tracking_id] || [],
    }))
    .filter((job) => job.status !== "Delivered"); // 🚀 REMOVE delivered jobs

  // 5️⃣ Return
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