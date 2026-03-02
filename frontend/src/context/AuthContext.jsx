import { createContext, useContext, useEffect, useMemo, useState } from "react";
import socket from "../socket";

const AuthContext = createContext(null);

export const API_BASE =
  import.meta.env.CLIENT_ORIGIN || "http://localhost:3000";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hva_session")) || null;
    } catch {
      return null;
    }
  });

  /* ================= PERSIST SESSION ================= */
  useEffect(() => {
    if (session) {
      localStorage.setItem("hva_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("hva_session");
    }
  }, [session]);

  /* ================= LOGIN ================= */
  function login({ token, user }) {
    setSession({ token, user });

    // attach auth BEFORE connect
    socket.auth = {
      token,
      userId: user._id,
      role: user.role,
    };

    socket.connect();
  }

  /* ================= LOGOUT ================= */
  function logout() {
    socket.disconnect();
    setSession(null);
  }

  /* ================= FETCH WITH AUTO LOGOUT ================= */
async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${session?.token}`,
    },
  });

  if (res.status === 401) {
    logout();
    return null;
  }

  return res;
}

  /* ================= AUTO SOCKET RECONNECT ================= */
  useEffect(() => {
    if (!session?.token) return;

    socket.auth = {
      token: session.token,
      userId: session.user._id,
      role: session.user.role,
    };

    socket.connect();

    return () => socket.disconnect();
  }, [session?.token]);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      login,
      logout,
      fetchWithAuth, 
      authHeader: session?.token
        ? { Authorization: `Bearer ${session.token}` }
        : {},
    }),
    [session]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
