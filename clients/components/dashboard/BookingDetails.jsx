import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../Homepage/Navbar";
import DashboardSidebar from "./DashboardSidebar";
import PaymentSection from '../payments/PaymentSection';
import PaymentStatusModal from '../payments/PaymentStatusModal';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({ status: '', message: '' });
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    action: null,
    title: "",
    message: "",
  });
  const navigate = useNavigate();

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dashboard/bookings/${bookingId}`);
      if (response.data) {
        setBooking(response.data);
        setError(null);
      } else {
        setError("No booking data found");
      }
    } catch (err) {
      console.error("Booking fetch error:", err);
      setError(err.response?.data?.error || "Failed to fetch booking details");
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      setPaymentStatus({
        status: 'success',
        message: 'Your payment was processed successfully!'
      });
      setShowPaymentModal(true);
      fetchBookingDetails();
    } else if (payment === "failed") {
      setPaymentStatus({
        status: 'failed',
        message: 'Payment failed. Please try again or contact support.'
      });
      setShowPaymentModal(true);
    }
  }, [searchParams]);

  const handleBookingSuccess = (message) => {
    localStorage.setItem("bookingSuccess", message);
    navigate("/dashboard/bookings");
  };

  const handleBookingAction = async (action) => {
    try {
      setLoading(true);
      await api.post(`/dashboard/bookings/${bookingId}/${action}`);
      handleBookingSuccess(`Booking has been ${action}ed successfully!`);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action} booking`);
    } finally {
      setLoading(false);
      setConfirmationModal({
        show: false,
        action: null,
        title: "",
        message: "",
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a rating");
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post(`/dashboard/bookings/${bookingId}/review`, {
        rating,
        review,
      });
      await fetchBookingDetails();
      setReview("");
      setRating(0);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStarRating = (currentRating, isInteractive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => isInteractive && setRating(star)}
            className={`text-3xl transition-all duration-300 transform hover:scale-110 ${
              star <= currentRating
                ? "text-orange-600"
                : "text-gray-300 hover:text-orange-400"
            } ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BackButton = () => (
    <button
      onClick={() => navigate("/dashboard/bookings")}
      className="group flex items-center space-x-2 px-6 py-2.5 rounded-lg border-2 border-blue-900 hover:bg-blue-900 transition-all duration-300"
    >
      <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
        ←
      </span>
      <span className="font-semibold text-blue-900 group-hover:text-white transition-colors duration-300">
        Back to Bookings
      </span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 p-8">
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-900 border-opacity-20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-900 border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-blue-900 font-medium text-lg animate-pulse">
                Loading booking details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-2xl mx-auto">
              <BackButton />
              <div className="mt-6 bg-red-50 text-red-700 p-8 rounded-xl shadow-lg border border-red-200 flex items-center space-x-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Error</h3>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-6 text-6xl">🔍</div>
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                No Booking Found
              </h2>
              <p className="text-gray-600 mb-8">
                We couldn't find the booking you're looking for.
              </p>
              <BackButton />
            </div>
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
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-blue-900 bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent">
              Booking Details
            </h1>
            <BackButton />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Service & Provider Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Service Information */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl transform transition-transform duration-300 hover:scale-[1.02]">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="mr-3">🛠</span>
                    Service Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-blue-900 min-w-[120px]">
                        Service:
                      </span>
                      <span className="text-gray-700">
                        {booking.service?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-blue-900 min-w-[120px]">
                        Description:
                      </span>
                      <span className="text-gray-700">
                        {booking.service?.description || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-blue-900 min-w-[120px]">
                        Price:
                      </span>
                      <span className="text-gray-700">
                        {booking.service?.price || "N/A"} Dinar
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="font-semibold text-blue-900 min-w-[120px]">
                        Status:
                      </span>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          booking.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "PENDING"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Provider Details */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl transform transition-transform duration-300 hover:scale-[1.02]">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="mr-3">👤</span>
                    Provider Details
                  </h2>
                  <div className="flex items-center space-x-6">
                    {booking.provider?.photoUrl && (
                      <div className="relative">
                        <img
                          src={booking.provider.photoUrl}
                          alt={booking.provider.username}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                      </div>
                    )}
                    <div className="space-y-3">
                      <p className="font-bold text-blue-900 text-xl">
                        {booking.provider?.username || "N/A"}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <span className="mr-2">📧</span>
                        {booking.provider?.email || "N/A"}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <span className="mr-2">📱</span>
                        {booking.provider?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              {booking.status === "CONFIRMED" && (
                <div className="md:col-span-2">
                  <PaymentSection bookingId={bookingId} />
                </div>
              )}

              {/* Booking Date and Time */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                  <span className="mr-3">📅</span>
                  Booking Schedule
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Scheduled for</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Created on</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Actions */}
              {booking.status === "PENDING" && (
                <div className="md:col-span-2">
                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          show: true,
                          action: "confirm",
                          title: "Confirm Booking",
                          message: "Are you sure you want to confirm this booking?",
                        })
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          show: true,
                          action: "cancel",
                          title: "Cancel Booking",
                          message: "Are you sure you want to cancel this booking?",
                        })
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              )}

              {/* Review Section */}
              {booking.status === "COMPLETED" && !booking.review && (
                <div className="bg-gradient-to-br from-blue-50 to-orange-50 p-8 rounded-2xl">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="mr-3">⭐</span>
                    Leave a Review
                  </h2>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      {renderStarRating(rating, true)}
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your experience with this service..."
                        className="w-full mt-4 p-4 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent resize-none transition-all duration-300"
                        rows="4"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full px-8 py-4 bg-blue-900 text-white rounded-xl hover:bg-orange-600 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                    >
                      {submittingReview ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting Review...
                        </span>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Existing Review */}
              {booking.status === "COMPLETED" && booking.review && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="mr-3">📝</span>
                    Your Review
                  </h2>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="mb-4">{renderStarRating(booking.rating)}</div>
                    <p className="text-gray-700 mb-4 text-lg">"{booking.review}"</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">📅</span>
                      Posted on{" "}
                      {booking.reviewDate
                        ? new Date(booking.reviewDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modals */}
          <ConfirmationModal
            show={confirmationModal.show}
            title={confirmationModal.title}
            message={confirmationModal.message}
            onConfirm={() => handleBookingAction(confirmationModal.action)}
            onCancel={() =>
              setConfirmationModal({
                show: false,
                action: null,
                title: "",
                message: "",
              })
            }
          />

          <PaymentStatusModal
            isOpen={showPaymentModal}
            status={paymentStatus.status}
            message={paymentStatus.message}
            onClose={() => {
              setShowPaymentModal(false);
              navigate(`/dashboard/bookings/${bookingId}`, { replace: true });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;