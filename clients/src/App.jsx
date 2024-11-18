import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BrowseCategories from "./components/Homepage/BrowseCategories";
import AddService from "./pages/AddService";
import Dashboard from "./components/dashboard/Dashboard";
import UserBookings from "./components/dashboard/UserBookings";
import BookingDetails from "./components/dashboard/BookingDetails";
import UserProfile from "./components/dashboard/UserProfile";
import RegisterUser from "./components/user/Register";
import RegisterProvider from "./components/serviceProvider/ProviderRegister";
import LoginUser from "./components/user/Login";
import LoginProvider from "./components/serviceProvider/ProviderLogin";
import History from "./components/serviceProvider/History";
import ProviderProfile from "./components/serviceProvider/Profile";
import PrivateRoute from "./components/common/PrivateRoute";
import Messanger from "./components/messages/Messenger";
import Dashboardp from "./components/serviceProvider/Dashboard";
import Requests from "./components/serviceProvider/Requests";
import ServicePage from "./components/Homepage/ServicePage";
import { ProfileProvider } from "./components/Homepage/ProfileContext"; // Import the ProfileProvider
import ContactForm from "./pages/ContactForm";
import ProviderSales from "./components/payments/ProviderSales"
import ServiceDetail from "../src/components/serviceProvider/ServiceDetail"
const App = () => {
  return (
    <ProfileProvider>
      {" "}
      {/* Wrap the Router with ProfileProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<BrowseCategories />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/ServiceProvider" element={<Dashboardp />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/login-user" element={<LoginUser />} />
          <Route path="/login-provider" element={<LoginProvider />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-provider" element={<RegisterProvider />} />
          <Route path="/addService" element={<AddService />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<ProviderProfile />} />
          <Route path="/messenger" element={<Messanger />} />
          <Route path="/provider/sales" element={<ProviderSales />} />
          <Route path="/ContactForm" element={<ContactForm />} />
          <Route path="/ServiceDetail/:id" element={<ServiceDetail />} />
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <PrivateRoute>
                <UserBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/bookings/:bookingId"
            element={
              <PrivateRoute>
                <BookingDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ProfileProvider>
  );
};

export default App;
