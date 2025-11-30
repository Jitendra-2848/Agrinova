const Product = require("../models/product.js");
const cloud = require("../middlewares/cloud.js")
const farmer = require("../models/user_detail/farmer.js")
const dis = require("../middlewares/distance.js");
const axios = require("axios");
//   Add a new product
const addProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { 
      Product_name, 
      Product_price, 
      Product_status, 
      Product_image, 
      Product_description, 
      Product_Qty, 
      Product_location, 
      location_pin 
    } = req.body;

    // 1. Upload Image to Cloudinary
    const uploadResult = await cloud.uploader.upload(Product_image);
    const uploadedPost = uploadResult.secure_url;
    console.log("Image Uploaded:", uploadedPost);

    // 2. Fetch City from Pincode
    let city = "Unknown";
    
    try {
      const details = await axios.get(`https://api.postalpincode.in/pincode/${location_pin}`);
      
      // Check if API returned valid data
      if (details.data[0].Status === "Success") {
        city = details.data[0].PostOffice[0].District;
      } else {
        // API returned "Error" status (Invalid Pincode)
        return res.status(400).json({ message: "Invalid Pincode provided. Please check your address." });
      }
    } catch (apiError) {
      console.error("Pincode API Error:", apiError.message);
      return res.status(400).json({ message: "Could not verify pincode. Please try again." });
    }

    // 3. Create Product Record
    const record = new Product({
      userId: req.user,       // comes from verifyToken
      Product_name,
      city: city,             // Fetched City
      Product_price,
      Product_status,
      Product_Qty,
      location_pin,
      Product_location,
      Product_image: uploadedPost,
      Product_description
    });

    // 4. Update Farmer Stats
    await farmer.findOneAndUpdate(
      { user: req.user }, 
      { $inc: { Products_listed: 1 } }
    );

    // 5. Save Product
    await record.save();

    return res.status(200).json({ message: "Product Added Successfully!", product: record });

  } catch (error) {
    console.log("Add Product Error:", error.message);
    return res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};

//   Edit product
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
      Product_image: image,
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
    const data = await farmer.findOneAndUpdate({ user: req.user }, {
      $inc: {
        Products_listed: -1,
      }
    })
    await Product.findByIdAndDelete(product_id);
    return res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//   Get ALL products
const getAllProducts = async (req, res) => {
  try {
    const allItems = await Product.find({});
    return res.status(200).json({ products: allItems });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//   Get products of logged-in user
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