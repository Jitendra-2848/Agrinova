const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const delivery = new Schema({
  address:{type:String,required:true},
  pincode:{type:Number,required:true},
  city:{type:String,default:"unknown"},
})

const paymentSchema = new Schema({
  farmer: { type: Schema.Types.ObjectId, required: true },
  vendor: { type: Schema.Types.ObjectId, required: true },
  productid:{ type: Schema.Types.ObjectId, required: true },
  quantity:{type:Number,required:true},
  price:{type:Object,require:true},
  distance:{type:Number,default:0},
  tracking_id: { type: String, required: true },
  status: { type: String, enum: ["Paid", "Pending", "Bad debt"] },
  city:{type:String,default:"unknown"},
  delivery:{ type:delivery,required:true },
});
if (mongoose.models.payment) {
  delete mongoose.models.payment;
}


module.exports =  model("payment", paymentSchema);
