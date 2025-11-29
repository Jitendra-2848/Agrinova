const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const farmer = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    Active_Crops: { type: Number, required: true },
    Total_Revenue: { type: Number, required: true },
    Products_listed: { type: Number, required: true },
    Monthly_sale: { type: Number, required: true },
    Monthly_Sales_History: [
      {
        month: String,
        revenue: Number,
        products_sold: Number,
        crops_active: Number,
      },
    ],
    Orders: [
      {
        date: Date,
        products_sold: Number,
        revenue: Number,
      },
    ],
    // Average_Rating: { type: Number, default: 0 },
    // Total_Reviews: { type: Number, default: 0 },
    // location: {
    //   type: { type: String, default: "Point" },
    //   coordinates: [Number],
    // },
    // Market_Sales: [
    //   {
    //     market: String,
    //     revenue: Number,
    //   },
    // ],
}, { timestamps: true });

module.exports = model("farmerdetail", farmer);
