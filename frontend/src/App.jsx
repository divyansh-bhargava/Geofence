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
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route path="/geofence" element={<ProtectedRoute><GeoFence /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        <Route path="/alert-history" element={<ProtectedRoute><AlertHistory /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/" element={<LandingPage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
    </SidebarProvider>
  );
}

export default App;
