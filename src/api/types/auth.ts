export interface SessionUser {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  companyId: string | null;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: SessionUser;
  requiresTwoFactor: boolean;
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

export interface RegisterResponse {
  user: SessionUser;
}
