import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Register from './components/Register.js';
import Dashboard from './components/Dashboard';
import Subscriptions from './components/Subscriptions';
import AddSubscription from './components/AddSubscription';
import Forecast from './components/Forecast';
import Alerts from './components/Alerts';
import Categories from './components/Categories';
import Settings from './components/Settings';
import SubscriptionDetails from './components/SubscriptionDetails';
import PasswordReset from './components/PasswordReset';
import NotFound from './components/NotFound';
import './App.css';

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
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/subscriptions" element={
                <ProtectedRoute>
                  <Subscriptions />
                </ProtectedRoute>
              } />
              <Route path="/add" element={
                <ProtectedRoute>
                  <AddSubscription />
                </ProtectedRoute>
              } />
              <Route path="/forecast" element={
                <ProtectedRoute>
                  <Forecast />
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/subscription/:id" element={
                <ProtectedRoute>
                  <SubscriptionDetails />
                </ProtectedRoute>
              } />
              <Route path="/forgot-password" element={<PasswordReset />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;