/** Mirrors the auth DTOs of api.pagador.ao (see /v1/openapi.json). */

export type Role =
  | "ACCOUNT_ADMIN"
  | "HR_MANAGER"
  | "HR_TECHNICIAN"
  | "PAYROLL_PROCESSOR"
  | "FINANCIAL_APPROVER"
  | "LINE_MANAGER"
  | "RECRUITER"
  | "EMPLOYEE"
  | "AUDITOR";

/** Same wording as the API (shared/application/permissions.ts). */
export const ROLE_LABEL: Record<Role, string> = {
  ACCOUNT_ADMIN: "Administrador da conta",
  HR_MANAGER: "Gestor de RH",
  HR_TECHNICIAN: "Técnico de RH",
  PAYROLL_PROCESSOR: "Processador salarial",
  FINANCIAL_APPROVER: "Aprovador financeiro",
  LINE_MANAGER: "Chefia directa",
  RECRUITER: "Recrutador",
  EMPLOYEE: "Trabalhador",
  AUDITOR: "Auditor",
};

export interface SessionUser {
  id: string;
  name: string;
  email: string | null;
  tenantId: string;
  companyId: string | null;
  /** Linked employee record (employee portal), if any. */
  employeeId: string | null;
  roles: Role[];
  /** Effective permissions, e.g. "payroll.approve" — use to show or hide actions. */
  permissions: string[];
  twoFactorEnabled: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  /** Account to open when the user belongs to several. */
  tenantId?: string;
}

export interface LoginResponse {
  /** Null while a second factor is required. */
  user: SessionUser | null;
  requiresTwoFactor: boolean;
  /** Send with the TOTP code to POST /auth/2fa/verify. */
  challengeToken?: string;
}

export interface TwoFactorVerifyRequest {
  challengeToken: string;
  code: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  company: {
    name: string;
    nif: string;
    size: string;
    province: string;
  };
}

export type RegisterResponse = LoginResponse;

export interface OtpVerifyRequest {
  /** +244 9XX XXX XXX */
  phone: string;
  code: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AcceptInvitationRequest {
  token: string;
  name: string;
  password: string;
}

export interface TwoFactorSetup {
  secret: string;
  /** Show as a QR code for the authenticator app. */
  otpauthUrl: string;
}
