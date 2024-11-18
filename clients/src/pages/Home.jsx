import React, { useState, useEffect } from "react";
import Navbar from "../components/Homepage/Navbar";
import BrowseCategories from "../components/Homepage/BrowseCategories";
import RecommendedProjects from "../components/Homepage/RecommendedProjects";
import ClientTestimonials from "../components/Homepage/ClientTestimonials";
import ExploreOurServiceCategories from "../components/Homepage/ExploreOurServiceCategories";
import FAQSection from "../components/Homepage/FAQSection";
import Footer from "../components/Homepage/Footer";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Home = () => {
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({ service: "", city: "" });

  // Debounce function to delay the search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Update search parameters with debounce
  const updateSearch = debounce((newService, newCity) => {
    setSearchParams({ service: newService, city: newCity });
  }, 500); // 500ms delay

  // Handle service input change
  const handleServiceChange = (e) => {
    const newService = e.target.value;
    setService(newService);
    updateSearch(newService, city);
  };

  // Handle city input change
  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    updateSearch(service, newCity);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center text-blue-900 pt-4"
        style={{
          backgroundImage: "url('src/assets/images/background.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
        }}
      >
        <Navbar onCategorySelect={openModal} />
        <div className="flex flex-col lg:flex-row justify-between items-center p-16 lg:p-24">
          {/* Left Side - Text and Inputs */}
          <div className="lg:w-1/2 space-y-8 text-white">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-wide">
              Quality services at your doorstep.
            </h1>
            <h2 className="text-6xl lg:text-7xl font-bold mt-4 leading-snug">
              Explore Top-Rated Services Available in Your Local Area!
            </h2>
            <p className="text-xl lg:text-2xl mt-6 max-w-xl">
              Easily find the best services near you, with trusted professionals
              at your fingertips.
            </p>
            <div className="flex justify-start mt-8">
              <div className="flex items-center space-x-4 bg-white p-2 rounded-lg border border-gray-300">
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  className="w-[250px] p-1 border border-gray-300 rounded-md outline-none text-black text-base"
                  value={service}
                  onChange={handleServiceChange}
                />
                <div className="relative">
                  <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-[200px] p-1 pl-10 border border-gray-300 rounded-md outline-none text-black text-base"
                    value={city}
                    onChange={handleCityChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0 lg:pl-8 flex justify-end">
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                overflow: "hidden",
                borderRadius: "0.5rem",
                border: "2px solid transparent",
                marginLeft: "20px",
              }}
            >
              <img
                src="src/assets/images/image1.png"
                alt="Professional service"
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  borderRadius: "0.5rem",
                  transition: "transform 0.3s ease",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                }}
              />
            </div>
          </div>
        </div>

        <BrowseCategories searchParams={searchParams} />
        <RecommendedProjects />
        <ClientTestimonials />
      </div>
      <ExploreOurServiceCategories />
      <FAQSection />
      <Footer />
    </>
  );
};

export default Home;
