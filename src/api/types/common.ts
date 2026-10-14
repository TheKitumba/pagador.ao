/** Error body returned by the API (RFC 9457 Problem Details). */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
