import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api';

export const authKeys = { all: ['auth'], check: () => [...authKeys.all, 'check'] };

export const useAuthCheck = () => {
  return useQuery({ queryKey: authKeys.check(), queryFn: authService.checkAuth, staleTime: 5 * 60 * 1000 });
};

// SMS Hooks
export const useSendSMSOTP = () => {
  return useMutation({ mutationFn: authService.sendSMSOTP });
};

export const useVerifySMSOTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phoneNumber, otpCode, name }) => authService.verifySMSOTP(phoneNumber, otpCode, name),
    onSuccess: (data) => { if (data.verified) queryClient.invalidateQueries({ queryKey: authKeys.check() }); }
  });
};

export const useResendSMSOTP = () => {
  return useMutation({ mutationFn: authService.resendSMSOTP });
};

// WhatsApp Hooks
export const useSendWhatsAppOTP = () => {
  return useMutation({ mutationFn: authService.sendWhatsAppOTP });
};

export const useVerifyWhatsAppOTP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phoneNumber, otpCode, name }) => authService.verifyWhatsAppOTP(phoneNumber, otpCode, name),
    onSuccess: (data) => { if (data.verified) queryClient.invalidateQueries({ queryKey: authKeys.check() }); }
  });
};

export const useResendWhatsAppOTP = () => {
  return useMutation({ mutationFn: authService.resendWhatsAppOTP });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: authService.logout, onSuccess: () => queryClient.clear() });
};