import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hva_user")) || null; } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("hva_user", JSON.stringify(user));
    else localStorage.removeItem("hva_user");
  }, [user]);

  const login = (payload) => setUser(payload);              // {role:"admin"|"patient"|"doctor", email, name}
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
