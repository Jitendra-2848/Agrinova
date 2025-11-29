const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const vendorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  Active_Orders: { type: Number, required: true },
  Total_Purchases: { type: Number, required: true }, // total items purchased
  Wishlist_Items: { type: Number, required: true },
  Total_Spent: { type: Number, required: true }, // total money spent
  Purchase_History: [
    {
      date: { type: Date, default: Date.now },
      product_id:  { type: Schema.Types.ObjectId, required: true, ref: "Product" },
      quantity: {type:Number,default:1},
      amount: Number, // amount spent for that purchase
      status: { type: String, enum: ["completed", "canceled"], default: "completed" },
    },
  ],
  // Rating: { type: Number, default: 0 }, // average rating if needed
  // Total_Reviews: { type: Number, default: 0 },
}, { timestamps: true }); // adds createdAt (registration time) & updatedAt

module.exports = model("vendordetail", vendorSchema);
