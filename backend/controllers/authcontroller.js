const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const cloud = require("../middlewares/cloud.js")
//Cookie options (secure for production)
const cookieOptions = {
  httpOnly: true,
  secure: true,   
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};
const VendorDetail = require("../models/user_detail/vendor")
const FarmerDetail= require("../models/user_detail/farmer")
const TransporterDetail = require("../models/user_detail/transporter")

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role });
    const Models = {
      farmer: FarmerDetail,
      vendor: VendorDetail,
      transporter: TransporterDetail
    };
    const Defaults = {
      farmer: {
        Active_Crops: 0,
        Total_Revenue: 0,
        Products_listed: 0,
        Monthly_sale: 0,
        Monthly_Sales_History:[],
        Crops:[],
        Orders:[],
      },
      vendor: {
        Active_Orders: 0,
        Total_Purchases: 0,
        Wishlist_Items: 0,
        Total_Spent: 0,
        Purchase_History:[],
      },
      transporter: {
        Active_Deliveries: 0,
        Total_Distance: 0,
        Completed_jobs: 0,
        Earnings: 0,
        Delivery_History:[],
      }
    };
    const DetailModel = Models[role];
    if (!DetailModel) return res.status(400).json({ error: "Invalid user role" });
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const record = await DetailModel.create({
      user: newUser._id,
      ...Defaults[role]
    });
    await record.save();
    res.cookie("token", token, cookieOptions);
    return res.status(201).json({
      message: "Signup successful!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      details: record
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("hii");
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, cookieOptions);
    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user)
      return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
const updateprofile = async (req, res) => {
  try {
    console.log(req.body);
    const { firstname, email, profile_pic } = req.body;
    let image;
    if (profile_pic.includes("https")) {
      image = profile_pic;
      console.log("hello");
    }
    else {
      const uploadResult = await cloud.uploader.upload(profile_pic)
      image = uploadResult.secure_url
    }
    await User.findByIdAndUpdate(req.user, {
      name: firstname,
      email: email,
      profile_pic: image,
    })
    res.status(200).json({ message: "updated" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  updateprofile,
}