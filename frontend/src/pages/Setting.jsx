import React, { useRef, useState } from "react";
import { CiCamera, CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

const Setting = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const { AuthUser, updateProfile, isUpdating } = useAuthStore();
  const [data, setData] = useState({
    firstname: AuthUser?.name || "",
    email: AuthUser?.email || "",
    profile_pic: AuthUser?.profile_pic || null,
  });

  const [previewPic, setPreviewPic] = useState(AuthUser?.profile_pic || "");

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

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
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6 border border-green-100">

        <button
          onClick={() => navigate("/")}
          className="text-green-700 hover:text-green-900 font-semibold text-sm flex items-center gap-2 hover:translate-x-[-4px] transition"
        >
          ← Back
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-green-900 tracking-wide">Account Settings</h1>
          <p className="text-green-600 text-sm">Manage your profile details</p>
        </div>

        <div className="flex justify-center relative w-32 mx-auto">
          <img
            src={previewPic || "/default-profile.png"}
            className="w-32 h-32 rounded-full object-cover border-4 border-green-400 shadow-md"
          />

          <label
            htmlFor="profile-upload"
            className={`absolute bottom-1 right-1 p-2 bg-white border border-green-300 rounded-full shadow cursor-pointer hover:bg-green-50 transition ${
              isUpdating ? "pointer-events-none opacity-50" : ""
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

        <p className="text-center text-green-500 text-xs">
          {isUpdating ? "Uploading..." : "Tap the camera to update photo"}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="flex items-center gap-2 text-green-700 font-medium text-sm mb-1">
              <CiUser /> First Name
            </label>
            <input
              type="text"
              name="firstname"
              value={data.firstname}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 border border-green-300 bg-green-50 text-green-900 focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <div>
            <label className="text-green-700 font-medium text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 border border-green-300 bg-green-50 text-green-900 focus:ring-2 focus:ring-green-400 outline-none transition"
            />
          </div>

          <button
            disabled={isUpdating}
            type="submit"
            className={`w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition ${
              isUpdating ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </form>

        <div className="text-green-700 text-sm border-t border-green-200 pt-3 space-y-2">
          <div className="flex justify-between">
            <span>Date of Birth:</span>
            <span className="font-medium">{AuthUser?.DOB || "Yet to be born"}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Setting;
