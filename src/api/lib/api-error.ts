import { isAxiosError } from "axios";

import type { ProblemDetails } from "../types/common";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors: Record<string, string[]>;

  constructor(problem: ProblemDetails) {
    super(problem.detail ?? problem.title);
    this.name = "ApiError";
    this.status = problem.status;
    this.code = problem.code;
    this.fieldErrors = problem.errors ?? {};
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  static from(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (isAxiosError<ProblemDetails>(error) && error.response?.data?.status) {
      return new ApiError(error.response.data);
    }

    if (isAxiosError(error) && !error.response) {
      return new ApiError({ type: "about:blank", title: "Sem ligação ao servidor", status: 0 });
    }

    return new ApiError({ type: "about:blank", title: "Ocorreu um erro inesperado", status: 500 });
  }
}
