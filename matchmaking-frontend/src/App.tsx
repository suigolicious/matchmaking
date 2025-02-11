import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import QuestionsPage from './pages/QuestionsPage.tsx';

// Utility function to check authentication
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');  // Check if token exists
};

// Utility function to check if profile is complete
const isProfileComplete = (): boolean => {
  return localStorage.getItem('profileComplete') === 'true';
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/'); // Redirect to home if not logged in
    }
  }, []);

  return <>{children}</>;
};

// Profile Route Wrapper (Ensures Profile is Complete)
const ProfileProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/'); // Redirect to home if not logged in
    } else if (!isProfileComplete()) {
      navigate('/profile'); // Redirect to profile if incomplete
    }
  }, []);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/questions" element={
          <ProfileProtectedRoute>
            <QuestionsPage />
          </ProfileProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
      </Routes>
    </Router>
  );
};

export default App;
