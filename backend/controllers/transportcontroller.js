const { api } = require( "../utils/transporter.js");
const Track = require( "../models/track.js");

// ✅ Update tracking while shipment is moving
 const updateTrack = async (req, res) => {
  try {
    const { id, reachedAt } = req.body;

    const updated = await Track.findByIdAndUpdate(
      id,
      { reached: reachedAt, status: "Delivering" },
      { new: true }
    );

    return res.status(200).json({
      message: "Tracking updated",
      data: updated
    });
  } catch (error) {
    console.error("updateTrack error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Final Delivery Completed
 const delivered = async (req, res) => {
  try {
    const { id, reachedAt } = req.body;

    const updated = await Track.findByIdAndUpdate(
      id,
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

module.exports = {
  updateTrack,
  delivered,
  rejected,
  aiTest
}