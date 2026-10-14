import { create } from "@bentoo/state-man";

/** Company currently selected in the app shell (multi-company accounts). */
export const useActiveCompanyStore = create<string | null>(null);
