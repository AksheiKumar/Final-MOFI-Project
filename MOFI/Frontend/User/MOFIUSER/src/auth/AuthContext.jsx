import { createContext, useContext, useEffect, useState } from "react";
import api, { setApiAccessToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= RESTORE SESSION ================= */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // GOOGLE CALLBACK
        const params = new URLSearchParams(window.location.search);
        const googleAccess = params.get("access");

        if (googleAccess) {
          setAccessToken(googleAccess);
          setApiAccessToken(googleAccess);

          const me = await api.get("/me");
          setUser(me.data);

          window.history.replaceState({}, "", "/");
          setLoading(false);
          return;
        }


        const r = await api.post("/refresh");
        setAccessToken(r.data.access);
        setApiAccessToken(r.data.access);

        const me = await api.get("/me");
        setUser(me.data);
      } catch {
        setUser(null);
        setAccessToken(null);
        setApiAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /* ================= LOGIN ================= */
  const login = (token, userData) => {
    setAccessToken(token);
    setApiAccessToken(token);
    setUser(userData);
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    setUser(null);
    setAccessToken(null);
    setApiAccessToken(null);
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoggedIn: !!accessToken,
        loading,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
