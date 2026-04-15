import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return 'https://otpbackend-p2gr.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseURL();
console.log(`🌐 API Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  withCredentials: true
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ Error from ${error.config?.url}:`, error.message);
    return Promise.reject(error);
  }
);

// Helper to update user data
const updateUserData = (userData) => {
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('user:updated', { detail: userData }));
  }
};

const clearUserData = () => {
  localStorage.removeItem('user');
  window.dispatchEvent(new CustomEvent('user:updated', { detail: null }));
};

export const authService = {
  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/check');
      return response.data;
    } catch (error) {
      console.error('Auth check failed:', error);
      // Return unauthenticated state instead of throwing
      return { authenticated: false };
    }
  },

  // Send OTP
  sendOTP: async (phoneNumber) => {
    const response = await api.post('/otp/send-otp', { phoneNumber });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (phoneNumber, otpCode, name) => {
    const response = await api.post('/otp/verify-otp', { phoneNumber, otpCode, name });
    if (response.data.user) {
      updateUserData(response.data.user);
    }
    return response.data;
  },

  // Resend OTP
  resendOTP: async (phoneNumber) => {
    const response = await api.post('/otp/resend-otp', { phoneNumber });
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      if (response.data.success) {
        clearUserData();
      }
      return response.data;
    } catch (error) {
      clearUserData();
      return { success: true };
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default api;