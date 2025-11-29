import React, { useEffect, useState } from "react";
import {
  FiTruck,
  FiMapPin,
  FiPackage,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

const ActiveDelivery = () => {
  const navigate = useNavigate();
  const { activejob, activejobdata } = useAuthStore();

  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch active jobs when page loads
  useEffect(() => {
    const loadActiveJobs = async () => {
      setLoading(true);
      try {
        await activejob(); // this will update activejobdata in the store
      } finally {
        setLoading(false);
      }
    };
    loadActiveJobs();
  }, [activejob]);

  // 2. Sync store data into local state
  useEffect(() => {
    if (!activejobdata) {
      setActiveJobs([]);
      return;
    }
    // If your store ever wraps it like { data: [...] }, handle that too
    const data = Array.isArray(activejobdata)
      ? activejobdata
      : activejobdata.data || [];
    setActiveJobs(data);
  }, [activejobdata]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-green-600 mb-3"
          >
            <FiArrowLeft /> DASHBOARD
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Active Deliveries
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Track your ongoing transport jobs
              </p>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200">
              <p className="text-xs text-gray-500 font-medium">Active Jobs</p>
              <p className="text-2xl font-bold text-green-600">
                {activeJobs.length}
              </p>
            </div>
          </div>
        </div>

        {/* Loading message */}
        {loading && (
          <div className="py-16 text-center text-gray-500 text-sm">
            Loading active jobs...
          </div>
        )}

        {/* Empty state */}
        {!loading && activeJobs.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <FiTruck className="mx-auto text-gray-300 text-5xl mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              No Active Deliveries
            </h3>
            <p className="text-gray-500 text-sm">
              Accept jobs to see them here.
            </p>
          </div>
        )}

        {/* Jobs grid */}
        {!loading && activeJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeJobs.map((job) => {
              // Basic data for each job
              const product = job.products?.[0];
              const items = product?.quantity || 1;
              const current = job.reached || "N/A";
              const destination = product?.delivery?.pincode || "N/A";
              const status = job.status || "In Transit";

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Card header: tracking id + status */}
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-mono text-gray-600 font-bold">
                      #{job.tracking_id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      {status}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-4 flex-1 space-y-4">
                    {/* Route */}
                    <div className="relative pl-6">
                      {/* Vertical line */}
                      <div className="absolute left-2 top-2 bottom-5 w-0.5 bg-gray-200" />

                      {/* Current location */}
                      <div className="relative mb-4">
                        <div className="absolute -left-6 top-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <FiMapPin className="text-white" size={10} />
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase">
                          Current
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {job?.products[0]?.product_city} - {Number(job.reached) || "N/A"}
                        </p>
                      </div>

                      {/* Destination */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                          <FiCheckCircle className="text-white" size={10} />
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase">
                          Destination
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {job?.products[0]?.delivery_city} - {destination}
                        </p>
                      </div>
                    </div>
                      <p className="text-sm">Tracking ID:<span className="font-semibold px-2">{job.tracking_id}</span></p>

                    {/* Simple progress bar */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-gray-600">
                          Progress
                        </span>
                        <span className="text-xs font-bold text-green-600">
                          In Transit
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "60%" }} // static progress for now
                        />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiPackage className="text-green-600" />
                        <span>
                          {items} item{items > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiTruck className="text-green-600" />
                        <span>Standard</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer button */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() =>
                        navigate(`/track?tracking_id=${job.tracking_id}`)
                      }
                      className="w-full py-3 rounded-lg font-bold text-sm bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                      Track Delivery
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveDelivery;