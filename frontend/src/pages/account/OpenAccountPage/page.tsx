import { useState } from "react";
import { useSelector } from "react-redux";
import { accountService } from "../../../services/accountService";
import type { RootState } from "../../../redux/store";
import { Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OpenAccountPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [accountType, setAccountType] = useState("SAVINGS");
  const [initialDeposit, setInitialDeposit] = useState("500");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!user.userId && !(user as any).id)) return;
    const uid = user.userId || (user as any).id;
    
    setError("");
    setLoading(true);
    
    try {
      const res: any = await accountService.createAccount(uid, { 
          accountType: accountType as any, 
          initialDeposit: Number(initialDeposit) 
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setError(res.message || "Failed to open account");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
      return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm text-center border border-green-100">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Opened!</h2>
            <p className="text-gray-500">Your new account is ready. Redirecting you to home...</p>
        </div>
      );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet className="h-6 w-6" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Open Account</h2>
            <p className="text-sm text-gray-500">Create a new Savings or Current account</p>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-6 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
              <option value="SAVINGS">Savings Account (ออมทรัพย์)</option>
              <option value="CURRENT_PERSONAL">Current Account - Personal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Deposit Amount (THB)</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">฿</span>
             </div>
             <input
               type="number"
               min={0}
               required
               value={initialDeposit}
               onChange={(e) => setInitialDeposit(e.target.value)}
               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
             />
          </div>
          <p className="mt-2 text-xs text-gray-500">Suggested initial deposit: 500 THB</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3.5 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
          Create Account
        </button>
      </form>
    </div>
  );
}
