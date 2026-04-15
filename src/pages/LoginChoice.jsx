import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Choose Login Method
          </h1>
          <p className="text-gray-600 mt-2">Select how you want to receive OTP</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/login/sms')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Login with SMS
          </button>

          <button
            onClick={() => navigate('/login/whatsapp')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.032 2.002c-5.514 0-9.986 4.472-9.986 9.986 0 1.744.449 3.46 1.296 4.966L2 22l5.285-1.425c1.44.789 3.094 1.227 4.747 1.227 5.514 0 9.986-4.472 9.986-9.986 0-5.513-4.472-9.985-9.986-9.985z"/>
            </svg>
            Login with WhatsApp
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to receive OTP via your selected channel
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginChoice;