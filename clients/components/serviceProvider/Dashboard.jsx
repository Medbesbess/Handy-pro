import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderNavBar from "./ProviderNavBar";
import DeactivationNotice from "./DeactivationNotice";
import DeactivationTicker from "./DeactivationTicker";
import FAQSection from "../Homepage/FAQSection";
import Footer from "../Homepage/Footer";
import AddServiceModal from "../../pages/AddService";
import ServiceDetail from "./ServiceDetail"

const Dashboardp = () => {
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [services, setServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeactivationNotice, setShowDeactivationNotice] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAvailable = localStorage.getItem("isAvailable") === "true";

  // Responsive items to show based on screen size
  const [itemsToShow, setItemsToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else if (window.innerWidth < 1280) setItemsToShow(3);
      else setItemsToShow(4);
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    
    try {
      const providerId = localStorage.getItem("providerId");
      const response = await fetch(`http://127.0.0.1:3001/service/provider/${providerId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) throw new Error("Failed to fetch services.");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    if (!isAvailable) {
      setShowDeactivationNotice(true);
    }
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", service, "in", city);
  };

  const handleNext = () => {
    if (currentIndex + itemsToShow < services.length) {
      setCurrentIndex(currentIndex + itemsToShow);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsToShow);
    }
  };

  const handleServiceClick = (id) => {
    navigate(`/ServiceDetail/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="bg-cover bg-center text-blue-900 flex-grow"
        style={{
          backgroundImage: "url('src/assets/images/background3.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
        }}
      >
        <ProviderNavBar onCategorySelect={() => setIsModalOpen(true)} />
        {!isAvailable && <DeactivationTicker />}
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-8 lg:py-16 gap-8">
            {/* Left Side - Text and Inputs */}
            <div className="lg:w-1/2 space-y-4 lg:space-y-6 text-white">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide">
                Quality services at your doorstep.
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Explore Top-Rated Services Available in Your Local Area!
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl max-w-xl">
                Easily find the best services near you, with trusted professionals at your fingertips.
              </p>
              
              
            </div>

            {/* Right Side - Image */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div
                className="relative overflow-hidden rounded-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  src="src/assets/images/image1.png"
                  alt="Professional service"
                  className={`w-full max-w-[450px] rounded-lg transition-transform duration-300 ${
                    isHovered ? "scale-105" : "scale-100"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services List Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#FF9202]">List of Your Posts</h1>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p>Loading services...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Services Carousel */}
          <div className="relative px-8 sm:px-12">
            <div className="flex items-center justify-center">
              <button
                className={`absolute left-0 z-10 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                }`}
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                &lt;
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {services.slice(currentIndex, currentIndex + itemsToShow).map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceClick(service.id)}
                    className="bg-white p-4 rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105"
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-semibold text-[#0A165E] line-clamp-1">{service.name}</h2>
                      <button className="text-orange-500 text-xl">♥</button>
                    </div>
                    <span className="inline-block bg-orange-200 text-orange-500 px-3 py-1 rounded text-sm font-semibold">
                      See detail
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`absolute right-0 z-10 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentIndex + itemsToShow >= services.length ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
                }`}
                onClick={handleNext}
                disabled={currentIndex + itemsToShow >= services.length}
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Add Service Button */}
          <div className="flex justify-center mt-12">
            <button
              className={`bg-orange-500 text-white py-3 px-8 rounded-full font-semibold transition-all ${
                !isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600 hover:scale-105'
              }`}
              onClick={() => isAvailable && setIsModalOpen(true)}
              disabled={!isAvailable}
              title={!isAvailable ? "Account must be verified to add services" : "Add your service"}
            >
              Add your service
            </button>
          </div>
        </div>
      </div>

      <AddServiceModal
        isOpen={isModalOpen && isAvailable}
        onClose={() => {
          setIsModalOpen(false);
          fetchServices();
        }}
      />

      <DeactivationNotice 
        isOpen={showDeactivationNotice}
        onClose={() => setShowDeactivationNotice(false)}
      />

      <FAQSection />
      <Footer />
    </div>
  );
};

export default Dashboardp;