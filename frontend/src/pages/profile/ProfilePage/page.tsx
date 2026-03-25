import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../redux/authSlice";
import { authService } from "../../../services/authService";
import type { UpdateProfileRequest } from "../../../services/authService";
import type { RootState } from "../../../redux/store";
import { User, Phone, Loader2, Save } from "lucide-react";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    fullName: user?.fullName || "",
    phone: (user as any)?.phone || "", 
    birthDate: user?.birthDate || "",
    gender: user?.gender || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res: any = await authService.getProfile();
      if (res.success && res.data) {
        setFormData({ 
          fullName: res.data.fullName, 
          phone: res.data.phone,
          birthDate: res.data.birthDate || "",
          gender: res.data.gender || ""
        });
        dispatch(loginSuccess({ user: res.data, token: token as string }));
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to load profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setSaving(true);

    try {
      const res: any = await authService.updateProfile(formData);
      if (res.success && res.data) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        dispatch(loginSuccess({ user: res.data, token: token as string }));
      } else {
        setMessage({ text: res.message || "Failed to update profile", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={onSave} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="text"
               required
               value={formData.fullName}
               onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="tel"
               required
               value={formData.phone}
               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              required
              value={formData.birthDate || ""}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <select
              required
              value={formData.gender || ""}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address (Read-only)</label>
          <input
            type="email"
            disabled
            value={user?.email || ""}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
