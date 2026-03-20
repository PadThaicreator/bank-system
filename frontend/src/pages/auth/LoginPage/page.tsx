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
          userId : "46577fab-26f2-41ac-a7b8-d7b2515d53e1"
        },
        token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjNTE3ZDI3Ni04NDE3LTQ4MTYtOWJlYi03OWZhNTY0OGQzNDMiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzQwMjIwOTIsImV4cCI6MTc3NDYyNjg5Mn0.eYFIKJBHi0qFQQ9MXncPi4V-rvn-cUUr0tzVG7JW6lQ",
      }),
    );
    localStorage.setItem("token" , "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjNTE3ZDI3Ni04NDE3LTQ4MTYtOWJlYi03OWZhNTY0OGQzNDMiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzQwMjIwOTIsImV4cCI6MTc3NDYyNjg5Mn0.eYFIKJBHi0qFQQ9MXncPi4V-rvn-cUUr0tzVG7JW6lQ");

    navigate("/vite");
  };
  return (
  <div>
    Login Page
    <button className={`${btnStyle.btn} ${btnStyle["btn-primary"]}`}  onClick={onLogin}>Login</button>
  </div>);
}
