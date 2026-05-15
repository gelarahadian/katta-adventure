import { UserStatus } from "@prisma/client";

import { env } from "../../config/env.js";
import { AppError } from "../../lib/app-error.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { prisma } from "../../lib/prisma.js";
import {
  generateOpaqueToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../../lib/token.js";

import type {
  ForgotPasswordInput,
  LoginInput,
  ProfileParamsInput,
  RefreshSessionInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput
} from "./auth.schemas.js";
import type { AuthResult, AuthUserPayload } from "./auth.types.js";

function getRefreshExpiryDate() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRES_IN_DAYS);
  return expiresAt;
}

function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  role: AuthUserPayload["role"];
  status: AuthUserPayload["status"];
}): AuthUserPayload {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };
}

export class AuthService {
  private async createSessionTokens(user: AuthUserPayload): Promise<AuthResult> {
    const sessionId = crypto.randomUUID();
    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      sessionId
    });
    const refreshToken = signRefreshToken({
      sub: user.id,
      role: user.role,
      sessionId
    });
    const refreshExpiresAt = getRefreshExpiryDate();

    await prisma.authSession.create({
      data: {
        id: sessionId,
        refreshTokenHash: hashToken(refreshToken),
        expiresAt: refreshExpiresAt,
        userId: user.id
      }
    });

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
        refreshExpiresAt
      }
    };
  }

  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email
      }
    });

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        phone: input.phone,
        status: UserStatus.ACTIVE
      }
    });

    return this.createSessionTokens(serializeUser(user));
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email
      }
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);

    if (!isValid) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new AppError("Account is suspended", 403);
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: new Date(),
        status: user.status === UserStatus.PENDING ? UserStatus.ACTIVE : user.status
      }
    });

    return this.createSessionTokens(
      serializeUser({
        ...user,
        status: user.status === UserStatus.PENDING ? UserStatus.ACTIVE : user.status
      })
    );
  }

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email
      }
    });

    if (!user) {
      return {
        message: "If the email exists, a reset link will be sent."
      };
    }

    const rawToken = generateOpaqueToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        expiresAt,
        userId: user.id
      }
    });

    return {
      message: "If the email exists, a reset link will be sent.",
      previewToken: env.NODE_ENV === "development" ? rawToken : undefined
    };
  }

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = hashToken(input.token);
    const passwordReset = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash
      },
      include: {
        user: true
      }
    });

    if (!passwordReset || passwordReset.usedAt || passwordReset.expiresAt < new Date()) {
      throw new AppError("Reset token is invalid or expired", 400);
    }

    const passwordHash = await hashPassword(input.password);

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: passwordReset.userId
        },
        data: {
          passwordHash
        }
      }),
      prisma.passwordResetToken.update({
        where: {
          id: passwordReset.id
        },
        data: {
          usedAt: new Date()
        }
      }),
      prisma.authSession.updateMany({
        where: {
          userId: passwordReset.userId,
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      })
    ]);

    return {
      message: "Password has been reset successfully."
    };
  }

  async refreshSession(input: RefreshSessionInput): Promise<AuthResult> {
    const payload = verifyRefreshToken(input.refreshToken);
    const session = await prisma.authSession.findUnique({
      where: {
        id: payload.sessionId
      },
      include: {
        user: true
      }
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new AppError("Refresh session is invalid or expired", 401);
    }

    if (session.refreshTokenHash !== hashToken(input.refreshToken)) {
      throw new AppError("Refresh token mismatch", 401);
    }

    const user = serializeUser(session.user);
    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      sessionId: session.id
    });
    const refreshToken = signRefreshToken({
      sub: user.id,
      role: user.role,
      sessionId: session.id
    });
    const refreshExpiresAt = getRefreshExpiryDate();

    await prisma.authSession.update({
      where: {
        id: session.id
      },
      data: {
        refreshTokenHash: hashToken(refreshToken),
        expiresAt: refreshExpiresAt
      }
    });

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
        refreshExpiresAt
      }
    };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return {
        message: "Logged out."
      };
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      await prisma.authSession.updateMany({
        where: {
          id: payload.sessionId,
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      });
    } catch {
      return {
        message: "Logged out."
      };
    }

    return {
      message: "Logged out."
    };
  }

  async getProfile(params: ProfileParamsInput) {
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async updateProfile(params: ProfileParamsInput, input: UpdateProfileInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: params.userId
      },
      select: {
        id: true,
        email: true
      }
    });

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    if (input.email && input.email !== existingUser.email) {
      const emailOwner = await prisma.user.findUnique({
        where: {
          email: input.email
        },
        select: {
          id: true
        }
      });

      if (emailOwner && emailOwner.id !== params.userId) {
        throw new AppError("Email is already used by another account", 409);
      }
    }

    const updated = await prisma.user.update({
      where: {
        id: params.userId
      },
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });

    return {
      message: "Profile updated",
      user: updated
    };
  }
}

export const authService = new AuthService();
