const Product = require("../models/product.js");
const cloud = require("../middlewares/cloud.js")
// ✅ Add a new product
const addProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { Product_name, Product_price, Product_status, Product_image, Product_description, Product_Qty, Product_location, location_pin } = req.body;
    const uploadResult = await cloud.uploader.upload(Product_image);
    uploadedPost = uploadResult.secure_url;
    console.log(uploadedPost)
    const record = new Product({
      userId: req.user,       // comes = require( verifyToken
      Product_name,
      Product_price,
      Product_status,
      Product_Qty,
      location_pin,
      Product_location,
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
    const { Product_id, Product_name, Product_price, Product_status, Product_image, Product_description, Product_Qty, Product_location, location_pin, special_price } = req.body;
    let image;
    if (Product_image.includes("https")) {
      image = Product_image
      console.log("hello");
    }
    else {
      const uploadResult = await cloud.uploader.upload(Product_image)
      image = uploadResult.secure_url
    }
    const record = await Product.findByIdAndUpdate(Product_id, {
      Product_name,
      Product_price,
      Product_status,
      Product_image:image,
      Product_description,
      special_price,
      Product_Qty,
      Product_location,
      location_pin
    });
    console.log(record);
    return res.status(200).json({ message: "Edit successful" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.body;
    console.log(product_id);
    await Product.findByIdAndDelete(product_id);
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
const getproduct = async (req, res) => {
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