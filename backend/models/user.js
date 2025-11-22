const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_pic:{type:String,default:null},
    role: { type: String, enum: ["farmer", "vendor", "transporter"], required: true },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("User", userSchema);