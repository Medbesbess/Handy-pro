import React, { useState } from "react";

const ClientTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "The service was exceptional! The professional arrived on time and completed the job with remarkable attention to detail. I couldn't be happier with the results.",
      author: "Sarah Chen",
      avatar: "src/assets/images/Sarah.png",
    },
    {
      id: 2,
      text: "I found exactly what I needed through this platform. The booking process was smooth, and the service provider was highly skilled. Will definitely use again!",
      author: "Michael Rodriguez",
      avatar: "src/assets/images/Michael.png",
    },
    {
      id: 3,
      text: "Outstanding experience from start to finish. The customer service was responsive, and the professional they matched me with exceeded my expectations.",
      author: "Emma Thompson",
      avatar: "src/assets/images/Emma.png",
    },
    {
      id: 4,
      text: "This platform has changed the way I find services! The professionals are reliable and the process is seamless.",
      author: "David Brown",
      avatar: "src/assets/images/David.png",
    },
    {
      id: 5,
      text: "I appreciate the transparency and professionalism I experienced. Will definitely recommend to others!",
      author: "Lisa White",
      avatar: "src/assets/images/Lisa.png",
    },
    {
      id: 6,
      text: "A game changer in finding home services. Every experience has been positive, and the quality is top-notch.",
      author: "John Smith",
      avatar: "src/assets/images/John.png",
    },
    {
      id: 7,
      text: "This service has been a lifesaver! I highly recommend it to anyone looking for reliable help around the house.",
      author: "Jessica Wilson",
      avatar: "src/assets/images/Jessica.png",
    },
    {
      id: 8,
      text: "I had a wonderful experience! The service provider was professional and went above and beyond.",
      author: "Maria Lopez",
      avatar: "src/assets/images/Maria.png",
    },
    {
      id: 9,
      text: "Quick and reliable! This platform made it easy to find someone trustworthy.",
      author: "Anna Kline",
      avatar: "src/assets/images/Anna.png",
    },
    {
      id: 10,
      text: "I was really impressed with the quality and professionalism. Highly recommended!",
      author: "Olivia Scott",
      avatar: "src/assets/images/Olivia.png",
    },
    {
      id: 11,
      text: "This service saved me so much time! I’ll definitely use it again.",
      author: "James Carter",
      avatar: "src/assets/images/James.png",
    },
  ];

  const handleTestimonialChange = (index) => {
    setCurrentTestimonial((index + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-16">
          Our Clients Testify
        </h2>

        {/* Avatars in wavy pattern */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          {testimonials.map((testimonial, index) => {
            const yOffset = Math.sin(index) * 20; // Adjust 20 for more or less "wave"
            return (
              <button
                key={testimonial.id}
                onClick={() => handleTestimonialChange(index)}
                className={`relative transition-transform duration-300 ${
                  index === currentTestimonial ? "scale-125" : "scale-75"
                }`}
                style={{
                  zIndex: index === currentTestimonial ? 10 : 1,
                  transform:
                    index === currentTestimonial
                      ? `scale(1.2) translateY(${yOffset}px)`
                      : `scale(0.75) translateY(${yOffset}px)`,
                }}
                aria-label={`View testimonial from ${testimonial.author}`}
              >
                <img
                  src={testimonial.avatar}
                  alt={`${testimonial.author}'s avatar`}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white shadow-lg"
                />
              </button>
            );
          })}
        </div>

        {/* Testimonial content */}
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-gray-600 text-lg leading-relaxed">
            {testimonials[currentTestimonial].text}
          </p>
          <p className="font-semibold text-blue-900 text-xl">
            {testimonials[currentTestimonial].author}
          </p>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleTestimonialChange(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View testimonial from ${testimonials[index].author}`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 font-semibold">
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientTestimonials;
