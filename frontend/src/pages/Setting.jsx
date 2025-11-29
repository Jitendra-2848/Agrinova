import React, { useRef, useState } from "react";
import { CiCamera, CiUser, CiMail, CiPhone } from "react-icons/ci";
import { FiArrowLeft, FiCheck, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import toast from "react-hot-toast";

const Setting = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const { AuthUser, isUpdating } = useAuthStore();

  const [data, setData] = useState({
    firstname: AuthUser?.name || "i",
    email: AuthUser?.email || "",
    profile_pic: AuthUser?.profile_pic || null,
  });

  const [previewPic, setPreviewPic] = useState(AuthUser?.profile_pic || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!data.firstname.trim()) {
      toast.error("Name is required");
      return;
    }
    
    if (!data.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const { updateprofile } = useAuthStore.getState();
      await updateprofile(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setData({ ...data, profile_pic: reader.result });
      setPreviewPic(reader.result);
    };
  };

  const isLoading = isUpdating || isSubmitting;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 border border-gray-100">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium transition-all group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your profile details</p>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-400 shadow-lg bg-emerald-100">
              {previewPic ? (
                <img
                  src={previewPic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-600 text-4xl font-bold">
                  {data.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <label
              htmlFor="profile-upload"
              className={`absolute bottom-1 right-1 p-2.5 bg-emerald-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-emerald-700 transition-all ${
                isLoading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <CiCamera size={20} />
            </label>
            <input
              id="profile-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm">
          {isLoading ? "Please wait..." : "Tap the camera icon to update photo"}
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
              <CiUser size={18} />
              Full Name
            </label>
            <input
              type="text"
              name="firstname"
              value={data.firstname}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled={isLoading}
              className="w-full rounded-xl px-4 py-3 border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-emerald-500 focus:bg-white focus:ring-0 outline-none transition-all disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium text-sm mb-2">
              <CiMail size={18} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isLoading}
              className="w-full rounded-xl px-4 py-3 border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-emerald-500 focus:bg-white focus:ring-0 outline-none transition-all disabled:opacity-50"
            />
          </div>


          {/* Submit Button */}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" size={20} />
                Updating...
              </>
            ) : (
              <>
                <FiCheck size={20} />
                Save Changes
              </>
            )}
          </button>
        </form>

        {/* Account Info */}
        <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Account Info</h3>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-emerald-600 capitalize bg-emerald-100 px-3 py-1 rounded-full">
              {AuthUser?.role || "User"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Account Status</span>
            <span className="font-medium text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Active
            </span>
          </div>

          {AuthUser?.DOB && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date of Birth</span>
              <span className="font-medium text-gray-700">{AuthUser.DOB}</span>
            </div>
          )}

          {AuthUser?.createdAt && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member Since</span>
              <span className="font-medium text-gray-700">
                {new Date(AuthUser.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Setting;