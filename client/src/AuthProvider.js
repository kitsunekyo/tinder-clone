import {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { CONFIG } from "./config";
import { fetchApi } from "./utils/api";

export const authContext = createContext({
  user: [],
  setUser: (user) => {},
  logout: () => {},
  login: (email, password, isSignUp) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

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
    await fetchApi(`/logout`, {
      method: "post",
    });
    setUser(null);
  };

  const login = async (email, password, isSignUp = false) => {
    const path = isSignUp ? "/signup" : "/login";

    const response = await fetchApi(path, {
      method: "post",
      body: { email, password },
    });

    const success = response.status === 201;

    if (success) {
      getUser();
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
