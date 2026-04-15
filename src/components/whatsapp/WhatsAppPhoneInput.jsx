import React, { useState } from 'react';

const WhatsAppPhoneInput = ({ onSubmit, isLoading }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const validatePhoneNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length >= 10 && cleanNumber.length <= 15;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }
    setError('');
    onSubmit(phoneNumber.replace(/\D/g, ''));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your WhatsApp number"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending WhatsApp OTP...
            </div>
          ) : (
            'Send OTP via WhatsApp'
          )}
        </button>
      </form>
    </div>
  );
};

export default WhatsAppPhoneInput;