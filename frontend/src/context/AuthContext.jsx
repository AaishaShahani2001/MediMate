import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
export const API_BASE = import.meta.env.CLIENT_ORIGIN || "http://localhost:3000";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hva_session")) || null; } catch { return null; }
  });

  useEffect(() => {
    if (session) localStorage.setItem("hva_session", JSON.stringify(session));
    else localStorage.removeItem("hva_session");
  }, [session]);

  function login({ token, user }) {
    setSession({ token, user });
  }

  function logout() {
    setSession(null);
  }

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || null,
    login,
    logout,
    authHeader: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
