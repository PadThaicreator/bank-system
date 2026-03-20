import { Routes, Route, BrowserRouter } from "react-router-dom";
import VitePage from "./pages/vite/page";
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

            <Route element={<ProtectedRoute />}>
              <Route element={<NavBarComponent />}>
                <Route path="/admin/accountList" element={<AccountListPage />} />
                <Route path="/vite" element={<VitePage />} />
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
