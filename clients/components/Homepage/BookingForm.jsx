import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Calendar,
  Clock,
  AlertCircle,
  MessageSquare,
  Info,
  CheckCircle,
} from "lucide-react";
import api from "../utils/api";

const validateDateTime = (date, time) => {
  const now = new Date();
  const selectedDateTime = new Date(`${date}T${time}`);

  if (selectedDateTime < now) {
    throw new Error("Cannot book for past date and time");
  }

  const hours = selectedDateTime.getHours();
  if (hours < 9 || hours > 17) {
    throw new Error("Bookings are only available between 9 AM and 5 PM");
  }
};

const BookingForm = ({ serviceId, providerId, onClose }) => {
  const navigate = useNavigate();
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      validateDateTime(bookingDate, bookingTime);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const combinedDateTime = `${bookingDate}T${bookingTime}:00.000Z`;

      const response = await api.post("/my-services/bookings", {
        serviceId,
        providerId,
        bookingDate: combinedDateTime,
        notes,
      });

      localStorage.setItem(
        "bookingSuccess",
        "Your booking was successfully created!"
      );
      onClose();
      navigate("/dashboard/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-900 to-orange-600">
          <h2 className="text-2xl font-bold text-white">
            Schedule Your Booking
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* DateTime Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <Calendar className="h-5 w-5 text-blue-900" />
                  <span>Select Date</span>
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <Clock className="h-5 w-5 text-blue-900" />
                  <span>Select Time</span>
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <MessageSquare className="h-5 w-5 text-blue-900" />
                <span>Additional Notes</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-32 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all resize-none"
                placeholder="Add any special requirements or notes..."
              />
            </div>

            {/* Info Box */}
            <div className="bg-orange-50 rounded-xl p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-600">
                <p className="font-medium">Booking Information:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Bookings are available between 9 AM and 5 PM</li>
                  <li>• Cancellations must be made 24 hours in advance</li>
                  <li>• You'll receive a confirmation email after booking</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-900 text-white py-4 px-6 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
            >
              <CheckCircle className="h-5 w-5" />
              <span>{isSubmitting ? "Processing..." : "Confirm Booking"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
