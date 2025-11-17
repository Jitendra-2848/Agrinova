import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../lib/store";
import { useNavigate } from "react-router-dom";

const Buyandpayment = () => {
  const navigate = useNavigate();
  const { AuthUser,Buy,Tracking_id } = useAuthStore();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [trackingId, setTrackingId] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!address || !phone) {
      alert("Please fill all details.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        productid:"1",
        status: "Paid",
        delivery: {
          address,
          phone,
        },
      };
      Buy(payload);
    //   setTrackingId(res.data.tracking_id);
      setSuccess(true);
    } catch (err) {
      console.error("frontend error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl">
        Processing...
      </div>
    );
  }

  // SUCCESS UI
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white shadow-lg p-6 rounded-2xl max-w-md w-full text-center">

          <h2 className="text-2xl font-semibold text-green-600 mb-3">
            ✔ Order Placed Successfully!
          </h2>

          <p className="text-gray-700 mb-3">
            Your order has been placed and will be delivered soon.
          </p>

          <div className="bg-gray-100 p-4 rounded-xl mb-4">
            <p className="font-semibold">Tracking ID:</p>
            <p className="text-blue-600 font-bold">{Tracking_id}</p>
          </div>

          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold"
            onClick={() => navigate(`/track/${trackingId}`)}
          >
            Track My Order
          </button>

        </div>
      </div>
    );
  }

  // MAIN FORM UI
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-lg p-6 rounded-2xl max-w-md w-full">

        <h2 className="text-2xl font-semibold mb-4">
          Enter Delivery Details
        </h2>

        {/* ADDRESS */}
        <label className="font-medium">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:ring"
          rows="3"
          placeholder="Enter full address"
        />

        {/* PHONE */}
        <label className="font-medium mt-4 block">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:ring"
          placeholder="Enter contact number"
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          Confirm Order
        </button>

      </div>
    </div>
  );
};

export default Buyandpayment;
