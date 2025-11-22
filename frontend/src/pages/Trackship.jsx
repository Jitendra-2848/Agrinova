import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft, FiPhone, FiTruck, FiPackage, FiCheckCircle } from "react-icons/fi";
import { useAuthStore } from "../lib/store";

const ShipmentTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialId = new URLSearchParams(location.search).get("tracking_id") || "";
  const { track_order, trackingData ,RemoveBuy} = useAuthStore();

  const [trackingId, setTrackingId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  const fetchTracking = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await track_order(id);
    } catch {
      setError("notfound");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) fetchTracking(initialId);
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      fetchTracking(trackingId);
      navigate(`?tracking_id=${trackingId}`, { replace: true });
    }
  };

  const detail = trackingData?.detail;
  const product = trackingData?.product;

  // STATUS COLOR
  const getStatusColor = (status) => {
    return status === "Delivered"
      ? "bg-green-100 text-green-700"
      : status === "Shipping"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-xl">

        {/* Back Button */}
        <button
          onClick={() => {RemoveBuy();navigate("/")}}
          className="flex items-center text-gray-600 hover:text-green-700 font-medium mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Home
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Track Shipment
        </h2>

        {/* Tracking Input */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          />
          <button
            type="submit"
            className="px-6 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            Track
          </button>
        </form>

        {/* Loading */}
        {loading && <p className="text-center text-gray-500">Fetching data...</p>}

        {/* Error */}
        {!trackingData && (
          <p className="text-center text-red-500 font-medium">
            Tracking ID not found
          </p>
        )}

        {/* Tracking Data */}
        {detail && (
          <div className="bg-white p-5 rounded-2xl shadow space-y-6 mt-4">

            {/* Tracking ID Box */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">TRACKING ID</p>
                <p className="text-lg font-bold text-gray-800">{detail.tracking_id}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(detail.status)}`}>
                {detail.status}
              </span>
            </div>

            {/* Timeline */}
            <div className="flex justify-between items-center relative mt-6">

              <div className="absolute w-full h-1 bg-gray-200 left-0 top-1/2 -translate-y-1/2"></div>

              {/* Progress Logic */}
              <div
                className="absolute h-1 bg-green-500 top-1/2 -translate-y-1/2 rounded-full transition-all"
                style={{
                  width:
                    detail.status === "Pending"
                      ? "0%"
                      : detail.status === "Shipping"
                      ? "50%"
                      : "100%",
                }}
              />

              {[FiPackage, FiTruck, FiCheckCircle].map((Icon, i) => {
                const active =
                  (detail.status === "Pending" && i === 0) ||
                  (detail.status === "Shipping" && i <= 1) ||
                  (detail.status === "Delivered");

                return (
                  <div key={i} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow ${
                        active ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <p className={`text-xs mt-2 ${active ? "text-green-600 font-semibold" : "text-gray-400"}`}>
                      {i === 0 ? "Placed" : i === 1 ? "Shipping" : "Delivered"}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* --- PRODUCT INFO CARD --- */}
            <div className="border-t pt-5 space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Product Details</h3>

              <div className="bg-gray-50 rounded-xl p-4 shadow-sm space-y-2">

                <p className="text-sm text-gray-500">PRODUCT TRACKING</p>
                <p className="font-semibold text-gray-800">{product?.tracking_id}</p>

                <p className="text-sm text-gray-500 mt-3">STATUS</p>
                <p className="font-semibold">{product?.status}</p>

                <p className="text-sm text-gray-500 mt-3">LAST LOCATION</p>
                <p className="font-semibold">{product?.reached}</p>

              </div>
            </div>

            {/* Contact Button */}
            <button
              onClick={() => setContactOpen(true)}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <FiPhone size={18} /> Contact Transporter
            </button>
          </div>
        )}

        {/* Contact Modal */}
        {contactOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-3">Transporter Details</h3>

              <p className="text-gray-700 mb-1">GreenExpress Logistics</p>
              <p className="text-gray-900 font-semibold mb-4">+91 98765 43210</p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setContactOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <a
                  href="tel:+919876543210"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ShipmentTracking;
