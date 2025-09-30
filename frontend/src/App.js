import React from "react";
import "./App.css";
import "./styles/lounge-theme.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./components/NotificationSystem";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdvancedAnalytics from "./components/AdvancedAnalytics";
import ReferralSystem from "./components/ReferralSystem";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNavigation from "./components/layout/BottomNavigation";
import FloatingDock from "./components/layout/FloatingDock";

// Layout wrapper for main app pages
function AppLayout({ children }) {
  const location = useLocation();
  
  // Don't show navigation on admin/login pages
  const hideNavigation = location.pathname.includes('/admin') || location.pathname.includes('/login');
  
  return (
    <div className="app-layout">
      {children}
      {!hideNavigation && (
        <>
          <BottomNavigation />
          <FloatingDock />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/menu" element={<div>Menu Page - Coming Soon</div>} />
                <Route path="/music" element={<div>Music Page - Coming Soon</div>} />
                <Route path="/profile" element={<div>Profile Page - Coming Soon</div>} />
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
            </AppLayout>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </div>
  );
}

export default App;