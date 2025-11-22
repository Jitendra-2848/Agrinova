const router = require("express").Router();

const { registerUser, loginUser, getProfile, logoutUser, updateprofile } = require("../controllers/authcontroller.js");

const verifyToken  = require("../middlewares/authmiddleware.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getProfile);
router.post("/logout", verifyToken, logoutUser);
router.put("/profileupdate", verifyToken,updateprofile);


module.exports = router;