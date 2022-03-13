import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CONFIG } from "./config";

export const authContext = createContext({
  user: [],
  setUser: (user) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(`${CONFIG.apiUrl}/me`, {
          credentials: "include",
        });
        if (res.status !== 200) {
          console.log("User is not logged in");
          navigate("/");
          return;
        }

        const data = await res.json();
        if (data) {
          console.log("User is logged in");
          setUser(data);
          return;
        }
      } catch (e) {
        console.log(e);
      }
    }
    getUser();
  }, [navigate]);

  const logout = async () => {
    await fetch(`${CONFIG.apiUrl}/logout`, {
      method: "post",
      credentials: "include",
    });
    setUser(null);
    navigate("/");
  };

  return (
    <authContext.Provider value={{ user, logout, setUser }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
