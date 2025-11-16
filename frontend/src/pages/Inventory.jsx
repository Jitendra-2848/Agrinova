import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import { useAuthStore } from "../lib/store";

const Inventory = () => {
  const { getproduct, userproduct } = useAuthStore();
  const navigate = useNavigate();
  const [product, setproduct] = useState(userproduct);

  useEffect(() => {
    getproduct();
    setproduct(userproduct)
  }, [userproduct]);

  const handleDelete = (id) => {
    console.log("delete", id);
  };

  const handleEdit = (product) => {
    alert(`Edit product: ${product.Product_name}`);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 md:p-10 relative">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-green-900 hover:text-green-700 font-semibold text-lg"
        >
          <FiArrowLeft className="mr-2 text-xl" /> Back to Home
        </button>
      </div>

      {/* Add Product Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/addProduct")}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg text-xl transition flex items-center"
        >
          <FiPlus className="mr-1" /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {product.map((product) => (
          <div
            key={product._id}
            className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition hover:scale-105 hover:shadow-2xl duration-300 group"
          >
            <img
              src={product.Product_image}
              alt={product.Product_name}
              className="w-full h-40 object-cover"
            />

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-2 transition duration-300">
              <button
                onClick={() => handleEdit(product)}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md"
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-full shadow-md"
              >
                🗑
              </button>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold text-green-900">
                {product.Product_name}
              </h2>
              <p className="text-green-700 text-sm">{product.Product_description}</p>

              <div className="mt-2 flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  {product.Product_price}
                </span>

                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {product.Product_status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
