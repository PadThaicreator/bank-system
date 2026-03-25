import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import AdminDashboardPage from "../../pages/dashboard/AdminDashboardPage/AdminDashboardPage";
import DashboardPage from "../../pages/dashboard/DashboardPage/DashboardPage";

export default function HomeRedirect() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (user?.role === "ADMIN") {
    return <AdminDashboardPage />;
  }

  return <DashboardPage />;
}
