import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api';

// Query keys for caching
export const authKeys = {
  all: ['auth'],
  check: () => [...authKeys.all, 'check'],
};

// Hook to check authentication status
export const useAuthCheck = () => {
  return useQuery({
    queryKey: authKeys.check(),
    queryFn: authService.checkAuth,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Hook to send OTP
export const useSendOTP = () => {
  return useMutation({
    mutationFn: authService.sendOTP,
  });
};

// Hook to verify OTP
export const useVerifyOTP = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ phoneNumber, otpCode, name }) => 
      authService.verifyOTP(phoneNumber, otpCode, name),
    onSuccess: (data) => {
      if (data.verified) {
        queryClient.invalidateQueries({ queryKey: authKeys.check() });
      }
    },
  });
};

// Hook to resend OTP
export const useResendOTP = () => {
  return useMutation({
    mutationFn: authService.resendOTP,
  });
};

// Hook to logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};