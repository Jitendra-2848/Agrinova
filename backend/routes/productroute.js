const express = require("express");

const {
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getproduct
} = require("../controllers/productcontroller.js");

const verifyToken = require("../middlewares/authmiddleware.js");

const router = express.Router();

router.post("/add", verifyToken, addProduct);
router.put("/edit", verifyToken, editProduct);
router.delete("/delete", verifyToken, deleteProduct);
router.get("/all", getAllProducts);
router.get("/mine", verifyToken, getMyProducts);
router.get("/:id", verifyToken, getproduct);

module.exports = router;
