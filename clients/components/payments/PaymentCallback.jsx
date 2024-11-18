
// PaymentCallback
import axios from 'axios';

const API_URL = "http://localhost:3001";

const paymentApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Use the same token as your main API
paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const paymentService = {
  initiatePayment: async (bookingId) => {
    try {
      const response = await paymentApi.post(`/api/payments/initiate/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
    }
  },

  verifyPayment: async (bookingId, paymentId) => {
    try {
      const response = await paymentApi.post(`/api/payments/verify/${bookingId}`, {
        payment_id: paymentId
      });
      return response.data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
};

export default paymentService;