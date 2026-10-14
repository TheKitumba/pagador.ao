import { create } from "@bentoo/state-man";

import { companies } from "@/mocks/people";

const useActiveCompanyStore = create(companies[0].nif);

/** Company selected in the app shell (multi-company accounts). */
export function useActiveCompany() {
  const { state: nif, setState: setNif } = useActiveCompanyStore();
  const company = companies.find((item) => item.nif === nif) ?? companies[0];
  return { company, setCompany: setNif };
}
