import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { isPublicPath } from "@/config/access";
import { ROUTES } from "@/config/app";

import { ApiError } from "./api-error";
import { tokenManager } from "./token-manager";

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// Unauthenticated endpoints: a 401 there means bad credentials or code, not an expired session.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout", "/auth/2fa/verify", "/auth/otp/", "/auth/password/", "/auth/invitations/"];

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (isPublicPath(window.location.pathname)) return;

  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.assign(`${ROUTES.login}?next=${next}`);
}

export function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => config?.url?.startsWith(path));

    if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
      throw ApiError.from(error);
    }

    config._retried = true;

    try {
      await tokenManager.refresh();
    } catch {
      redirectToLogin();
      throw ApiError.from(error);
    }

    return instance(config);
  });

  return instance;
}
