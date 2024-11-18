import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import api from "../utils/api";
import { io } from "socket.io-client";
import axios from "axios";
import { useProfile } from "../Homepage/ProfileContext";
import logo from "../../assets/images/logo.png";

const Navbar = ({ onCategorySelect }) => {
  const { profilePhotoUrl } = useProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);

    if (authToken) {
      fetchUnreadMessages();
      initializeSocket();
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/my-categories");
      setCategories(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await axios.get(
        `http://localhost:3001/api/conversations/unread/${userId}?role=user`
      );

      if (response.data) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const initializeSocket = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to socket for notifications");
    });

    socket.on("newMessage", (message) => {
      if (message.sender === "provider") {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("messagesRead", () => {
      fetchUnreadMessages();
    });

    return () => {
      socket.disconnect();
    };
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (profileDropdownOpen) setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    setDropdownOpen(false);
  };

  const handleSignIn = () => {
    navigate("/login-user");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen || profileDropdownOpen) {
        if (!event.target.closest(".dropdown-container")) {
          setDropdownOpen(false);
          setProfileDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, profileDropdownOpen]);

  return (
    <nav
      className="flex items-center justify-between p-4 bg-white text-blue-900 shadow-md border border-gray-200 rounded-md mx-4"
      style={{ marginTop: "20px" }}
    >
      <div
              className="text-xl font-bold flex items-center cursor-pointer"
              onClick={() => handleNavigation("/ServiceProvider")}
            >
              <img src={logo} alt="HandyPro" className="h-8 mr-2" />
            </div>
      <ul className="flex space-x-6 text-lg">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li className="cursor-default">Find A Professional</li>
        <li className="relative dropdown-container">
          <span className="cursor-pointer" onClick={toggleDropdown}>
            All Category
          </span>
          {dropdownOpen && (
            <div className="absolute top-full mt-2 w-40 bg-white text-black border border-gray-200 shadow-lg rounded-md z-50">
              <ul className="flex flex-col">
                {loading ? (
                  <li className="p-2 text-center text-gray-500">Loading...</li>
                ) : error ? (
                  <li className="p-2 text-center text-red-500">{error}</li>
                ) : categories.length === 0 ? (
                  <li className="p-2 text-center text-gray-500">
                    No categories available
                  </li>
                ) : (
                  categories.map((category) => (
                    <li
                      key={category.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <span onClick={() => handleCategoryClick(category)}>
                        {category.name}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </li>
        <li>
          <Link to="/ContactForm">Contact Us</Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link to="/messenger" className="relative flex items-center">
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF8A00] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          </li>
        )}
      </ul>
      <div className="flex items-center space-x-4">
        {!isAuthenticated ? (
          <button
            onClick={handleSignIn}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            Sign In
          </button>
        ) : (
          <div className="relative dropdown-container">
            <div className="cursor-pointer" onClick={toggleProfileDropdown}>
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80"
                />
              ) : (
                <FaUserCircle className="text-blue-900 text-3xl hover:text-blue-700" />
              )}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/bookings"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Bookings
                      </Link>
                    </li>
                    {/* Removed Notifications link */}
                    <li>
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile Settings
                      </Link>
                    </li>
                    <li className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
