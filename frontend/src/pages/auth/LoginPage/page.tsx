import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import btnStyle from "../../../css/button.module.css"
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogin = () => {
    
    dispatch(
      loginSuccess({
        user: {
          fullName: "JOHN DOE",
          email: "example@gmail.com",
          role: "ADMIN",
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
    <button className={`${btnStyle.btn} ${btnStyle["btn-primary"]}`}  onClick={onLogin}>Login</button>
  </div>);
}
