import axios from "axios";

import { API_BASE_URL, API_TIMEOUT_MS } from "@/config/api";

/**
 * Access and refresh tokens live in HttpOnly cookies set by the API, so they are never
 * readable here. This manager only coordinates refreshing the session: concurrent 401s
 * share a single refresh request instead of each triggering their own.
 */
class TokenManager {
  private pendingRefresh: Promise<void> | null = null;

  // A bare client, so the refresh call never goes through the 401 interceptor itself.
  private readonly client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    withCredentials: true,
  });

  refresh(): Promise<void> {
    this.pendingRefresh ??= this.client
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        this.pendingRefresh = null;
      });

    return this.pendingRefresh;
  }
}

export const tokenManager = new TokenManager();
