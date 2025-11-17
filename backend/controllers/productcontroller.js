const Product = require("../models/product.js");
const cloud = require("../middlewares/cloud.js")
// ✅ Add a new product
const addProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { Product_name, Product_price, Product_status, Product_image, Product_description } = req.body;
    const uploadResult = await cloud.uploader.upload(Product_image);
    uploadedPost = uploadResult.secure_url;
    console.log(uploadedPost)
    const record = new Product({
      userId: req.user,       // comes = require( verifyToken
      Product_name,
      Product_price,
      Product_status,
      Product_image: uploadedPost,
      Product_description
    });

    await record.save();

    return res.status(200).json({ message: "Product Added!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong!", error: error });
  }
};

// ✅ Edit product
const editProduct = async (req, res) => {
  try {
    const { Product_id, Product_name, Product_price, Product_status, Product_image, Product_description } = req.body;

    await Product.findByIdAndUpdate(Product_id, {
      Product_name,
      Product_price,
      Product_status,
      Product_image,
      Product_description
    });

    return res.status(200).json({ message: "Edit successful" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Delete product
const deleteProduct = async (req, res) => {
  try {
    const { Product_id } = req.body;

    await Product.findByIdAndDelete(Product_id);

    return res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Get ALL products
const getAllProducts = async (req, res) => {
  try {
    const allItems = await Product.find({});
    return res.status(200).json({ products: allItems });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Get products of logged-in user
const getMyProducts = async (req, res) => {
  try {
    const data = await Product.find({ userId: req.user });
    return res.status(200).json({ products: data });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const getproduct = async (req,res) => {
  try {
    const id = req.params.id;
    const data = await Product.findById(id);
    // console.log(data);
    return res.status(200).json({ products: data });
    // return res.status(200).json({ products: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getproduct,
}