import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  UserCog,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-br from-blue-800 via-blue-600 to-blue-700 text-white flex flex-col shadow-xl relative transition-all duration-300`}
      >
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-5"></div>

        {/* Toggle Button - تم تحسين تصميم الزر */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-10 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 border-blue-100 group"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5 group-hover:animate-pulse" />
          ) : (
            <ChevronRight className="w-5 h-5 group-hover:animate-pulse" />
          )}
        </button>

        {/* Content */}
        <div className="relative">
          <div
            className={`p-4 font-bold text-lg mt-6 ${
              isSidebarOpen ? "px-6" : "px-2"
            } flex items-center justify-center`}
          >
            <span className="bg-white/20 p-2 rounded-lg mr-3">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            {isSidebarOpen && (
              <span className="transition-all duration-200">
                Admin Dashboard
              </span>
            )}
          </div>
          <ul className="flex flex-col space-y-1 p-4">
            <li className="hover:bg-blue-500/30 p-2 rounded-lg transition-all duration-200">
              <a href="/dashboard" className="flex items-center space-x-3">
                <LayoutDashboard size={20} className="text-blue-100" />
                {isSidebarOpen && (
                  <span className="font-medium transition-all duration-200">
                    Dashboard
                  </span>
                )}
              </a>
            </li>
            <li className="hover:bg-blue-500/30 p-2 rounded-lg transition-all duration-200">
              <a href="/categories" className="flex items-center space-x-3">
                <ListOrdered size={20} className="text-blue-100" />
                {isSidebarOpen && (
                  <span className="font-medium transition-all duration-200">
                    Categories
                  </span>
                )}
              </a>
            </li>
            <li className="hover:bg-blue-500/30 p-2 rounded-lg transition-all duration-200">
              <a href="/user/provider" className="flex items-center space-x-3">
                <UserCog size={20} className="text-blue-100" />
                {isSidebarOpen && (
                  <span className="font-medium transition-all duration-200">
                    Service Providers
                  </span>
                )}
              </a>
            </li>
            <li className="hover:bg-blue-500/30 p-2 rounded-lg transition-all duration-200">
              <a href="/user/customer" className="flex items-center space-x-3">
                <Users size={20} className="text-blue-100" />
                {isSidebarOpen && (
                  <span className="font-medium transition-all duration-200">
                    Customers
                  </span>
                )}
              </a>
            </li>
            <li className="hover:bg-blue-500/30 p-2 rounded-lg transition-all duration-200">
              <a href="/bookings" className="flex items-center space-x-3">
                <Calendar size={20} className="text-blue-100" />
                {isSidebarOpen && (
                  <span className="font-medium transition-all duration-200">
                    Booking
                  </span>
                )}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-6 bg-gray-50 flex-1 overflow-y-auto shadow-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
