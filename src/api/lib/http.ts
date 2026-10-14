import axios from "axios";

import { API_BASE_URL, API_TIMEOUT_MS } from "@/config/api";

import { attachInterceptors } from "./interceptors";

export const http = attachInterceptors(
  axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  }),
);
