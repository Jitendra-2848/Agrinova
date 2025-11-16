const Cart = require("../models/cart.js");

 const addCart = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ USER:", req.user);

    const { totalQty, totalbill, products } = req.body;

    if (!req.user) {
      return res.status(400).json({ message: "User missing" });
    }

    const record = new Cart({
      userId: req.user,
      totalQty,
      totalbill,
      products
    });

    await record.save();

    console.log("CART SAVED:", record);

    return res.status(200).json({ message: "Cart updated", record });

  } catch (error) {
    console.error("CART ERROR:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};


 const getCart = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const data = await Cart.findOne({ userId: req.user });

    return res.status(200).json({ message: data });
  } catch (error) {
    console.error("CART GET ERROR:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};


module.exports = {
  addCart,
  getCart
}