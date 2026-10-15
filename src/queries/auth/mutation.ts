import { useMutation } from "@tanstack/react-query";

import { authService } from "@api/services/auth.service";
import type {
  AcceptInvitationRequest,
  LoginRequest,
  LoginResponse,
  OtpVerifyRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TwoFactorVerifyRequest,
} from "@api/types/auth";
import { queryClient } from "@/lib/query-client";

import { authKeys } from "./query";

/** A new session replaces whatever was cached for the previous one. */
function startSession({ user }: LoginResponse) {
  if (!user) return;
  queryClient.clear();
  queryClient.setQueryData(authKeys.session(), user);
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: startSession,
  });
}

export function useVerifyTwoFactorMutation() {
  return useMutation({
    mutationFn: (payload: TwoFactorVerifyRequest) => authService.verifyTwoFactor(payload),
    onSuccess: startSession,
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: startSession,
  });
}

export function useRequestLoginCodeMutation() {
  return useMutation({ mutationFn: (phone: string) => authService.requestLoginCode(phone) });
}

export function useVerifyLoginCodeMutation() {
  return useMutation({
    mutationFn: (payload: OtpVerifyRequest) => authService.verifyLoginCode(payload),
    onSuccess: startSession,
  });
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: (email: string) => authService.forgotPassword(email) });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: (payload: ResetPasswordRequest) => authService.resetPassword(payload) });
}

export function useAcceptInvitationMutation() {
  return useMutation({
    mutationFn: (payload: AcceptInvitationRequest) => authService.acceptInvitation(payload),
    onSuccess: startSession,
  });
}

export function useSetupTwoFactorMutation() {
  return useMutation({ mutationFn: () => authService.setupTwoFactor() });
}

export function useEnableTwoFactorMutation() {
  return useMutation({
    mutationFn: (code: string) => authService.enableTwoFactor(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => queryClient.clear(),
  });
}
