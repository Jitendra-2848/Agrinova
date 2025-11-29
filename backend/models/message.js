const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Bargain/Offer Schema
const offerSchema = new Schema({
  offerId: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  originalPrice: { type: Number, required: true },
  offeredPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected", "countered", "expired"], 
    default: "pending" 
  },
  offeredBy: { type: String, enum: ["vendor", "farmer"], required: true },
  counterPrice: { type: Number },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  respondedAt: { type: Date }
});

// Individual message schema
const messageSchema = new Schema({
  role: { type: String, enum: ["vendor", "farmer"], required: true },
  content: { type: String },
  messageType: { 
    type: String, 
    enum: ["text", "offer", "offer_response", "system"], 
    default: "text" 
  },
  offer: { type: offerSchema },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

// User pair schema
const userSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "userdata", required: true },
  farmer: { type: Schema.Types.ObjectId, ref: "userdata", required: true }
});

// Main conversation schema
const conversationSchema = new Schema({
  user: { type: userSchema, required: true },
  messages: { type: [messageSchema], default: [] },
  activeOffers: { type: [offerSchema], default: [] },
  lastMessage: { type: Date, default: Date.now },
  unreadVendor: { type: Number, default: 0 },
  unreadFarmer: { type: Number, default: 0 }
}, { timestamps: true });

// Index for faster queries
conversationSchema.index({ "user.vendor": 1, "user.farmer": 1 });
conversationSchema.index({ lastMessage: -1 });

module.exports = model("message", conversationSchema);