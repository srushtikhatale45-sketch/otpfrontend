import React, { useState, useEffect } from 'react';
import PhoneInput from './components/PhoneInput';
import OTPInput from './components/OTPInput';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';
import { useAuthCheck, useSendOTP, useVerifyOTP, useResendOTP, useLogout } from './hooks/useAuth';

const App = () => {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [toast, setToast] = useState(null);
  const [showTestOTP, setShowTestOTP] = useState(false);
  const [testOTP, setTestOTP] = useState('');

  // TanStack Query hooks (using your api.js internally)
  const { data: authData, isLoading: checkingAuth } = useAuthCheck();
  const sendOTPMutation = useSendOTP();
  const verifyOTPMutation = useVerifyOTP();
  const resendOTPMutation = useResendOTP();
  const logoutMutation = useLogout();

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Handle authentication state
  useEffect(() => {
    if (authData?.authenticated) {
      setStep('dashboard');
    }
  }, [authData]);

  const handleSendOTP = async (number) => {
    try {
      const data = await sendOTPMutation.mutateAsync(number);
      
      if (data.success) {
        setPhoneNumber(number);
        setStep('otp');
        showToast('OTP sent successfully!', 'success');
        
        if (data.devOtp) {
          setTestOTP(data.devOtp);
          setShowTestOTP(true);
          showToast(`Your OTP is: ${data.devOtp}`, 'success');
          setTimeout(() => setShowTestOTP(false), 10000);
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      let errorMessage = 'Failed to send OTP. ';
      if (error.code === 'ERR_NETWORK') {
        errorMessage += 'Cannot connect to server.';
      } else if (error.response?.status === 404) {
        errorMessage += 'API endpoint not found.';
      } else {
        errorMessage += error.response?.data?.message || error.message;
      }
      showToast(errorMessage, 'error');
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    try {
      const data = await verifyOTPMutation.mutateAsync({
        phoneNumber,
        otpCode,
        name: userName || 'User'
      });
      
      if (data.verified) {
        showToast('✅ Phone number verified successfully!', 'success');
        
        setTimeout(() => {
          setStep('dashboard');
          setPhoneNumber('');
          setUserName('');
          setTestOTP('');
          setShowTestOTP(false);
        }, 1000);
      } else {
        showToast(data.message || 'Invalid OTP. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      showToast(
        error.response?.data?.message || 'Failed to verify OTP. Please try again.',
        'error'
      );
    }
  };

  const handleResendOTP = async () => {
    try {
      const data = await resendOTPMutation.mutateAsync(phoneNumber);
      
      if (data.success) {
        showToast('OTP resent successfully!', 'success');
        if (data.devOtp) {
          setTestOTP(data.devOtp);
          setShowTestOTP(true);
          showToast(`New OTP: ${data.devOtp}`, 'success');
          setTimeout(() => setShowTestOTP(false), 10000);
        }
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      showToast(
        error.response?.data?.message || 'Failed to resend OTP. Please try again.',
        'error'
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setStep('phone');
      showToast('Logged out successfully', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Failed to logout', 'error');
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (step === 'dashboard' && authData?.authenticated) {
    return <Dashboard user={authData.user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {showTestOTP && testOTP && (
        <div className="fixed top-4 left-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Development OTP:</strong> {testOTP}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Valid for 5 minutes only
              </p>
            </div>
            <button
              onClick={() => setShowTestOTP(false)}
              className="ml-4 text-yellow-500 hover:text-yellow-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            OTP Verification
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'phone' 
              ? 'Enter your phone number to receive OTP' 
              : 'Enter the 6-digit code sent to your phone'}
          </p>
        </div>

        {step === 'phone' ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <PhoneInput 
              onSubmit={handleSendOTP}
              isLoading={sendOTPMutation.isPending}
            />
          </>
        ) : (
          <OTPInput
            phoneNumber={phoneNumber}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            isLoading={verifyOTPMutation.isPending}
            isResending={resendOTPMutation.isPending}
          />
        )}

        {step === 'otp' && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={() => {
                setStep('phone');
                setPhoneNumber('');
                setTestOTP('');
                setShowTestOTP(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              ← Change phone number
            </button>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;