import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogin = () => {
    
    dispatch(
      loginSuccess({
        user: {
          fullName: "JOHN DOE",
          email: "example@gmail.com",
          role: "CUSTOMER",
        },
        token: "TOKEN",
      }),
    );
    localStorage.setItem("token" , "TOKEN");

    navigate("/vite");
  };
  return (
  <div>
    Login Page
    <button className="btn btn-primary"  onClick={onLogin}>Login</button>
  </div>);
}
