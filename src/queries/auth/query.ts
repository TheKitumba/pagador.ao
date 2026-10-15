import { useQuery } from "@tanstack/react-query";

import { authService } from "@api/services/auth.service";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

/** The signed-in user (GET /auth/me). Shells render nothing protected until it resolves. */
export function useSessionQuery() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => authService.me(),
    staleTime: 5 * 60_000,
    retry: false,
  });
}
