import axios from 'axios';

// ========== CONFIGURATION ==========
const getBaseURL = () => {
  return 'https://otpbackend-1-w947.onrender.com'; 
};

const API_BASE_URL = getBaseURL();
console.log(`🌐 API Base URL: ${API_BASE_URL}`);

// ========== HELPER FUNCTIONS ==========
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

// ========== AXIOS INSTANCE ==========
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000,
  withCredentials: true
});

// ========== INTERCEPTORS ==========
api.interceptors.request.use(config => {
  console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log('📋 Headers:', config.headers);
  return config;
});

api.interceptors.response.use(
  response => { 
    console.log(`📥 Response:`, response.status, response.data);
    return response; 
  },
  error => {
    console.error(`❌ Error:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    return Promise.reject(error);
  }
);

// ========== SERVICE METHODS ==========
export const authService = {
  checkAuth: async () => {
    try {
      const response = await api.get('/api/auth/check');
      return response.data;
    } catch (error) {
      console.error('Auth check failed:', error);
      return { authenticated: false, error: error.message };
    }
  },
  
  sendSMSOTP: async (phoneNumber) => {
    const response = await api.post('/api/sms/send-otp', { phoneNumber });
    return response.data;
  },
  
  verifySMSOTP: async (phoneNumber, otpCode, name) => {
    const response = await api.post('/api/sms/verify-otp', { phoneNumber, otpCode, name });
    if (response.data.user) updateUserData(response.data.user);
    return response.data;
  },
  
  resendSMSOTP: async (phoneNumber) => {
    const response = await api.post('/api/sms/resend-otp', { phoneNumber });
    return response.data;
  },
  
  sendWhatsAppOTP: async (phoneNumber) => {
    const response = await api.post('/api/whatsapp/send-otp', { phoneNumber });
    return response.data;
  },
  
  verifyWhatsAppOTP: async (phoneNumber, otpCode, name) => {
    const response = await api.post('/api/whatsapp/verify-otp', { phoneNumber, otpCode, name });
    if (response.data.user) updateUserData(response.data.user);
    return response.data;
  },
  
  resendWhatsAppOTP: async (phoneNumber) => {
    const response = await api.post('/api/whatsapp/resend-otp', { phoneNumber });
    return response.data;
  },
  
  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
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