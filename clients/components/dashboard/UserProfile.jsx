import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../Homepage/Navbar";
import DashboardSidebar from "./DashboardSidebar";
import { useProfile } from "../Homepage/ProfileContext";
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = () => {
  const { setProfilePhotoUrl } = useProfile();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID is missing");
        return;
      }

      const response = await api.get(`/user/profile/${userId}`);
      setProfile(response.data);
      setProfilePhotoUrl(response.data.photoUrl);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        address: response.data.address,
      });
    } catch (err) {
      setError(
        err.response && err.response.status === 404
          ? "User profile not found"
          : "Failed to fetch user profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      setUploading(true);
      const userId = localStorage.getItem("userId");
      const response = await api.post(
        `/user/profile/photo/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newPhotoUrl = response.data.data.photoUrl;
      setProfile({ ...profile, photoUrl: newPhotoUrl });
      setProfilePhotoUrl(newPhotoUrl);
      setSelectedFile(null);
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await api.put(`/user/update/${userId}`, formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gradient-to-r from-blue-900 to-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent border-b pb-4">
              My Profile
            </h1>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
              >
                {error}
              </motion.div>
            )}

            {profile && (
              <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-6">
                    <div className="relative group">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={profile.photoUrl || "/default-avatar.png"}
                        alt={profile.username}
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-gradient-to-r from-blue-900 to-orange-600"
                      />
                      <input
                        type="file"
                        id="photo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="photo-upload"
                        className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-900 to-orange-600 text-white p-2 rounded-full cursor-pointer hover:from-blue-800 hover:to-orange-500 transition-colors duration-200 transform hover:scale-110"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </label>
                    </div>
                    {selectedFile && (
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={handlePhotoUpload}
                        disabled={uploading}
                        className="bg-gradient-to-r from-blue-900 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-blue-800 hover:to-orange-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                      >
                        {uploading ? "Uploading..." : "Upload Photo"}
                      </motion.button>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gradient-to-r from-blue-900 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-blue-800 hover:to-orange-500 transition-all duration-200"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full md:w-auto bg-gradient-to-r from-blue-900 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-blue-800 hover:to-orange-500 transition-all duration-200"
                      >
                        Save Changes
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                      <InfoField label="Username" value={profile.username} />
                      <InfoField label="Email" value={profile.email} />
                      <InfoField
                        label="Phone"
                        value={profile.phoneNumber || "Not provided"}
                      />
                      <InfoField
                        label="Address"
                        value={profile.address || "Not provided"}
                      />
                      <InfoField
                        label="Member Since"
                        value={new Date(profile.createdAt).toLocaleDateString()}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 transition-colors duration-300">
    <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
    <p className="text-gray-900">{value}</p>
  </div>
);

export default UserProfile;
