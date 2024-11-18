import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Save,
  User,
  X,
  Mail,
  Lock,
  UserCircle,
  ArrowLeft,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/users/admin/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { user } = response.data;
      setFormData((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
        photoUrl: user.photoUrl || "",
      }));
    } catch (error) {
      toast.error("Error fetching profile");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photoUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (formData.newPassword && !formData.currentPassword) {
      toast.error("Current password is required to set a new password");
      return false;
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const submitData = new FormData();
      submitData.append("username", formData.username);
      submitData.append("email", formData.email);

      if (formData.currentPassword && formData.newPassword) {
        submitData.append("currentPassword", formData.currentPassword);
        submitData.append("newPassword", formData.newPassword);
      }

      if (selectedFile) {
        submitData.append("photo", selectedFile);
      }

      const response = await axios.put(
        "http://localhost:3001/users/admin/profile",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully");

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));

      localStorage.setItem("user", JSON.stringify(response.data.user));
      fetchAdminProfile();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-right" theme="colored" />

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="mr-4 p-2 hover:bg-blue-600 rounded-full transition-all duration-200"
            >
              <ArrowLeft size={24} className="text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                      <UserCircle size={80} className="text-blue-300" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-all duration-200">
                  <Upload size={20} className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User size={16} className="mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Current Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock size={16} className="mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock size={16} className="mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
