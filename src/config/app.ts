export const APP_NAME = "Pagador.ao";
export const APP_DESCRIPTION = "Sistema completo de gestão de recursos humanos e folha de pagamento";

export const LOCALE = "pt-AO";
export const TIMEZONE = "Africa/Luanda";
export const CURRENCY = "AOA";

export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  account: "/account",
  portal: "/portal",
  onboarding: "/onboarding",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  acceptInvitation: "/accept-invitation",
} as const;

/** Cookies set by api.pagador.ao (HttpOnly: readable by the server, never by page scripts). */
export const AUTH_COOKIES = {
  /** The access token (RS256 JWT, a few minutes). */
  access: "access_token",
  /** Present while a refresh token exists; carries no credential. */
  session: "pagador_session",
} as const;
