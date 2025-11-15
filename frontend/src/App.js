import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Register from './components/Register.js';
import Dashboard from './components/Dashboard';
import AddSubscription from './components/AddSubscription';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            {/* Default route redirects to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Login page */}
            <Route path="/login" element={<Login />} />
            
            {/* Register page */}
            <Route path="/register" element={<Register />} />
            
            {/* Protected Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Protected Add Subscription */}
            <Route path="/add" element={
              <ProtectedRoute>
                <AddSubscription />
              </ProtectedRoute>
            } />
            
            {/* Placeholder routes for future pages */}
            <Route path="/forgot-password" element={<div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-400 flex items-center justify-center text-white text-xl">Forgot Password Page - Coming Soon</div>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
