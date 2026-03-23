import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";




export default function AdminRoute() {
  const user = useSelector(
    (state: RootState) => state.auth
  );

  if(user.isAuthenticated){
    if(user.user?.role === "ADMIN"){
      return <Outlet />;
    }else{
      return <Navigate to="/home" replace />;
    }

  }
 
  
  return <Navigate to="/login" replace />;
  
}