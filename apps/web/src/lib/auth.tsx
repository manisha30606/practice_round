"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAccessToken } from "./api";

type User = {
  id: string;
  name: string;
  email: string;
  role: "citizen" | "admin" | "worker";
};
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .post("/auth/refresh")
      .then((r) => {
        setAccessToken(r.data.data.accessToken);
        setUser(r.data.data.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        setAccessToken(response.data.data.accessToken);
        setUser(response.data.data.user);
      },
      signOut: async () => {
        await api.post("/auth/logout");
        setAccessToken(null);
        setUser(null);
      },
    }),
    [user, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
