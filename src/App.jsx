import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { IdeaProvider } from './context/IdeaContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import HeroLanding from './pages/HeroLanding';
import ModeSelection from './pages/ModeSelection';
import IdeaInput from './pages/IdeaInput';
import AIProcessing from './pages/AIProcessing';
import ResultsDashboard from './pages/ResultsDashboard';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage'; // You will create this for Sign In/Up

// Helper Component for Protected Routes
// Redirects to /auth if user is not logged in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; 
  return user ? children : <Navigate to="/auth" />;
};

// Component to handle Page Transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<HeroLanding />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes (Must be logged in to use AI) */}
        <Route 
          path="/mode" 
          element={
            <ProtectedRoute>
              <ModeSelection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/input" 
          element={
            <ProtectedRoute>
              <IdeaInput />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/processing" 
          element={
            <ProtectedRoute>
              <AIProcessing />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <ResultsDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <IdeaProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
            <Navbar />
            <AnimatedRoutes />
          </div>
        </Router>
      </IdeaProvider>
    </AuthProvider>
  );
}