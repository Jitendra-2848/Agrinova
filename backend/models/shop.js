const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const delivery = new Schema({
  address:{type:String,required:true},
  phone:{type:String,required:true},
  pincode:{type:Number,required:true},
})

const paymentSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, required: true },
  productid:{ type: Schema.Types.ObjectId, required: true },
  quantity:{type:Number,required:true},
  tracking_id: { type: String, required: true },
  status: { type: String, enum: ["Paid", "Pending", "Bad debt"] },
  delivery:{ type:delivery,required:true },
});

module.exports =  model("payment", paymentSchema);
