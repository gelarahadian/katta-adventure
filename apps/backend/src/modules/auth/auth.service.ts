import type {
  ForgotPasswordInput,
  LoginInput,
  RefreshSessionInput,
  RegisterInput
} from "./auth.schemas.js";

export class AuthService {
  async register(input: RegisterInput) {
    return {
      implemented: false,
      module: "auth.register",
      message: "Register skeleton is ready for Prisma persistence and password hashing.",
      payload: {
        name: input.name,
        email: input.email,
        phone: input.phone ?? null
      }
    };
  }

  async login(input: LoginInput) {
    return {
      implemented: false,
      module: "auth.login",
      message: "Login skeleton is ready for credential verification and JWT issuance.",
      payload: {
        email: input.email
      }
    };
  }

  async forgotPassword(input: ForgotPasswordInput) {
    return {
      implemented: false,
      module: "auth.forgot-password",
      message: "Forgot password skeleton is ready for token generation and email delivery.",
      payload: {
        email: input.email
      }
    };
  }

  async refreshSession(input: RefreshSessionInput) {
    return {
      implemented: false,
      module: "auth.refresh",
      message: "Refresh skeleton is ready for refresh-token rotation and session lookup.",
      payload: {
        refreshTokenReceived: input.refreshToken.length > 0
      }
    };
  }

  async logout() {
    return {
      implemented: false,
      module: "auth.logout",
      message: "Logout skeleton is ready for session revocation and cookie clearing."
    };
  }
}

export const authService = new AuthService();
