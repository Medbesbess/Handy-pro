import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../Homepage/Navbar";
import DashboardSidebar from "./DashboardSidebar";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState("bookingDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    const message = localStorage.getItem("bookingSuccess");
    if (message) {
      setSuccessMessage(message);
      localStorage.removeItem("bookingSuccess");

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, sortField, sortDirection]);

  const fetchBookings = async () => {
    try {
      const response = await api.get(`/dashboard/bookings`, {
        params: {
          status: statusFilter !== "ALL" ? statusFilter : undefined,
          sort: sortField,
          direction: sortDirection,
        },
      });

      setBookings(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.error || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch =
          booking.service.name.toLowerCase().includes(searchTermLower) ||
          booking.provider.username.toLowerCase().includes(searchTermLower);

        const matchesStatus =
          statusFilter === "ALL" || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 inline-block">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const renderTableHeader = () => (
    <tr className="bg-blue-900 text-white">
      <th
        onClick={() => handleSort("service.name")}
        className="cursor-pointer px-6 py-4 text-left transition-colors hover:bg-blue-800"
      >
        Service {renderSortIcon("service.name")}
      </th>
      <th
        onClick={() => handleSort("provider.username")}
        className="cursor-pointer px-6 py-4 text-left transition-colors hover:bg-blue-800"
      >
        Provider {renderSortIcon("provider.username")}
      </th>
      <th
        onClick={() => handleSort("bookingDate")}
        className="cursor-pointer px-6 py-4 text-left transition-colors hover:bg-blue-800"
      >
        Date {renderSortIcon("bookingDate")}
      </th>
      <th
        onClick={() => handleSort("status")}
        className="cursor-pointer px-6 py-4 text-left transition-colors hover:bg-blue-800"
      >
        Status {renderSortIcon("status")}
      </th>
      <th
        onClick={() => handleSort("service.price")}
        className="cursor-pointer px-6 py-4 text-left transition-colors hover:bg-blue-800"
      >
        Price {renderSortIcon("service.price")}
      </th>
      <th className="px-6 py-4 text-left">Actions</th>
    </tr>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-blue-900">My Bookings</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-200 w-full sm:w-64"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-200 bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200 shadow-sm animate-fadeIn">
              {successMessage}
            </div>
          )}

          {error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>{renderTableHeader()}</thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-t hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {booking.service.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-600">
                              <img
                                src={booking.provider.photoUrl}
                                alt={booking.provider.username}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium text-gray-700">
                              {booking.provider.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "PENDING"
                                ? "bg-orange-100 text-orange-800"
                                : booking.status === "CANCELLED" ||
                                  booking.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : ""
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {booking.service.price} Dinar
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/dashboard/bookings/${booking.id}`}
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredBookings.length === 0 && (
                <div className="p-4 text-center text-gray-600">
                  No bookings found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
