import { Routes, Route, BrowserRouter } from "react-router-dom";
import VitePage from "./pages/vite/page";
import NavBarComponent from "./components/navbar/navbar";
import AuthenComponent from "./components/auth";
import LoginPage from "./pages/auth/LoginPage/page";
import NotFoundPage from "./pages/not-found/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route element={<AuthenComponent />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

       
        <Route element={<NavBarComponent />}>
          <Route path="/" element={<VitePage />} />
          <Route path="/vite" element={<VitePage />} />
        </Route>

      
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
