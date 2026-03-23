/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../../services/authService";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      
      if (res.success && res.data) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token,
          })
        );
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      } else {
        // Handle cases where the server returns { success: false } but doesn't throw HTTP error
        setError(res.message || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-lg text-sm text-center border border-red-100 flex items-center justify-center">
            {error}
          </div>
        )}

        <form onSubmit={onLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white text-gray-900 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
