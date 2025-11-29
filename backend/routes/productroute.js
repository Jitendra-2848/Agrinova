const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authmiddleware.js");
const Product = require("../models/product.js");
const {
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getproduct
} = require("../controllers/productcontroller.js");

// ... your existing routes ...
router.post("/add", verifyToken, addProduct);
router.put("/edit", verifyToken, editProduct);
router.delete("/delete", verifyToken, deleteProduct);
router.get("/all", getAllProducts);
router.get("/mine", verifyToken, getMyProducts);
router.get("/:id", verifyToken, getproduct);
// Get products by farmer ID (for bargaining)
router.get("/farmer/:farmerId", verifyToken, async (req, res) => {
  try {
    const { farmerId } = req.params;

    const products = await Product.find({
      userId: farmerId,
      Product_status: "In-Stock",
      Product_Qty: { $gt: 0 },
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Get products by farmer error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;