import { Routes, Route, BrowserRouter } from "react-router-dom";
import VitePage from "./pages/vite/page";
import NavBarComponent from "./components/layout/CustomerNavbar";
import AuthenComponent from "./components/auth";
import LoginPage from "./pages/auth/LoginPage/page";
import AccountListPage from "./pages/account/Account/AccountListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthenComponent />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>

      <Routes>
        <Route element={<NavBarComponent />}>
          <Route path="/vite" element={<VitePage />} />
          <Route path="/vite" element={<VitePage />} />
        </Route>
      </Routes>
      
      <Routes>
        <Route element={<NavBarComponent />}>
          <Route path="/accountList" element={<AccountListPage />} />
          <Route path="/vite" element={<VitePage />} />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
