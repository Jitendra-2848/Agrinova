import React, { useState } from "react";
import { CiCamera } from "react-icons/ci";
import { useAuthStore } from "../lib/store";

const AddProduct = ({ onSubmit, isSubmitting }) => {
  const [product, setProduct] = useState({
    Product_name: "",
    Product_price: "",
    Product_status: "Out-Of-Stock",
    Product_image: "",
    Product_description: "",
  });
  const {AddProduct} = useAuthStore()
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProduct({ ...product, Product_image: reader.result });
      setPreviewImage(reader.result);
    };
    reader.onerror = () => console.error("Error reading file:", reader.error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AddProduct(product);
    // onSubmit(product);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mx-auto mt-6 space-y-6">
      <h2 className="text-xl font-bold text-green-900 text-center">Add Product</h2>

      {/* Image Upload */}
      <div className="flex justify-center relative w-32 mx-auto">
        <img
          src={previewImage || "/default-product.png"}
          alt="Product"
          className="w-32 h-32 object-cover rounded-lg border-2 border-green-400 shadow-md"
        />
        <label
          htmlFor="product-image"
          className={`absolute bottom-1 right-1 p-2 bg-green-100 rounded-full shadow-md cursor-pointer hover:bg-green-200 transition ${
            isSubmitting ? "pointer-events-none opacity-50 animate-pulse" : ""
          }`}
        >
          <CiCamera size={20} className="text-green-700" />
        </label>
        <input
          id="product-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <p className="text-center text-green-600 text-xs">
        {isSubmitting ? "Uploading..." : "Click to upload product image"}
      </p>

      {/* Product Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="Product_name"
          value={product.Product_name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full rounded-lg px-3 py-2 border border-green-200 bg-green-50 text-green-900 focus:ring-1 focus:ring-green-400 focus:outline-none text-sm"
          required
        />

        <input
          type="number"
          name="Product_price"
          value={product.Product_price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full rounded-lg px-3 py-2 border border-green-200 bg-green-50 text-green-900 focus:ring-1 focus:ring-green-400 focus:outline-none text-sm"
          required
        />
        <textarea maxLength={"200"}
          type="text"
          name="Product_description"
          value={product.Product_description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full rounded-lg px-3 py-2 border border-green-200 bg-green-50 text-green-900 focus:ring-1 focus:ring-green-400 focus:outline-none text-sm"
          required
        />
        <p className="text-xs text-gray-600">Description should be under 200 letter.</p>

        <select
          name="Product_status"
          value={product.Product_status}
          onChange={handleChange}
          className="w-full rounded-lg px-3 py-2 border border-green-200 bg-green-50 text-green-900 focus:ring-1 focus:ring-green-400 focus:outline-none text-sm"
        >
          <option value="Out-Of-Stock">Out-Of-Stock</option>
          <option value="In-Stock">In-Stock</option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ${
            isSubmitting ? "animate-pulse opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
