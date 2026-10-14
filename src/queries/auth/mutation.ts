import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "@api/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@api/types/auth";

import { authKeys } from "./query";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: ({ user }) => queryClient.setQueryData(authKeys.session(), user),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: ({ user }) => queryClient.setQueryData(authKeys.session(), user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => queryClient.clear(),
  });
}
