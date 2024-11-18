import React from "react";
import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does your service booking process work?",
      answer:
        "Our booking process is simple: First, search for the service you need and your location. Browse through available service providers, read reviews, and compare prices. Select your preferred provider and choose a convenient time slot. Complete the booking by providing your details and making the payment. You'll receive an immediate confirmation with all the necessary information.",
    },
    {
      question: "What happens if I'm not satisfied with the service?",
      answer:
        "Your satisfaction is our priority. If you're not happy with the service provided, you can report the issue within 24 hours of service completion. Our customer support team will investigate the matter and work to resolve it. We offer a satisfaction guarantee and may provide a partial or full refund depending on the circumstances.",
    },
    {
      question: "How are your service providers vetted?",
      answer:
        "All our service providers undergo a rigorous vetting process that includes: background checks, verification of professional certifications, proof of insurance, and reference checks. We also continuously monitor their performance through customer reviews and ratings to maintain high service standards.",
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer:
        "Yes, you can cancel or reschedule your booking through your account dashboard. Cancellations made at least 24 hours before the scheduled service are eligible for a full refund. For rescheduling, please contact the service provider directly through our platform to arrange a new time slot.",
    },
    {
      question: "How are your service prices determined?",
      answer:
        "Service prices are set by individual providers based on factors like their experience, service complexity, and local market rates. We ensure transparency by showing all costs upfront, including any additional charges. Some providers may offer estimates that can be adjusted based on the actual scope of work.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, digital wallets, and bank transfers. All payments are processed securely through our platform. You'll only be charged after the service is confirmed, and your payment information is protected using industry-standard encryption.",
    },
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-blue-900">
                  {faq.question}
                </span>
                <span
                  className={`ml-6 flex-shrink-0 transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="h-6 w-6 text-blue-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
