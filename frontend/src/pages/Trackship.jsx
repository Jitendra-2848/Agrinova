import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPackage, FiTruck, FiCheck, FiPhone, FiArrowLeft } from "react-icons/fi";

const ShipmentTracking = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  // Demo status data
  const demoTracking = {
    "ORD12345": [
      { stage: "Order Placed", time: "2025-02-01 10:30 AM", status: "completed" },
      { stage: "Packed & Ready", time: "2025-02-02 09:15 AM", status: "completed" },
      { stage: "Shipped", time: "2025-02-03 08:45 AM", status: "progress" },
      { stage: "Out For Delivery", time: "", status: "pending" },
      { stage: "Delivered", time: "", status: "pending" },
    ],
    "ORD56789": [
      { stage: "Order Placed", time: "2025-01-25 10:30 AM", status: "completed" },
      { stage: "Packed & Ready", time: "2025-01-26 09:15 AM", status: "completed" },
      { stage: "Shipped", time: "2025-01-27 08:45 AM", status: "completed" },
      { stage: "Out For Delivery", time: "2025-01-27 02:30 PM", status: "completed" },
      { stage: "Delivered", time: "2025-01-27 06:10 PM", status: "completed" },
    ]
  };

  const handleSearch = () => {
    if (demoTracking[orderId]) setTrackingData(demoTracking[orderId]);
    else setTrackingData("notfound");
  };

  const statusColor = {
    completed: "bg-green-600 text-white",
    progress: "bg-yellow-400 text-white animate-pulse",
    pending: "bg-gray-300 text-gray-700",
  };

  const statusIcon = {
    completed: <FiCheck />,
    progress: <FiTruck />,
    pending: <FiPackage />,
  };

  return (
    <div className="min-h-screen bg-green-50 px-4 py-10 flex justify-center">
      
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
        >
          <FiArrowLeft className="mr-2" /> Back to Home
        </button>

        <h2 className="text-2xl font-bold text-green-900 text-center">
          Track Your Shipment
        </h2>

        {/* Search Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. ORD12345)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border border-green-300 rounded-lg px-4 py-2 bg-green-50 focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition"
          >
            <FiSearch /> Track
          </button>
        </div>

        {/* Not Found */}
        {trackingData === "notfound" && (
          <p className="text-center text-red-600 font-semibold">
            ❌ Order not found
          </p>
        )}

        {/* Tracking Timeline */}
        {Array.isArray(trackingData) && (
          <div className="space-y-6 animate-fadeIn">

            {trackingData.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">

                {/* Icon Circle */}
                <div
                  className={`w-10 h-10 flex justify-center items-center rounded-full shadow-md ${statusColor[item.status]}`}
                >
                  {statusIcon[item.status]}
                </div>

                {/* Stage Info */}
                <div>
                  <p className="font-semibold text-green-900">{item.stage}</p>
                  <p className="text-sm text-gray-600">{item.time || "Pending..."}</p>

                  {idx < trackingData.length - 1 && (
                    <div className="ml-4 w-[2px] h-6 bg-green-300 mt-2"></div>
                  )}
                </div>
              </div>
            ))}

            {/* Contact Transporter Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setContactOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-2"
              >
                <FiPhone /> Contact Transporter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Transporter Modal */}
      {contactOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-green-900">Contact Transporter</h3>

            <p className="text-gray-700">
              Transporter Name: <span className="font-semibold">GreenExpress Logistics</span>
            </p>

            <p className="text-gray-700">
              Phone: <span className="font-semibold">+91 98765 43210</span>
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setContactOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>

              <a
                href="tel:+919876543210"
                className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShipmentTracking;
