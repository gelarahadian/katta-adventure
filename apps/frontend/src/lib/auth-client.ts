import type {
  AuthErrorResponse,
  AuthSuccessResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  RegisterPayload
} from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return API_BASE_URL;
}

async function parseError(response: Response) {
  let message = "Terjadi kesalahan. Silakan coba lagi.";

  try {
    const payload = (await response.json()) as AuthErrorResponse;
    if (payload.message) {
      message = payload.message;
    } else if (payload.errors?.[0]?.message) {
      message = payload.errors[0].message;
    }
  } catch {
    message = "Tidak bisa terhubung ke server auth.";
  }

  return new Error(message);
}

async function request<TResponse>(path: string, payload: unknown) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export function registerRequest(payload: RegisterPayload) {
  return request<AuthSuccessResponse>("/api/v1/auth/register", payload);
}

export function loginRequest(payload: LoginPayload) {
  return request<AuthSuccessResponse>("/api/v1/auth/login", payload);
}

export function forgotPasswordRequest(payload: ForgotPasswordPayload) {
  return request<ForgotPasswordResponse>("/api/v1/auth/forgot-password", payload);
}

export async function logoutRequest() {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({})
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as { message: string };
}
