import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import HomePage from "./pages/home/page";
// import NavBarComponent from "./components/layout/CustomerNavbar";
import AuthenComponent from "./components/auth";
import LoginPage from "./pages/auth/LoginPage/page";
import AccountListPage from "./pages/account/Account/AccountListPage";
import NotFoundPage from "./pages/not-found/page";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import NavBarComponent from "./components/layout/NavbarComponent";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import HistoryTransactionPage from "./pages/transactions/history/page";
import TransactionPage from "./pages/transactions/transaction/page";
import AccountDetailPage from "./pages/account/Account/AccountDetailPage";
import AdminRoute from "./middleware/AdminRoute";
import AccountOpeningPage from "./pages/account/Account/AccountOpeningPage";
import UserListPage from "./pages/admin/UserMangement/userListPage";
import UserDetailPage from "./pages/admin/UserMangement/userDetailPage";
import { useEffect } from "react";



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
                  <Route path="/admin/accountList" element={<AccountListPage />} />
                  <Route path="/admin/accountDetail/:accountId" element={<AccountDetailPage />} />
                  <Route path="/admin/userList" element={<UserListPage />} />
                  <Route path="/admin/userDetail/:userId" element={<UserDetailPage />} />
                </Route>
                
                <Route path="/account/open" element={<AccountOpeningPage />} />
                <Route path="/transaction/history" element={<HistoryTransactionPage />} />
                <Route path="/transaction/service" element={<TransactionPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/" element={<HomePage />} />
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
