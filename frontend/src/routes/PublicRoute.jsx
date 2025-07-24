import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PublicRoute = ({ children }) => {
  const authUser = useAuthStore((state) => state.authUser);
  return !authUser ? children : <Navigate to="/" />;
};

export default PublicRoute;
