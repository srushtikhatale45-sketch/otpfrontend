import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '✓' : '✗';

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in`}>
      <span className="font-bold">{icon}</span>
      <p className="text-sm">{message}</p>
      <button onClick={onClose} className="ml-4 hover:opacity-80">×</button>
    </div>
  );
};

export default Toast;