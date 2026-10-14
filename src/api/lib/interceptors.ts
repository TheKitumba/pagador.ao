import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { ROUTES } from "@/config/app";

import { ApiError } from "./api-error";
import { tokenManager } from "./token-manager";

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

const AUTH_ENDPOINTS = ["/auth/login", "/auth/refresh", "/auth/logout"];

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname === ROUTES.login) return;

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
