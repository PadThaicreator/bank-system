import { Routes, Route, BrowserRouter } from "react-router-dom";
import AuthenComponent from "./components/auth";
import LoginPage from "./pages/auth/LoginPage/page";
import AccountListPage from "./pages/account/AccountListPage/AccountListPage";
import NotFoundPage from "./pages/not-found/page";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import NavBarComponent from "./components/layout/NavbarComponent";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import HistoryTransactionPage from "./pages/transactions/history/page";
import TransactionPage from "./pages/transactions/transaction/page";
import AccountDetailPage from "./pages/account/AccountDetailPage/AccountDetailPage";
import AdminRoute from "./middleware/AdminRoute";
import AccountOpeningPage from "./pages/account/AccountOpeningPage/AccountOpeningPage";
import UserListPage from "./pages/admin/UserMangement/userListPage";
import UserDetailPage from "./pages/admin/UserMangement/userDetailPage";
// import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import DashboardPage from "./pages/account/DashboardPage/DashboardPage";
import ProfilePage from "./pages/profile/ProfilePage/page";
import RequestListPage from "./pages/admin/RequestMangement/requestListPage";
import StockListPage from "./pages/stocks/StockListPage/page";
import StockDetailPage from "./pages/stocks/StockDetailPage/page";
import MyPortfolioPage from "./pages/portfolio/MyPortfolioPage/page";
import PortfolioDetailPage from "./pages/portfolio/PortfolioDetailPage/page";
import PortfolioRequestManagementPage from "./pages/admin/PortfolioRequestManagement/page";
import OrderManagementPage from "./pages/admin/OrderManagement/page";
import AdminAccountListPage from "./pages/admin/AccountManagement/AccountListPage";
import HomeRedirect from "./components/layout/HomeRedirect";

function App() {

  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            
            {/* Authen Route */}
            <Route element={<AuthenComponent />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]} />}>
              <Route element={<NavBarComponent />}>
                <Route element={<AdminRoute />}>
                  <Route path="/admin/accountList" element={<AdminAccountListPage />} />
                  <Route path="/admin/userList" element={<UserListPage />} />
                  <Route path="/admin/userDetail/:userId" element={<UserDetailPage />} />
                  {/* <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> */}
                  <Route path="/admin/requestList" element={<RequestListPage />} />
                  <Route path="/admin/portfolio-requests" element={<PortfolioRequestManagementPage />} />
                  <Route path="/admin/orders" element={<OrderManagementPage />} />
                </Route>
                
                <Route path="/account/open" element={<AccountOpeningPage />} />
                <Route path="/account/list" element={<AccountListPage />} />
                <Route path="/account/detail/:accountId" element={<AccountDetailPage />} />
                <Route path="/transaction/history" element={<HistoryTransactionPage />} />
                <Route path="/transaction/service" element={<TransactionPage />} />
                {/* <Route path="/home" element={<HomePage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} /> */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Stocks */}
                <Route path="/stocks/list" element={<StockListPage />} />
                <Route path="/stocks/:symbol" element={<StockDetailPage />} />

                {/* Portfolio */}
                <Route path="/portfolio/my" element={<MyPortfolioPage />} />
                <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
              
                <Route path="/home" element={<HomeRedirect />} />
                <Route path="/" element={<HomeRedirect />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;