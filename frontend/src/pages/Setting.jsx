import React, { useRef, useState } from "react";
import { CiCamera, CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Profilepage = ({ user, updateProfile, isUpdating }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [data, setData] = useState({
    firstname: user?.firstname || "",
    email: user?.mobile_email || "",
    profile_pic: user?.profile_pic || "",
  });

  const [previewPic, setPreviewPic] = useState(user?.profile_pic || "");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setData({ ...data, profile_pic: reader.result });
      setPreviewPic(reader.result);
    };
    reader.onerror = () => console.error("Error reading file:", reader.error);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="text-green-700 hover:text-green-900 font-semibold text-lg flex items-center gap-2"
        >
          🔙 Back
        </button>

        {/* Profile Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-green-900">Profile</h1>
          <p className="text-green-600 text-sm">Manage your profile information</p>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center relative w-32 mx-auto">
          <img
            src={previewPic || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-green-400 shadow-md"
          />
          <label
            htmlFor="profile-upload"
            className={`absolute bottom-1 right-1 p-2 bg-green-100 rounded-full shadow-md cursor-pointer hover:bg-green-200 transition ${
              isUpdating ? "pointer-events-none opacity-50 animate-pulse" : ""
            }`}
          >
            <CiCamera size={20} className="text-green-700" />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <p className="text-center text-green-600 text-xs mt-1">
          {isUpdating ? "Uploading..." : "Click the camera to change profile picture"}
        </p>

        {/* Profile Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            {/* First Name */}
            <div>
              <label className="flex items-center gap-2 text-green-700 font-medium text-sm mb-1">
                <CiUser /> First Name
              </label>
              <input
                type="text"
                name="firstname"
                value={data.firstname}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full rounded-lg px-3 py-2 border border-green-200 bg-green-50 text-green-900 focus:ring-1 focus:ring-green-400 focus:outline-none text-sm"
              />
            </div>

            {/* Email / Mobile */}
            <div>
              <label className="text-green-700 font-medium text-sm mb-1 block">Email / Mobile</label>
              <input
                type="email"
                name="mobile_email"
                value={data.email}
                onChange={handleChange}
                placeholder="Email or Mobile"
                className="w-full rounded-lg px-3 py-2 border border-green-200 bg-green-50 text-green-900 focus:ring-1 focus:ring-green-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className={`bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 ${
                isUpdating ? "animate-pulse opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>

        {/* Account Info */}
        <div className="mt-4 text-green-700 text-xs border-t border-green-200 pt-2 space-y-1">
          <div className="flex justify-between">
            <span>Date of Birth:</span>
            <span>{user?.DOB || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-500 font-semibold">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
