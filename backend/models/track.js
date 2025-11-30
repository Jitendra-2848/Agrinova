const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const trackSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  tracking_id: { type: String, required: true },
  transporter:{type:Schema.Types.ObjectId,default:null,ref:"User"},
  reached: { type: String },
  charge:{type:Number,required:true},
  product:{type:Array,require:true},
  // distance_cover:{type:Number,default:0},
  total_distance:{type:Number,default:0},
  status: { type: String, enum: ["Delivered", "Delivering", "Shipping","Placed"] }
},{timestamps:true});

module.exports =  model("track", trackSchema);
