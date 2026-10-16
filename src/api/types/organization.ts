/** Mirrors the organization endpoints of api.pagador.ao (see /v1/openapi.json). */

/** An entry of GET /companies: a company of the account the user can open. */
export interface CompanySummary {
  id: string;
  legalName: string;
  tradeName: string;
  nif: string;
  province: string | null;
  /** The company of the current session. */
  current: boolean;
}

/** GET /company: the employer data printed on payslips, contracts and tax returns. */
export interface Company {
  id: string;
  legalName: string;
  tradeName: string;
  nif: string;
  /** N.º de contribuinte do INSS. */
  socialSecurityNumber: string | null;
  /** CAE (activity code). */
  activityCode: string | null;
  sizeClass: "MICRO" | "SMALL" | "MEDIUM" | "LARGE";
  province: string | null;
  address: string | null;
  /** Public careers page: /careers/{careersSlug}. */
  careersSlug: string | null;
  defaultCurrency: string;
}

export type UpdateCompanyRequest = Partial<Pick<Company, "legalName" | "tradeName" | "nif" | "socialSecurityNumber" | "activityCode" | "province" | "address" | "careersSlug">>;

export interface Establishment {
  id: string;
  name: string;
  province: string | null;
  address: string | null;
  /** Require geolocation when clocking in. */
  geoPunch: boolean;
}

export interface EstablishmentRequest {
  name: string;
  province?: string;
  address?: string;
  geoPunch?: boolean;
}
