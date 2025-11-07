// frontend/src/App.tsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext';
import { ChatProvider } from './components/contexts/ChatContext';
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
import SecurityDashboard from './pages/SecurityDashboard';                                                                                                  
import TherapistTargets from './components/therapist-targets';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (                   
    <Router>
      <AuthProvider>
        <ChatProvider>
          <div className="min-h-screen bg-gray-50">
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
                      <Route path="/therapists" element={<TherapistManagement />} />
                      <Route path="/therapists/onboarding" element={<TherapistOnboarding />} />
                      <Route path="/payments" element={<PaymentManagement />} />
                      <Route path="/users" element={<UserManagement />} />
                      <Route path="/analytics" element={<AnalyticsDashboard />} />
                      <Route path="/live-tracking" element={<LiveTracking />} />
                      <Route path="/bookings" element={<BookingManagement />} />
                      <Route path="/services" element={<ServiceManagement />} />
                      <Route path="/communication" element={<CommunicationCenter />} />
                      <Route path="/promotions" element={<PromotionManagement />} />
                      <Route path="/support" element={<SupportCenter />} />
                      <Route path="/loyalty" element={<LoyaltyManagement />} />
                      <Route path="/security" element={<SecurityDashboard />} />
                      <Route path="/targets" element={<TherapistTargets />} />
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