const express = require("express");

const { addCart, getCart }  = require("../controllers/cartcontroller.js");
const verifyToken  = require("../middlewares/authmiddleware.js");

const router = express.Router();

router.post("/add", verifyToken, addCart);
router.get("/me",verifyToken, getCart);
module.exports = router;
