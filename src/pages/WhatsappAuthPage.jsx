import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WhatsAppPhoneInput from '../components/whatsapp/WhatsAppPhoneInput';
import WhatsAppOTPInput from '../components/whatsapp/WhatsAppOTPInput';
import Toast from '../components/common/Toast';
import { useSendWhatsAppOTP, useVerifyWhatsAppOTP, useResendWhatsAppOTP } from '../hooks/useAuth';

const WhatsAppAuthPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [toast, setToast] = useState(null);

  const sendOTPMutation = useSendWhatsAppOTP();
  const verifyOTPMutation = useVerifyWhatsAppOTP();
  const resendOTPMutation = useResendWhatsAppOTP();

  const showToastMessage = (message, type) => setToast({ message, type });

  const handleSendOTP = async (number) => {
    try {
      const data = await sendOTPMutation.mutateAsync(number);
      if (data.success) {
        setPhoneNumber(number);
        setStep('otp');
        showToastMessage('OTP sent successfully to your WhatsApp!', 'success');
      }
    } catch (error) {
      showToastMessage(error.response?.data?.message || 'Failed to send OTP', 'error');
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    try {
      const data = await verifyOTPMutation.mutateAsync({
        phoneNumber, otpCode, name: userName || 'User'
      });
      if (data.verified) {
        showToastMessage('✅ Phone number verified successfully!', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showToastMessage(data.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      showToastMessage(error.response?.data?.message || 'Failed to verify OTP', 'error');
    }
  };

  const handleResendOTP = async () => {
    try {
      const data = await resendOTPMutation.mutateAsync(phoneNumber);
      if (data.success) {
        showToastMessage('OTP resent successfully!', 'success');
      }
    } catch (error) {
      showToastMessage(error.response?.data?.message || 'Failed to resend OTP', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => navigate('/')} className="text-gray-500 mb-4">← Back</button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            WhatsApp Verification
          </h1>
          <p className="text-gray-500 text-sm mt-2">Enter the 6-digit code sent to your WhatsApp</p>
        </div>

        {step === 'phone' ? (
          <>
            <div className="mb-4">
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name (Optional)" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <WhatsAppPhoneInput onSubmit={handleSendOTP} isLoading={sendOTPMutation.isPending} />
          </>
        ) : (
          <WhatsAppOTPInput phoneNumber={phoneNumber} onVerify={handleVerifyOTP}
            onResend={handleResendOTP} isLoading={verifyOTPMutation.isPending}
            isResending={resendOTPMutation.isPending} />
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default WhatsAppAuthPage;