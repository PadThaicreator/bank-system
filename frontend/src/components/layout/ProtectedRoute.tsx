import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useSelector(
    (state: RootState) => state.auth
  );

  if(user.isAuthenticated){
    if(allowedRoles?.includes(user.user?.role || "")){
      return <Outlet />;
    }else{
      return <Navigate to="/login" replace />;
    }

  }
 
  
  return <Navigate to="/login" replace />;
  
}