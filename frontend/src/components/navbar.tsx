import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function NavBarComponent() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (!token) {
      
      navigate("/login");
    // }
  });


  return (
    <div>
      <div>Navbar</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
