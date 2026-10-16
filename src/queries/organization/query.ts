import { useQuery } from "@tanstack/react-query";

import { organizationService } from "@api/services/organization.service";

export const organizationKeys = {
  all: ["organization"] as const,
  companies: () => [...organizationKeys.all, "companies"] as const,
  company: () => [...organizationKeys.all, "company"] as const,
  establishments: () => [...organizationKeys.all, "establishments"] as const,
};

/** Companies the user can open (GET /companies); `current` marks the session's. */
export function useCompaniesQuery() {
  return useQuery({
    queryKey: organizationKeys.companies(),
    queryFn: () => organizationService.listCompanies(),
    staleTime: 5 * 60_000,
  });
}

/** The current company's employer data (GET /company, needs organization.read). */
export function useCompanyQuery(enabled = true) {
  return useQuery({
    queryKey: organizationKeys.company(),
    queryFn: () => organizationService.getCompany(),
    enabled,
  });
}

export function useEstablishmentsQuery(enabled = true) {
  return useQuery({
    queryKey: organizationKeys.establishments(),
    queryFn: () => organizationService.listEstablishments(),
    enabled,
  });
}
