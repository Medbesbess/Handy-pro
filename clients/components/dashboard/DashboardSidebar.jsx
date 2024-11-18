import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaThLarge,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
 
} from "react-icons/fa";

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    {
      section: "Main",
      items: [{ path: "/dashboard", icon: FaThLarge, label: "Overview" }],
    },
    {
      section: "Management",
      items: [
        {
          path: "/dashboard/bookings",
          icon: FaClipboardList,
          label: "My Bookings",
        },
      ],
    },
    {
      section: "Account",
      items: [{ path: "/dashboard/profile", icon: FaUser, label: "Profile" }],
    },
  ];

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };
  const cancelLogout = () => setShowLogoutConfirm(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to={item.path}
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } p-3 rounded-lg transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-blue-900 to-orange-600 text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon
              className={`w-5 h-5 ${isCollapsed ? "mr-0" : "mr-3"} ${
                isActive ? "animate-pulse" : ""
              }`}
            />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </div>
          {!isCollapsed && isActive && (
            <motion.div
              className="w-2 h-2 rounded-full bg-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className="bg-white min-h-screen shadow-xl relative border-r border-gray-100"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 bg-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronLeft className="w-4 h-4 text-blue-900" />
          </motion.div>
        </motion.button>

        <div className={`p-6 ${isCollapsed ? "p-4" : ""}`}>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent">
                  Dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
              </motion.div>
            )}
          </AnimatePresence>

          <nav className="space-y-6">
            {menuItems.map((section, index) => (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-3">
                    {section.section}
                  </h3>
                )}
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.path}>
                      <MenuItem item={item} />
                    </li>
                  ))}
                </ul>
                {index < menuItems.length - 1 && !isCollapsed && (
                  <div className="my-4 border-t border-gray-100" />
                )}
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="mt-8 pt-6 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } p-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex items-center space-x-3">
                <FaSignOutAlt
                  className={`w-5 h-5 ${isCollapsed ? "mr-0" : "mr-3"}`}
                />
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 w-96 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Confirm Logout
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? You will need to login again to
                access your dashboard.
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelLogout}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmLogout}
                  className="px-6 py-2 bg-gradient-to-r from-blue-900 to-orange-600 text-white rounded-lg font-medium hover:from-blue-800 hover:to-orange-500 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;