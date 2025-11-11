// frontend/src/App.tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext';
import { ChatProvider } from './components/contexts/ChatContext';

// Import all pages
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import TherapistManagement from './pages/TherapistManagement';
import PaymentManagement from './pages/PaymentManagement';
import UserManagement from './pages/UserManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import LiveTracking from './pages/LiveTracking';
import BookingManagement from './pages/BookingManagement';
import ServiceManagement from './pages/ServiceManagement';
import CommunicationCenter from './pages/CommunicationCentre';
import PromotionManagement from './pages/PromotionManagement';
import SupportCenter from './pages/SupportCenter';
import TherapistOnboarding from './pages/TherapistOnboarding';
import LoyaltyManagement from './pages/LoyaltyManagement';
import TherapistTargets from './components/therapist-targets';
import LandingPage from './pages/LandingPage';
import GeofencingPage from './pages/Geofencing';
import Security from './pages/Security';

const App: React.FC = () => {
  return (                   
    <Router>
      <AuthProvider>
        <ChatProvider>
          <div className="min-h-screen bg-[#F9FDFF]">
            {/* Only show Header/Footer on authenticated routes */}
            <Routes>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/*" element={
                <>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/analytics" element={<AnalyticsDashboard />} />
                      
                       <Route path="/geofencing" element={<GeofencingPage />} /> 
                      {/* Therapy Operations */}
                      <Route path="/therapists" element={<TherapistManagement />} />
                      <Route path="/therapists/onboarding" element={<TherapistOnboarding />} />
                      <Route path="/targets" element={<TherapistTargets />} />
                      <Route path="/services" element={<ServiceManagement />} />
                      <Route path="/bookings" element={<BookingManagement />} />
                      <Route path="/live-tracking" element={<LiveTracking />} />
                      
                      {/* Patient Care */}
                      <Route path="/users" element={<UserManagement />} />
                      <Route path="/communication" element={<CommunicationCenter />} />
                      <Route path="/support" element={<SupportCenter />} />
                      
                      {/* Financial */}
                      <Route path="/payments" element={<PaymentManagement />} />
                      <Route path="/loyalty" element={<LoyaltyManagement />} />
                      <Route path="/promotions" element={<PromotionManagement />} />
                      
                      {/* Security */}
                      <Route path="/security" element={<Security  />} />
                      
                      {/* Catch all route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;