import { useAppSelector } from "@store/hooks";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  console.log(user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    alert("You are not authorized to access this page");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
