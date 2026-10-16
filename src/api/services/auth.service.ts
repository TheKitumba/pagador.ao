import { http } from "../lib/http";
import type {
  AcceptInvitationRequest,
  LoginRequest,
  LoginResponse,
  OtpVerifyRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  SessionUser,
  TwoFactorSetup,
  TwoFactorVerifyRequest,
} from "../types/auth";

class AuthService {
  async login(payload: LoginRequest) {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    return data;
  }

  async verifyTwoFactor(payload: TwoFactorVerifyRequest) {
    const { data } = await http.post<LoginResponse>("/auth/2fa/verify", payload);
    return data;
  }

  async register(payload: RegisterRequest) {
    const { data } = await http.post<RegisterResponse>("/auth/register", payload);
    return data;
  }

  /** Always 204, whether or not the number exists. */
  async requestLoginCode(phone: string) {
    await http.post("/auth/otp/request", { phone });
  }

  async verifyLoginCode(payload: OtpVerifyRequest) {
    const { data } = await http.post<LoginResponse>("/auth/otp/verify", payload);
    return data;
  }

  /** Always 204, whether or not the account exists. */
  async forgotPassword(email: string) {
    await http.post("/auth/password/forgot", { email });
  }

  /** Ends every open session of the user. */
  async resetPassword(payload: ResetPasswordRequest) {
    await http.post("/auth/password/reset", payload);
  }

  async acceptInvitation(payload: AcceptInvitationRequest) {
    const { data } = await http.post<LoginResponse>("/auth/invitations/accept", payload);
    return data;
  }

  async setupTwoFactor() {
    const { data } = await http.post<TwoFactorSetup>("/auth/2fa/setup");
    return data;
  }

  async enableTwoFactor(code: string) {
    await http.post("/auth/2fa/enable", { code });
  }

  /** Opens another company of the account; the API re-issues the session cookies. */
  async switchCompany(companyId: string) {
    const { data } = await http.post<SessionUser>("/auth/company", { companyId });
    return data;
  }

  async logout() {
    await http.post("/auth/logout");
  }

  async me() {
    const { data } = await http.get<SessionUser>("/auth/me");
    return data;
  }
}

export const authService = new AuthService();
