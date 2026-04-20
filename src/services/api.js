import axios from 'axios';

const getBaseURL = () => {
  return 'https://otplessbackend.onrender.com';
};

const API_BASE_URL = getBaseURL();
console.log(`🌐 API Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true
});

// Add request interceptor for debugging
api.interceptors.request.use(config => {
  console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log('📋 Headers:', JSON.stringify(config.headers));
  console.log('📦 Body:', config.data);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => { 
    console.log(`📥 Response:`, response.status, response.data);
    return response; 
  },
  error => {
    console.error(`❌ Error Details:`);
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timed out! Backend is not responding');
    } else if (error.response) {
      // Server responded with error status
      console.error('📊 Response status:', error.response.status);
      console.error('📊 Response data:', error.response.data);
      console.error('📊 Response headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error('📡 No response received from server');
      console.error('🔄 Request config:', error.request);
      console.error('💡 Backend might be down or CORS issue');
    } else {
      console.error('⚠️ Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  checkAuth: async () => {
    try {
      console.log('🔍 Checking auth status...');
      const response = await api.get('/api/auth/check');
      console.log('✅ Auth check successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Auth check failed completely');
      return { authenticated: false, error: error.message };
    }
  },
  
  sendSMSOTP: async (phoneNumber) => {
    console.log('📱 Sending SMS OTP to:', phoneNumber);
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

export default api;