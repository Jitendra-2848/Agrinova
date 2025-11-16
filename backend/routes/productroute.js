const express = require("express");

const {
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts
} = require("../controllers/productcontroller.js");

const  verifyToken  = require("../middlewares/authmiddleware.js");

const router = express.Router();

router.post("/add", verifyToken, addProduct);
router.put("/edit", verifyToken, editProduct);
router.delete("/delete", verifyToken, deleteProduct);
router.get("/all", getAllProducts);
router.get("/mine", verifyToken, getMyProducts);

module.exports = router;
