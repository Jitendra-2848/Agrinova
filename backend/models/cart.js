const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const cartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "userdata", required: true },
  totalQty: { type: String, default: "0" },
  totalbill: { type: String, default: "0" },
  products: { type: Array, default: [] },
});

module.exports = model("cart", cartSchema);