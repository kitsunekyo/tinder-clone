import {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { CONFIG } from "./config";

export const authContext = createContext({
  user: [],
  setUser: (user) => {},
  logout: () => {},
  login: (email, password, isSignUp) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const getUser = useCallback(async () => {
    try {
      const res = await fetch(`${CONFIG.apiUrl}/me`, {
        credentials: "include",
      });
      if (res.status !== 200) {
        setLoaded(true);
        setUser(null);
        return;
      }

      const data = await res.json();
      if (data) {
        setUser(data);
        setLoaded(true);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const logout = async () => {
    await fetch(`${CONFIG.apiUrl}/logout`, {
      method: "post",
      credentials: "include",
    });
    setUser(null);
    navigate("/");
  };

  const login = async (email, password, isSignUp = false) => {
    const path = isSignUp ? "/signup" : "/login";

    const response = await fetch(`${CONFIG.apiUrl}${path}`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });
    const success = response.status === 201;

    if (success) {
      getUser();
      return;
    }
  };

  if (!loaded) {
    return <p>loading...</p>;
  }

  return (
    <authContext.Provider value={{ user, logout, login, setUser }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
