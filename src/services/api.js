import axios from 'axios';

const getBaseURL = () => {
  // Always use the same pattern - add /api to both
  if (import.meta.env.PROD) {
    return 'https://otplessbackend.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseURL();
console.log(`🌐 API Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true
});

api.interceptors.request.use(config => {
  console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  response => { console.log(`📥 Response:`, response.status); return response; },
  error => { console.error(`❌ Error:`, error.message); return Promise.reject(error); }
);

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
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/check');
      return response.data;
    } catch (error) {
      return { authenticated: false };
    }
  },
  
  // SMS Services
  sendSMSOTP: async (phoneNumber) => {
    const response = await api.post('/sms/send-otp', { phoneNumber });
    return response.data;
  },
  verifySMSOTP: async (phoneNumber, otpCode, name) => {
    const response = await api.post('/sms/verify-otp', { phoneNumber, otpCode, name });
    if (response.data.user) updateUserData(response.data.user);
    return response.data;
  },
  resendSMSOTP: async (phoneNumber) => {
    const response = await api.post('/sms/resend-otp', { phoneNumber });
    return response.data;
  },
  
  // WhatsApp Services
  sendWhatsAppOTP: async (phoneNumber) => {
    const response = await api.post('/whatsapp/send-otp', { phoneNumber });
    return response.data;
  },
  verifyWhatsAppOTP: async (phoneNumber, otpCode, name) => {
    const response = await api.post('/whatsapp/verify-otp', { phoneNumber, otpCode, name });
    if (response.data.user) updateUserData(response.data.user);
    return response.data;
  },
  resendWhatsAppOTP: async (phoneNumber) => {
    const response = await api.post('/whatsapp/resend-otp', { phoneNumber });
    return response.data;
  },
  
  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      clearUserData();
      return response.data;
    } catch (error) {
      clearUserData();
      return { success: true };
    }
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default api;