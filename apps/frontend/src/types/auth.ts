export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
}

export interface AuthSuccessResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
}

export interface AuthErrorResponse {
  message?: string;
  errors?: Array<{
    path?: string[];
    message?: string;
  }>;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
}
