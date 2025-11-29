const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const transporterSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  Active_Deliveries: { type: Number, required: true },
  Total_Distance: { type: Number, required: true }, // in km
  Completed_jobs: { type: Number, required: true },
  Earnings: { type: Number, required: true }, // total earnings
  Delivery_History: [
    {
      date: { type: Date, default: Date.now },
      distance: Number, // distance for that job
      earnings: Number, // earnings from that job
      status: { type: String, enum: ["completed", "canceled"], default: "completed" },
    },
  ], 
  // Rating: { type: Number, default: 0 }, // average rating
  // Total_Reviews: { type: Number, default: 0 },
  // Location: {
  //   type: { type: String, default: "Point" },
  //   coordinates: [Number], // [longitude, latitude]
  // },
}, { timestamps: true }); // ✅ adds createdAt and updatedAt automatically

module.exports = model("transporterdetail", transporterSchema);
