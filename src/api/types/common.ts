/** Error body returned by the API (RFC 9457 Problem Details). */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/** Cursor page: pass `nextCursor` back as `cursor` until it is null. */
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
}

export interface PaginationParams {
  cursor?: string;
  /** 1–200, default 50. */
  limit?: number;
}
