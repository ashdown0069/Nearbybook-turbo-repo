"use client";

import { useMemo } from "react";
import { getCookie } from "cookies-next";
import { decodeJwt } from "jose";
import { JwtPayload } from "@repo/types";

interface AuthUser {
  id: string;
  email: string;
  nickname: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return { user: null, isAuthenticated: false };
    }

    const accessToken = getCookie("accessToken") as string | undefined;

    if (!accessToken) {
      return { user: null, isAuthenticated: false };
    }

    try {
      const decoded = decodeJwt(accessToken) as JwtPayload;

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return { user: null, isAuthenticated: false };
      }

      return {
        user: {
          id: decoded.sub,
          email: decoded.email,
          nickname: decoded.nickname,
        },
        isAuthenticated: true,
      };
    } catch {
      return { user: null, isAuthenticated: false };
    }
  }, []);
}
