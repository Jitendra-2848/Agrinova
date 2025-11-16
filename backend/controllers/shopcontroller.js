const { api } = require( "../utils/transporter.js");
const Message = require( "../models/message.js");
const Shop = require( "../models/shop.js");
const Track = require( "../models/track.js");
const v4 = require( "uuid").uuidv4;

// ✅ Payment success → create order + tracking
 const paymentSuccess = async (req, res) => {
  try {
    const { id, status, location } = req.body;

    const trackingId = uuidv4();

    // ✅ Create shop order
    const shopRecord = new Shop({
      vendor: id,
      tracking_id: trackingId,
      status
    });

    // ✅ Generate AI-based travel path
    const generatedPlaces = await api({
      apiKey: process.env.API_KEY,
      systemPrompt: process.env.PROMPT_LOCATION,
      content: { 
        from: location.from, 
        to: location.to 
      },
    });

    // ✅ Create tracking record
    const trackRecord = new Track({
      user: id,
      tracking_id: trackingId,
      places: generatedPlaces,
      status: "Shipping"
    });

    await shopRecord.save();
    await trackRecord.save();

    return res.status(200).json({
      message: "Order placed!",
      tracking_id: trackingId,
      places: generatedPlaces
    });

  } catch (error) {
    console.error("paymentSuccess error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Cancel order → delete shop + tracking records
 const cancelOrder = async (req, res) => {
  try {
    const { id } = req.body;

    await Shop.deleteOne({ tracking_id: id });
    await Track.deleteOne({ tracking_id: id });

    return res.status(200).json({ message: "Order cancelled successfully" });

  } catch (error) {
    console.error("cancelOrder error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  paymentSuccess,
  cancelOrder,
}