const express = require("express");

const { paymentSuccess, cancelOrder } = require("../controllers/shopcontroller.js");
const  verifyToken  = require("../middlewares/authmiddleware.js");

const router = express.Router();

router.post("/payment", verifyToken, paymentSuccess);
router.post("/cancel", verifyToken, cancelOrder);

module.exports = router;
