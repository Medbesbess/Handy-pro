import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  MapPin,
  Share2,
  Calendar,
  MessageCircle,
  Shield,
  Award,
  ThumbsUp,
  X,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BookingForm from "./BookingForm";
import api from "../utils/api";

// Review Modal Component (included in same file for demonstration)
const ReviewModal = ({ serviceId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert('Please select a rating');
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new review object
      const newReview = {
        id: Date.now(),
        rating,
        comment,
        user: {
          username: "Current User",
          photoUrl: "https://via.placeholder.com/80x80?text=User",
        },
        createdAt: new Date().toISOString(),
      };
      
      onSuccess(newReview);
      
      // Show success message
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 flex items-center justify-center z-50';
      successModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 shadow-xl transform transition-all duration-500 ease-in-out">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Review Submitted!</h3>
            <p class="text-gray-500">Thank you for your feedback</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(successModal);
      
      setTimeout(() => {
        successModal.remove();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h3 className="text-2xl font-semibold text-blue-900 mb-6">Write a Review</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Share your experience..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/my-services/${id}`);
        setService(data);
      } catch (error) {
        console.error("Error fetching service details:", error);
        setError("Failed to load service details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleBookNowClick = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      const confirmLogin = window.confirm(
        "Please log in to book a service. Would you like to go to the login page?"
      );
      if (confirmLogin) {
        navigate("/login-user");
      }
      return;
    }
    setIsBookingFormOpen(true);
  };

  const handleContactClick = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      const confirmLogin = window.confirm(
        "Please log in to contact the provider. Would you like to go to the login page?"
      );
      if (confirmLogin) {
        navigate("/login-user");
      }
      return;
    }

    try {
      const checkExisting = await api.get(
        `/conversations/${userId}/Allconversations`
      );
      let existingConversation = checkExisting.data.find(
        (conv) =>
          conv.providerId === service.providerId &&
          conv.UserId === parseInt(userId)
      );

      if (existingConversation) {
        navigate("/messenger", {
          state: { currentChat: existingConversation },
        });
      } else {
        const response = await api.post("/conversations/create", {
          userId: parseInt(userId),
          providerId: service.providerId,
        });
        navigate("/messenger", { state: { currentChat: response.data } });
      }
    } catch (error) {
      console.error("Error handling conversation:", error);
      alert("Failed to start conversation. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: service.name,
        text: service.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleReviewSuccess = (newReview) => {
    // Update the service state with the new review
    setService(prev => ({
      ...prev,
      reviews: [newReview, ...(prev.reviews || [])],
      // Update average rating
      averageRating: prev.reviews 
        ? ((prev.averageRating * prev.reviews.length) + newReview.rating) / (prev.reviews.length + 1)
        : newReview.rating
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-900 rounded-full animate-spin border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-orange-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Service
            </h3>
            <p className="text-gray-600">{error || "Service not found"}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-[600px]">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x500?text=Service+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

            {/* Service Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
              <div className="max-w-3xl">
                <h1 className="text-5xl font-bold mb-6">{service.name}</h1>
                <div className="flex flex-wrap gap-6 items-center text-base">
                  <div className="flex items-center bg-black/40 px-6 py-3 rounded-full backdrop-blur-sm">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>{service.averageRating?.toFixed(1) || "New"}</span>
                  </div>
                  <div className="flex items-center bg-black/40 px-6 py-3 rounded-full backdrop-blur-sm">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{service.provider.city}</span>
                  </div>
                  <div className="flex items-center bg-black/40 px-6 py-3 rounded-full backdrop-blur-sm">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{service.duration} hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="absolute top-6 right-6">
              <button
                onClick={handleShare}
                className="p-4 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <Share2 className="h-6 w-6 text-blue-900" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-10">
                  {["description", "reviews", "provider"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 border-b-2 font-medium text-base ${
                        activeTab === tab
                          ? "border-orange-600 text-blue-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-8">
                {activeTab === "description" && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {service.description}
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-8">
                    {service.reviews?.map((review) => (
                      <div
                        key={review.id}
                        className="bg-gray-50 rounded-xl p-8"
                      >
                        <div className="flex items-center space-x-6 mb-6">
                          <img
                           src={review.user.photoUrl}
                           alt={review.user.username}
                           className="w-20 h-20 rounded-full object-cover"
                           onError={(e) => {
                             e.target.src =
                               "https://via.placeholder.com/80x80?text=User";
                           }}
                         />
                         <div>
                           <p className="font-semibold text-lg">
                             {review.user.username}
                           </p>
                           <div className="flex items-center mt-2">
                             {[...Array(5)].map((_, i) => (
                               <Star
                                 key={i}
                                 className={`h-5 w-5 ${
                                   i < review.rating
                                     ? "text-yellow-400 fill-current"
                                     : "text-gray-300"
                                 }`}
                               />
                             ))}
                           </div>
                         </div>
                       </div>
                       <p className="text-gray-600 text-lg">
                         {review.comment}
                       </p>
                     </div>
                   ))}
                 </div>
               )}

               {activeTab === "provider" && (
                 <div className="bg-gray-50 rounded-xl p-8">
                   <div className="flex items-center space-x-6 mb-8">
                     <img
                       src={service.provider.photoUrl}
                       alt={service.provider.username}
                       className="w-24 h-24 rounded-full object-cover"
                       onError={(e) => {
                         e.target.src =
                           "https://via.placeholder.com/96x96?text=Provider";
                       }}
                     />
                     <div>
                       <h3 className="text-2xl font-semibold text-blue-900">
                         {service.provider.username}
                       </h3>
                       <p className="text-gray-600 text-lg mt-2">
                         Professional Service Provider
                       </p>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6 mb-8">
                     <div className="bg-white p-6 rounded-lg shadow-sm">
                       <p className="text-gray-500">Experience</p>
                       <p className="text-xl font-semibold text-blue-900">
                         5+ years
                       </p>
                     </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm">
                       <p className="text-gray-500">Completed Jobs</p>
                       <p className="text-xl font-semibold text-blue-900">
                         100+
                       </p>
                     </div>
                   </div>
                 </div>
               )}
             </div>
           </div>

           {/* Sidebar */}
           <div className="lg:col-span-1">
             <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
               <div className="mb-8">
                 <p className="text-gray-500 text-lg">Price</p>
                 <p className="text-4xl font-bold text-blue-900 mt-2">
                   {service.price} Dinar
                 </p>
               </div>

               <div className="space-y-4">
                 <button
                   onClick={handleBookNowClick}
                   className="w-full bg-blue-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center space-x-3 text-lg"
                 >
                   <Calendar className="h-6 w-6" />
                   <span>Book Now</span>
                 </button>

                 <button
                   onClick={handleContactClick}
                   className="w-full bg-white text-orange-600 py-4 px-6 rounded-lg font-medium border-2 border-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center space-x-3 text-lg"
                 >
                   <MessageCircle className="h-6 w-6" />
                   <span>Contact Provider</span>
                 </button>

                 
                 {/* <button
                   onClick={() => {
                     const token = localStorage.getItem("authToken");
                     if (!token) {
                       const confirmLogin = window.confirm(
                         "Please log in to leave a review. Would you like to go to the login page?"
                       );
                       if (confirmLogin) {
                         navigate("/login-user");
                       }
                       return;
                     }
                     setIsReviewModalOpen(true);
                   }}
                   className="w-full bg-white text-gray-600 py-4 px-6 rounded-lg font-medium border-2 border-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 text-lg"
                 >
                   <Star className="h-6 w-6" />
                   <span>Add Review</span>
                 </button> */}
               </div>

               <div className="mt-8 pt-8 border-t border-gray-200">
                 <h4 className="font-medium text-lg mb-6">
                   Service Guarantees
                 </h4>
                 <div className="space-y-4">
                   {[
                     { icon: Shield, text: "Service Protection" },
                     { icon: Award, text: "Quality Guaranteed" },
                     { icon: ThumbsUp, text: "Satisfaction Assured" },
                   ].map((item, index) => (
                     <div
                       key={index}
                       className="flex items-center space-x-4 text-gray-600"
                     >
                       <item.icon className="h-6 w-6 text-orange-600" />
                       <span className="text-lg">{item.text}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </main>

     {isBookingFormOpen && (
       <BookingForm
         serviceId={service.id}
         providerId={service.providerId}
         onClose={() => setIsBookingFormOpen(false)}
       />
     )}

     {isReviewModalOpen && (
       <ReviewModal
         serviceId={service.id}
         onClose={() => setIsReviewModalOpen(false)}
         onSuccess={handleReviewSuccess}
       />
     )}

     <Footer />
   </div>
 );
};

export default ServicePage;