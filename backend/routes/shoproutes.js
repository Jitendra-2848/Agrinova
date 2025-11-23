const express = require("express");

const { paymentSuccess, cancelOrder } = require("../controllers/shopcontroller.js");
const  verifyToken  = require("../middlewares/authmiddleware.js");
const verifybuyer = require("../middlewares/buy.js");

const router = express.Router();

router.post("/payment", verifyToken,verifybuyer, paymentSuccess);
router.post("/cancel", verifyToken,verifybuyer, cancelOrder);

module.exports = router;
