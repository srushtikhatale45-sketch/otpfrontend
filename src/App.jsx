import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthCheck } from './hooks/useAuth';
import LoginChoice from './pages/LoginChoice';
import SMSAuthPage from './pages/SMSAuthPage';
import WhatsAppAuthPage from './pages/WhatsappAuthPage';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useLogout } from './hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { data: authData, isLoading } = useAuthCheck();
  if (isLoading) return <LoadingSpinner />;
  return authData?.authenticated ? children : <Navigate to="/" replace />;
};

function App() {
  const logoutMutation = useLogout();
  const { data: authData, isLoading } = useAuthCheck();

  if (isLoading) return <LoadingSpinner />;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = '/';
  };

  return (
    <Routes>
      <Route path="/" element={<LoginChoice />} />
      <Route path="/login/sms" element={<SMSAuthPage />} />
      <Route path="/login/whatsapp" element={<WhatsAppAuthPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard user={authData?.user} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;