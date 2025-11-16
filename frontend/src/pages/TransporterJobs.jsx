import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TransporterJobs = () => {
  const initialJobs = [
    {
      id: 101,
      product: "Fresh Tomatoes",
      pickup: "Nashik, Maharashtra",
      drop: "Mumbai, Maharashtra",
      weight: "800 kg",
      transportCharges: 2500, // income for transporter
      distance: "180 km",
      farmer: "Ramesh Patil",
      vendor: "ABC Traders",
      farmerNumber: "+91 9876543210",
      vendorNumber: "+91 9123456780",
      accepted: false,
    },
    {
      id: 102,
      product: "Organic Wheat",
      pickup: "Indore, MP",
      drop: "Ahmedabad, Gujarat",
      weight: "1.2 Tons",
      transportCharges: 4200,
      distance: "500 km",
      farmer: "Mahesh Verma",
      vendor: "GrainMart Pvt Ltd",
      farmerNumber: "+91 9988776655",
      vendorNumber: "+91 9871122334",
      accepted: false,
    },
    {
      id: 103,
      product: "Sugarcane",
      pickup: "Kolhapur, Maharashtra",
      drop: "Pune, Maharashtra",
      weight: "2 Tons",
      transportCharges: 3500,
      distance: "230 km",
      farmer: "Gopal Shinde",
      vendor: "SweetSugar Traders",
      farmerNumber: "+91 9765432100",
      vendorNumber: "+91 9123459876",
      accepted: false,
    },
  ];

  const [jobs, setJobs] = useState(initialJobs);
  const navigate = useNavigate()
  const handleAccept = (id) => {
    setJobs(
      jobs.map((job) => (job.id === id ? { ...job, accepted: true } : job))
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
      >
        ⬅️ Back to Home
      </button>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Available Transport Jobs 🚚
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6"
          >
            {/* Product & Order ID */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-800">{job.product}</h2>
              <span className="text-sm text-gray-500 font-medium">
                Order ID: #{job.id}
              </span>
            </div>

            {/* Route & Distance (Visible before accepting) */}
            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
              <span className="text-gray-500">📍</span>
              <p>
                {job.pickup} <span className="mx-2">🡆</span> {job.drop} |{" "}
                {job.distance}
              </p>
            </div>

            {/* Transport Charges (income for transporter) */}
            <p className="text-gray-800 font-semibold mb-4">
              Expected Transport Charges: ₹{job.transportCharges}
            </p>

            {/* Accept Button (Only if not accepted) */}
            {!job.accepted && (
              <button
                className="mt-2 w-full py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition"
                onClick={() => handleAccept(job.id)}
              >
                Accept Job
              </button>
            )}

            {/* Post-Acceptance Details */}
            {job.accepted && (
              <div className="mt-4 space-y-3 text-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-2 text-gray-600 text-sm gap-2">
                  <span>
                    Farmer:{" "}
                    <span className="font-medium text-gray-800">
                      {job.farmer}
                    </span>
                  </span>
                  <span>
                    Vendor:{" "}
                    <span className="font-medium text-gray-800">
                      {job.vendor}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between text-gray-600 text-sm gap-2">
                  <span>
                    Farmer Contact:{" "}
                    <span className="font-medium text-gray-800">
                      {job.farmerNumber}
                    </span>
                  </span>
                  <span>
                    Vendor Contact:{" "}
                    <span className="font-medium text-gray-800">
                      {job.vendorNumber}
                    </span>
                  </span>
                </div>

                <div className="flex justify-between mt-2 text-gray-700 text-sm">
                  <p>
                    <span className="font-semibold">Weight:</span> {job.weight}
                  </p>
                  <p>
                    <span className="font-semibold">Transport Charges:</span> ₹
                    {job.transportCharges}
                  </p>
                </div>

                <button
                  className="mt-4 w-full py-2 rounded-lg font-semibold bg-gray-400 cursor-not-allowed text-white"
                  disabled
                >
                  Accepted ✅
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransporterJobs;
