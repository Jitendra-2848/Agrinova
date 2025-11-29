const express = require("express");
const { 
  getMessages, 
  sendMessage, 
  sendOffer, 
  respondToOffer,
  getConversations,
  deleteChat,
  getUserById
} = require("../controllers/messagecontroller.js");
const verifyToken = require("../middlewares/authmiddleware.js");
const User = require("../models/user.js");

const router = express.Router();

// Message routes
router.post("/get", verifyToken, getMessages);
router.post("/send", verifyToken, sendMessage);
router.post("/offer", verifyToken, sendOffer);
router.post("/offer/respond", verifyToken, respondToOffer);
router.post("/conversations", verifyToken, getConversations);
router.post("/delete", verifyToken, deleteChat);

// Get user by ID for starting chat
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users for chat list (only vendors & farmers)
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find(
      { 
        _id: { $ne: req.user },
        role: { $in: ["vendor", "farmer"] }
      },
      { password: 0 }
    ).select("name email phone profile_pic role");

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;