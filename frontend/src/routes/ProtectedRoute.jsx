import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const authUser = useAuthStore((state) => state.authUser);
  return authUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
