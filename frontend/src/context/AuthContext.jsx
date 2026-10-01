import { createContext, useContext, useEffect, useState } from "react";
import { api, setToken, clearToken } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mh_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function register(body) {
    const data = await api.register(body);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function login(body) {
    const data = await api.login(body);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
