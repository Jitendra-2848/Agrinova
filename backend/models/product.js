const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const productSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  Product_name: { type: String, required: true },
  Product_price: { type: String, required: true },
  Product_status: { type: String, default: "Out-Of-Stock" },
  Product_image: { type: String, required: true },
  special_price: { type: String, default: null },
  Product_description : {type:String,default:"No more information."},
  Product_location:{type:String,require:true},
  location_pin:{type:String,require:true},
});
module.exports =  model("Product", productSchema);