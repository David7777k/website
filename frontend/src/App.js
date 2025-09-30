import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./components/NotificationSystem";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdvancedAnalytics from "./components/AdvancedAnalytics";
import ReferralSystem from "./components/ReferralSystem";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff/dashboard" 
                element={
                  <ProtectedRoute>
                    <StaffDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <AdvancedAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/referrals" 
                element={
                  <ProtectedRoute>
                    <ReferralSystem />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </div>
  );
}

export default App;