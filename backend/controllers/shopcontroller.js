const { api } = require( "../utils/transporter.js");
const Message = require( "../models/message.js");
const Shop = require( "../models/shop.js");
const Track = require( "../models/track.js");
const { v4: uuidv4 } = require('uuid');

// ✅ Payment success → create order + tracking
 const paymentSuccess = async (req, res) => {
  try {
    const { productid,quantity,status,delivery } = req.body;
    console.log(req.body);
    const trackingId = uuidv4();
    const shopRecord = new Shop({
      vendor: req.user,
      productid:productid,
      tracking_id: trackingId,
      quantity:quantity,
      status:status,
      delivery:delivery,
    });
    const MakingTrack = new Track({
      user:req.user,
      tracking_id:trackingId,
      reached:delivery.pincode,
      status:"Placed",
    })
    console.log(MakingTrack);
    console.log(shopRecord)
    await shopRecord.save();
    await MakingTrack.save();
    return res.status(200).json(shopRecord);
  } catch (error) {
    console.error("paymentSuccess error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
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