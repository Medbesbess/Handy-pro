import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer
      className="w-full bg-blue-900 text-white py-10 px-8 mt-auto"
      style={{
        backgroundImage: "url('/src/assets/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="col-span-1 flex flex-col items-start">
          <img
            src="/src/assets/images/Logo footer.png"
            alt="HandyPro"
            className="h-12 mb-4"
          />
          <p className="text-sm">
            HandyPro connects you with trusted professionals to meet all your
            service needs right at your doorstep.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube text-xl"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#">Find Professionals</a>
            </li>
            <li>
              <a href="#">Become a Provider</a>
            </li>
            <li>
              <a href="#">Service Categories</a>
            </li>
            <li>
              <a href="#">Customer Reviews</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>

        {/* Useful Info */}
        <div className="col-span-1">
          <h3 className="font-semibold text-lg mb-4">Useful Information</h3>
          <ul className="space-y-2">
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Legal Notices</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-span-1">
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <p>8, Sarajevo Street, Ennasr 1, 2037 Ariana</p>
          <p>Phone: (+216) 21 384 423</p>
          <p>Email: hello@handypro.com</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white opacity-30 mt-8 pt-4 text-center text-sm">
        © 2024 HandyPro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
