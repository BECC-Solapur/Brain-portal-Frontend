"use client";

import React, {
  createContext, useContext, useEffect, useMemo, useState, useCallback,
  ReactNode,
} from "react";
import {
  api, setAccessToken as apiSetToken, clearAccessToken as apiClearToken,
  getAccessToken as apiGetToken, subscribeToken,
} from "@/lib/api";
import type {
  LoginReq, LoginRes, SignupReq, ParentSignupReq, AnySignupReq, SignupRes, UserIdentity,
} from "@/lib/api-types";
import { ClientApiError } from "@/lib/api-types";

const TOKEN_KEY_LOCAL = "brain_access_token";
const REFRESH_KEY = "brain_refresh_token";
const USER_KEY_LOCAL = "brain_user";

interface AuthState {
  user: UserIdentity | null;
  accessToken: string | null;
  loading: boolean;
  error: ClientApiError | null;
}

interface AuthContextValue extends AuthState {
  signup: (payload: AnySignupReq) => Promise<SignupRes>;
  login: (payload: LoginReq) => Promise<LoginRes>;
  logout: (everywhere?: boolean) => Promise<void>;
  fetchMe: () => Promise<UserIdentity | null>;
  setManualImpersonateRole: (role: string | null) => void;
  impersonatedRole: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readUser(): UserIdentity | null {
  try {
    const raw = localStorage.getItem(USER_KEY_LOCAL);
    if (raw) return JSON.parse(raw) as UserIdentity;
  } catch { /* empty */ }
  return null;
}

function writeUser(u: UserIdentity | null) {
  try {
    if (u) localStorage.setItem(USER_KEY_LOCAL, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY_LOCAL);
  } catch { /* empty */ }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY_LOCAL) : null
  );
  const [user, setUser] = useState<UserIdentity | null>(() =>
    typeof window !== "undefined" ? readUser() : null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ClientApiError | null>(null);
  const [impersonatedRole, setImpersonatedRole] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToken((t) => setToken(t));
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    // Ensure initial sync
    if (!accessToken && typeof window !== "undefined") {
      const t = localStorage.getItem(TOKEN_KEY_LOCAL);
      if (t) { apiSetToken(t); setToken(t); }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const commitLogin = useCallback((res: LoginRes | SignupRes, persist: boolean = true) => {
    apiSetToken(res.accessToken);
    setToken(res.accessToken);
    writeUser(res.user);
    setUser(res.user);
    try {
      if ((res as any).refreshToken && persist) {
        localStorage.setItem(REFRESH_KEY, (res as any).refreshToken);
      }
    } catch { /* empty */ }
    setError(null);
  }, []);

  const fetchMe = useCallback(async (): Promise<UserIdentity | null> => {
    if (!apiGetToken()) return null;
    setLoading(true);
    try {
      const me = await api.auth.me();
      writeUser(me);
      setUser(me);
      setError(null);
      return me;
    } catch (e: any) {
      if (e instanceof ClientApiError && e.statusCode === 401) {
        apiClearToken();
        writeUser(null);
        setUser(null);
      }
      setError(e instanceof ClientApiError ? e : new ClientApiError('INTERNAL_SERVER_ERROR', String(e?.message || e), 500));
      return null;
    } finally { setLoading(false); }
  }, []);

  const signup = useCallback(async (payload: AnySignupReq): Promise<SignupRes> => {
    setLoading(true);
    try {
      const res = payload.role === "parent"
        ? await api.auth.signupParent(payload)
        : await api.auth.signupStudent(payload as SignupReq);
      commitLogin(res);
      await fetchMe();
      return res;
    } catch (e: any) {
      const err = e instanceof ClientApiError ? e : new ClientApiError('INTERNAL_SERVER_ERROR', String(e?.message || e), 500);
      setError(err);
      throw err;
    } finally { setLoading(false); }
  }, [commitLogin, fetchMe]);

  const login = useCallback(async (payload: LoginReq): Promise<LoginRes> => {
    setLoading(true);
    try {
      const res = await api.auth.login(payload);
      commitLogin(res);
      await fetchMe();
      return res;
    } catch (e: any) {
      const err = e instanceof ClientApiError ? e : new ClientApiError('INTERNAL_SERVER_ERROR', String(e?.message || e), 500);
      setError(err);
      throw err;
    } finally { setLoading(false); }
  }, [commitLogin, fetchMe]);

  const logout = useCallback(async (everywhere?: boolean) => {
    try { await api.auth.logout().catch(() => void 0); } finally {
      apiClearToken();
      try { localStorage.removeItem(REFRESH_KEY); } catch { /* empty */ }
      writeUser(null);
      setUser(null);
      setError(null);
      setImpersonatedRole(null);
    }
  }, []);

  const setManualImpersonateRole = useCallback((role: string | null) => {
    setImpersonatedRole(role);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, accessToken, loading, error,
    signup, login, logout, fetchMe,
    impersonatedRole, setManualImpersonateRole,
  }), [user, accessToken, loading, error, signup, login, logout, fetchMe, impersonatedRole, setManualImpersonateRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useEffectiveRole(): string {
  const { user, impersonatedRole } = useAuth();
  if (impersonatedRole) return impersonatedRole;
  return user?.primaryRole || "";
}
