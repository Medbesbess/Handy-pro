import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../Homepage/Navbar";
import DashboardSidebar from "./DashboardSidebar";
import { ChevronRight, Clock, CheckCircle, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchDashboardSummary = async () => {
    try {
      const response = await api.get("/dashboard/summary");
      const bookingsResponse = await api.get("/dashboard/bookings", {
        params: {
          sort: "bookingDate",
          direction: "desc",
          limit: 5,
        },
      });
      setSummary({
        recentBookings: response.data.recentBookings || [],
      });

      const urlParams = new URLSearchParams(window.location.search);
      const message = urlParams.get("message");
      if (message) {
        setSuccessMessage(decodeURIComponent(message));
        window.history.replaceState({}, "", window.location.pathname);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to access the dashboard.");
      } else {
        setError("Failed to fetch dashboard data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-900 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-red-500 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardSummary}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl border border-green-200">
              {successMessage}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">
                  Recent Bookings
                </h2>
                <p className="text-gray-500 mt-1">
                  Monitor your latest booking activities
                </p>
              </div>
              <Link
                to="/dashboard/bookings"
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                View All
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      Service
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      Provider
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t border-gray-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-medium text-blue-900">
                          {booking.service.name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {booking.provider.profilePhoto ? (
                            <img
                              src={booking.provider.profilePhoto}
                              alt={booking.provider.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-medium">
                              {booking.provider.username
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {booking.provider.username}
                            </span>
                            <span className="text-sm text-gray-500">
                              {booking.provider.rating} ★
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-blue-900">
                          ${booking.service.price}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {summary.recentBookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No recent bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
