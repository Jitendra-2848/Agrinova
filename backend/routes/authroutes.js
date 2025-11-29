const router = require("express").Router();

const { 
  registerUser, 
  loginUser, 
  getProfile, 
  logoutUser, 
  updateprofile 
} = require("../controllers/authcontroller.js");

const verifyToken = require("../middlewares/authmiddleware.js");
const User = require("../models/user.js"); // Make sure to import User model

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getProfile);
router.post("/logout", verifyToken, logoutUser);
router.put("/profileupdate", verifyToken, updateprofile);

// ✅ ADD THIS ROUTE - Get user by ID (for starting chat)
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // ✅ Return user directly (not wrapped in { user: ... })
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADD THIS ROUTE - Get all users for chat list (only vendors & farmers)
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