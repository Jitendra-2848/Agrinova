import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

const Buyandpayment = () => {
  const navigate = useNavigate();
  const { Buy, Tracking_id, buy_product } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!buy_product) {
      navigate("/"); // redirect if user opens /buy directly
    } else {
      setQuantity(1); // reset quantity
    }
  }, [buy_product]);

  if (!buy_product) return null; // safety

  const totalPrice = quantity * buy_product.Product_price;

  const handleSubmit = async () => {
    if (!address.trim() || !pincode.trim() || !phone.trim()) {
      alert("Please fill all details.");
      return;
    }

    if (!consent) {
      alert("You must consent to confirm the payment.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productid: buy_product._id,
        quantity,
        status: "Paid",
        delivery: { address, pincode, phone },
      };

      await Buy(payload);
      setSuccess(true);
    } catch (err) {
      console.error("Frontend error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this payment?")) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-medium">
        Processing...
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
        <div className="bg-white shadow-lg p-6 rounded-2xl max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-3">
            ✔ Payment Confirmed!
          </h2>
          <p className="text-gray-700 mb-4">
            Order has been successfully confirmed.
          </p>

          <div className="bg-gray-100 p-4 rounded-xl mb-6">
            <p className="font-semibold">Tracking ID:</p>
            <p className="text-blue-600 font-bold">{Tracking_id}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/track`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-xl font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-lg p-6 rounded-2xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Confirm Your Purchase
        </h2>

        {/* Product Info */}
        <div className="mb-6 p-4 border rounded-xl bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">{buy_product.Product_name}</h3>
          <p className="text-gray-700 mb-2">{buy_product.Product_description}</p>
          <p className="text-gray-800 font-semibold">
            Price: <span className="text-green-600">₹{buy_product.Product_price}</span>
          </p>
          <p className="text-gray-700">
            Available Quantity: <span className="text-green-600">{buy_product.Product_Qty}</span>
          </p>

          {/* Quantity input */}
          <div className="mt-4 flex items-center gap-3">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              value={quantity}
              placeholder="1"
              onChange={(e) => {
                const val = e.target.value;

                if (val.startsWith("0")) return;

                if (val === "") {
                  setQuantity("");
                  return;
                }

                const num = Number(val);
                if (!isNaN(num)) {
                  setQuantity(num > buy_product.Product_Qty ? buy_product.Product_Qty : num);
                }
              }}
              onBlur={() => {
                if (!quantity || Number(quantity) <= 0) {
                  setQuantity(1);
                }
              }}
              className="w-20 p-2 border rounded-xl text-center appearance-none"
              min={1}
              max={buy_product.Product_Qty}
            />
          </div>

          <p className="mt-2 text-gray-800 font-semibold">
            Total Price: <span className="text-green-600">₹{totalPrice}</span>
          </p>
        </div>

        {/* Address Inputs */}
        <label className="font-medium">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:ring focus:ring-blue-300 outline-none"
          rows={3}
          placeholder="Enter full address"
        />

        <label className="font-medium mt-4 block">Pincode</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setPincode(val); // only digits
          }}
          className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:ring focus:ring-blue-300 outline-none"
          placeholder="Enter area pincode"
        />

        <label className="font-medium mt-4 block">Mobile Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setPhone(val); // only digits
          }}
          className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:ring focus:ring-blue-300 outline-none"
          placeholder="Enter mobile number"
        />

        {/* Consent */}
        <div className="mt-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-gray-700 text-sm">
            I confirm the above details and agree to proceed with payment (simulated)
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!consent}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              consent ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm Payment
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buyandpayment;
