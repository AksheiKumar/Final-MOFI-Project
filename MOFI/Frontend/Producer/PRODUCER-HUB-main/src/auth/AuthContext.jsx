import { createContext, useContext, useState, useEffect } from "react";
import api, { setApiAccessToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAccessToken = (token) => {
    setAccessTokenState(token);
    setApiAccessToken(token);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    setAccessToken(null);
    setUser(null);
    setApiAccessToken(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const r = await api.post("/refresh");
        setAccessToken(r.data.access);

        const me = await api.get("/me");
        setUser(me.data);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
