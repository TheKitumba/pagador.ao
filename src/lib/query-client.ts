import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@api/lib/api-error";

const MAX_RETRIES = 2;

/**
 * The app's single QueryClient, shared by the provider and by query/mutation hooks
 * (import it instead of calling `useQueryClient()`).
 *
 * Data is only fetched in the browser. If server-side prefetching is ever added, create a
 * per-request client for it instead of reusing this one, so caches never mix between users.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // Client errors (validation, permissions, not found) will not succeed on retry.
      retry: (failureCount, error) => !(error instanceof ApiError && error.isClientError) && failureCount < MAX_RETRIES,
    },
  },
});
