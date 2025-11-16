const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  role: { type: String, enum: ["vendor", "farmer"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bargain: { type: Object, default: {} }
});

const userSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "userdata", required: true },
  farmer: { type: Schema.Types.ObjectId, ref: "userdata", required: true }
});

const message = new Schema({
  user: { type: userSchema, required: true },
  message: { type: [messageSchema], default: [] },
  offer: {}
});
module.exports = model("message", message);
