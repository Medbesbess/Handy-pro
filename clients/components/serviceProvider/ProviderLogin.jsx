import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DeactivationNotice from "./DeactivationNotice";
import logo from "./image/1.png";

const LoginProvider = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showDeactivationNotice, setShowDeactivationNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3001/service-provider/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data);
      }
      if (data.token) {
        // Store user data
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.provider.id.toString());
        localStorage.setItem("userType", "PROVIDER");
        localStorage.setItem("role", "provider");
        localStorage.setItem("username", data.provider.username);
        localStorage.setItem(
          "isAvailable",
          data.provider.isAvailable.toString()
        );

        if (data.provider.photoUrl) {
          localStorage.setItem("photoUrl", data.provider.photoUrl);
        }

        // Only show deactivation notice if account is not available
        if (!data.provider.isAvailable) {
          setShowDeactivationNotice(true);
        }

        navigate("/ServiceProvider");
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage(error.message || "Email or password not correct");
    }
  };
  return (
    <div className="flex">
      {/* Home button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        title="Go to Home"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>

      {/* Left side with logo */}
      <div className="w-1/2 bg-[#1034A6] h-screen flex items-center justify-center">
        <div className="text-white text-4xl font-bold">
          <div className="flex items-center">
            <img src={logo} alt="HandyPro Logo" className="w-96 h-96 mr-2" />
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome Back Provider!
          </h2>
          <p className="text-gray-600 mb-8">Sign In To Continue</p>

          {/* Toggle buttons for User/Provider */}
          <div className="flex w-full mb-8 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => navigate("/login-user")}
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                location.pathname === "/login-user"
                  ? "bg-[#1034A6] text-white shadow-lg"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              User
            </button>
            <button
              onClick={() => navigate("/login-provider")}
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                location.pathname === "/login-provider"
                  ? "bg-[#1034A6] text-white shadow-lg"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Provider
            </button>
          </div>

          {errorMessage && (
            <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={formData.email}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF8A00] text-white py-3 rounded-lg hover:bg-[#FF7A00] transition duration-200"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register-provider")}
                className="text-[#FF8A00] hover:underline"
              >
                Sign Up
              </button>
            </span>
          </div>
        </div>
      </div>

      <DeactivationNotice
        isOpen={showDeactivationNotice}
        onClose={() => setShowDeactivationNotice(false)}
      />
    </div>
  );
};
export default LoginProvider;
