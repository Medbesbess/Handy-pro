import React, { useState } from "react";

const ExploreOurServiceCategories = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row">
      {/* Left side - Image background section */}
      <div className="w-full lg:w-1/2 relative flex items-center">
        <img
          src="src/assets/images/background.png"
          alt="Service background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative max-w-2xl px-8 md:px-16 lg:px-24 py-12 text-white z-10">
          <h2 className="text-5xl font-bold mb-4">
            {" "}
            Explore Our Service Categories.
          </h2>
          <p className="text-gray-300 mb-6 text-lg">
            Discover a wide range of services tailored to your needs. Whether
            you are looking for plumbing, electrical, gardening, or renovation
            solutions, our team of experts is here to assist you at every step.
          </p>
          <button className="bg-white text-blue-900 px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
            Find the Right Service
          </button>
        </div>
      </div>

      {/* Right side - Image section */}
      <div className="w-full lg:w-1/2 h-full">
        <div
          className="h-full"
          style={{ minHeight: "500px", maxHeight: "550px" }}
        >
          <img
            src="src/assets/images/Explore Our service categorie.png"
            alt="Service professionals"
            className="w-full h-full object-cover"
            style={{ minHeight: "500px", maxHeight: "550px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExploreOurServiceCategories;
