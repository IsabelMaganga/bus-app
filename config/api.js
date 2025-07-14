// API Configuration
// Update this file with your actual server IP address or domain

const API_CONFIG = {
  // Development - Update this to your computer's IP address
  // You can find your IP by running 'ipconfig' on Windows or 'ifconfig' on Mac/Linux
  BASE_URL: 'http://192.168.172.205:8000', // Your actual IP address
  
  // Production - Update this when deploying to production
  // BASE_URL: 'https://yourdomain.com',
  
  // Alternative: Use localhost for development on same device
  // BASE_URL: 'http://localhost:8000',
};

export default API_CONFIG;

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  BOOKINGS: '/api/bookings',
  PAYMENTS: '/api/payments',
  VERIFY_PAYMENT: (reference) => `/api/payments/verify/${reference}`,
}; 