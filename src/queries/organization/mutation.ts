import { useMutation } from "@tanstack/react-query";

import { organizationService } from "@api/services/organization.service";
import type { EstablishmentRequest, UpdateCompanyRequest } from "@api/types/organization";
import { queryClient } from "@/lib/query-client";

import { organizationKeys } from "./query";

export function useUpdateCompanyMutation() {
  return useMutation({
    mutationFn: (payload: UpdateCompanyRequest) => organizationService.updateCompany(payload),
    onSuccess: (company) => {
      queryClient.setQueryData(organizationKeys.company(), company);
      // Names shown in the company switcher.
      return queryClient.invalidateQueries({ queryKey: organizationKeys.companies() });
    },
  });
}

const refreshEstablishments = () => queryClient.invalidateQueries({ queryKey: organizationKeys.establishments() });

export function useCreateEstablishmentMutation() {
  return useMutation({
    mutationFn: (payload: EstablishmentRequest) => organizationService.createEstablishment(payload),
    onSuccess: refreshEstablishments,
  });
}

export function useUpdateEstablishmentMutation() {
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<EstablishmentRequest> & { id: string }) => organizationService.updateEstablishment(id, payload),
    onSuccess: refreshEstablishments,
  });
}

export function useArchiveEstablishmentMutation() {
  return useMutation({
    mutationFn: (id: string) => organizationService.archiveEstablishment(id),
    onSuccess: refreshEstablishments,
  });
}
