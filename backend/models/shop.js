const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, required: true },
  tracking_id: { type: String, required: true },
  status: { type: String, enum: ["Success", "Pending", "Bad debt"] }
});

module.exports =  model("payment", paymentSchema);
