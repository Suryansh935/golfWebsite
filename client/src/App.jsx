import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import SubscribePage from "./pages/Subscribe";
import AdminPanel from "./pages/AdminPanel";
import HowItWorks from "./pages/HowItWorks";
import Charities from "./pages/Charities";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { loading } = useContext(AuthContext);

  // Prevent "Flash of Login Page" on reload
  if (loading) {
    return null; // Or a global full-screen loader
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/charities" element={<Charities />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscribe"
          element={
            <ProtectedRoute>
              <SubscribePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 