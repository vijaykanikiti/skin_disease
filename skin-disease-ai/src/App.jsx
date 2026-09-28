import React from "react";
import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Result from "./pages/Result";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";


import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";


import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";


function AppContent() {
  const location = useLocation();

  const dashboardPages = [
    "/dashboard",
    "/analyze",
    "/result",
    "/history",
    "/profile",
    "/admin"
  ];

  const hideNavbar = dashboardPages.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

<Route path="/terms" element={<Terms />} />

<Route path="/privacy" element={<Privacy />} />

<Route path="/disclaimer" element={<Disclaimer />} />

        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/verify-otp"
  element={<VerifyOtp />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

        <Route path="/register" element={<Register />} />

        {/* User Pages */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/analyze" element={<Analyze />} />

        <Route path="/result" element={<Result />} />

        <Route path="/history" element={<History />} />

        <Route path="/profile" element={<Profile />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;