const express = require("express");
const verifyToken  = require("../middlewares/authmiddleware.js");
const { farmer_detail, vendor_detail, transporter_detail } = require("../controllers/detail_about_user.js");
const router = express.Router();

router.get("/farmer", verifyToken, farmer_detail);
router.get("/vendor",verifyToken, vendor_detail);
router.get("/transporter",verifyToken, transporter_detail);
module.exports = router;
