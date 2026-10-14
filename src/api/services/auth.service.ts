import { http } from "../lib/http";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SessionUser,
} from "../types/auth";

class AuthService {
  async login(payload: LoginRequest) {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    return data;
  }

  async register(payload: RegisterRequest) {
    const { data } = await http.post<RegisterResponse>("/auth/register", payload);
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
