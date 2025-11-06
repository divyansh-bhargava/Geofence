import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import GeoFence from "./pages/Geofence";
import Contacts from "./pages/Contacts";
import AlertHistory from "./pages/AlertHistory";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <SidebarProvider>
    <Router>
      <Routes>
        {/* Default route → go to login */}
        {/* <Route path="/" element={<Navigate to="/" replace />} /> */}

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main App pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/geofence" element={<GeoFence />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/alert-history" element={<AlertHistory />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<LandingPage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
    </SidebarProvider>
  );
}

export default App;
