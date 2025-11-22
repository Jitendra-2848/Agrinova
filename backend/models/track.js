const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const trackSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  tracking_id: { type: String, required: true },
  transporter:{type:Schema.Types.ObjectId,default:null,ref:"User"},
  reached: { type: String },
  status: { type: String, enum: ["Delivered", "Delivering", "Shipping"] }
});

module.exports =  model("track", trackSchema);
