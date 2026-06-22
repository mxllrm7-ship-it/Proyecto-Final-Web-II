import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const getTokenExpiration = (tkn) => {
  try {
    const payload = JSON.parse(atob(tkn.split('.')[1]));
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") ?? null;
  });

  const logout = useCallback((expirado = false) => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
    if (expirado) {
      window.location.href = "/";
    }
  }, []);

  const login = (data, tkn) => {
    localStorage.setItem("usuario", JSON.stringify(data));
    localStorage.setItem("token", tkn);
    setUsuario(data);
    setToken(tkn);
  };

  useEffect(() => {
    if (!token) return;

    const expTime = getTokenExpiration(token);
    if (!expTime) return;

    const remaining = expTime - Date.now();

    if (remaining <= 0) {
      logout(true);
      return;
    }

    const timer = setTimeout(() => {
      logout(true);
    }, remaining);

    return () => clearTimeout(timer);
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}