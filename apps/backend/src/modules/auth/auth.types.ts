import type { UserRole, UserStatus } from "@prisma/client";

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

export interface AuthResult {
  user: AuthUserPayload;
  tokens: AuthTokens;
}
