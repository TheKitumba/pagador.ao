import { QueryClient, isServer } from "@tanstack/react-query";

import { ApiError } from "@api/lib/api-error";

const MAX_RETRIES = 2;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        // Client errors (validation, permissions, not found) will not succeed on retry.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.isClientError) && failureCount < MAX_RETRIES,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
