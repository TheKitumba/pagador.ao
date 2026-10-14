import { useMutation } from "@tanstack/react-query";

import { authService } from "@api/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@api/types/auth";
import { queryClient } from "@/lib/query-client";

import { authKeys } from "./query";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: ({ user }) => queryClient.setQueryData(authKeys.session(), user),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: ({ user }) => queryClient.setQueryData(authKeys.session(), user),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => queryClient.clear(),
  });
}
