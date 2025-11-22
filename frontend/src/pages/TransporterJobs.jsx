import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import {
  FiArrowLeft,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiTruck,
} from "react-icons/fi";
import toast from "react-hot-toast";

const TransporterJobs = () => {
  const navigate = useNavigate();
  const { jobdata, findjob,acceptjob } = useAuthStore();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // Load jobs on mount
  useEffect(() => {
      setLoading(true);
      findjob();
      setLoading(false);
  }, []);

  // Sync when jobdata changes
  useEffect(() => {
    if (!jobdata) return;
    setJobs(jobdata);
  }, [jobdata]);

  // Accept job handler
  const handleAccept = async (trackingId) => {
    acceptjob(trackingId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors mb-4 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            DASHBOARD
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Available Loads
              </h1>
              <p className="text-slate-500 mt-1">
                Accept transport jobs in your area
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-sm text-slate-500 font-medium">
                Total Jobs
              </span>
              <p className="text-3xl font-bold text-green-600">{jobs.length}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
            <FiTruck className="mx-auto text-slate-300 text-6xl mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No Jobs Available
            </h3>
            <p className="text-slate-500">Check back later for new loads</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const isTaken = Boolean(job.transporter);
              // const isBusy = busyJobs[job.tracking_id];
              const product = job.products?.[0];
              const totalItems = product?.quantity || 1;
              const current = job.reached || "N/A";
              const destination = product?.delivery?.pincode || "N/A";

              return (
                <div
                  key={job.tracking_id}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-mono text-slate-600 font-bold">
                        #{job.tracking_id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                        isTaken
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {isTaken ? (
                        <>
                          <FiCheckCircle size={12} /> Assigned
                        </>
                      ) : (
                        <>
                          <FiClock size={12} /> Open
                        </>
                      )}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 space-y-5">
                    {/* Route Timeline */}
                    <div className="relative pl-6">
                      {/* Vertical Line */}
                      <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-green-400 to-slate-300 rounded-full"></div>

                      {/* From */}
                      <div className="relative mb-6">
                        <div className="absolute -left-6 top-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                          <FiMapPin className="text-white" size={12} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          From
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          City X - {current}
                        </p>
                      </div>

                      {/* To */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0 w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center">
                          <FiMapPin className="text-white" size={12} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          To
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          City X - {destination}
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FiBox className="text-blue-600" size={16} />
                        </div>
                        <span>
                          {totalItems} {totalItems > 1 ? "Items" : "Item"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                          <FiTruck className="text-purple-600" size={16} />
                        </div>
                        <span>Standard</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleAccept(job)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                          "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-green-200 active:scale-95"
                      }`}
                    >
                      Accept Job
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

export default TransporterJobs;