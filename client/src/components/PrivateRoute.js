import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export const PrivateRoute = ({ children, ...rest }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};
