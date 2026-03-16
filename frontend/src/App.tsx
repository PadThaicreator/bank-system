import { Routes, Route, BrowserRouter } from "react-router-dom";
import VitePage from "./pages/vite/page";
import NavBarComponent from "./components/navbar";
import AuthenComponent from "./components/auth";
import LoginPage from "./pages/auth/loginPage/page";

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
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
