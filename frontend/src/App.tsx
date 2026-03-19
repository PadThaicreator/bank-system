import { Routes, Route, BrowserRouter } from "react-router-dom";
import VitePage from "./pages/vite/page";
// import NavBarComponent from "./components/layout/CustomerNavbar";
import AuthenComponent from "./components/auth";
import LoginPage from "./pages/auth/LoginPage/page";
import NotFoundPage from "./pages/not-found/page";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import AllNavBar from "./components/navbar/navbar";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthenComponent />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<AllNavBar />}>
              <Route path="/vite" element={<VitePage />} />
              <Route path="/vite" element={<VitePage />} />
            </Route>

            {/* <Route element={<AllNavBar />}>
              <Route path="/vite" element={<VitePage />} />
              <Route path="/vite" element={<VitePage />} />
            </Route> */}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
