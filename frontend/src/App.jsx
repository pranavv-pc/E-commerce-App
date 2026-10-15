import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import EcommerceDashboard from './components/EcommerceDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lumina_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('lumina_current_user');
    return saved ? 'dashboard' : 'auth';
  });

  // Handle successful login or registration
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('lumina_current_user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('lumina_current_user');
    setCurrentUser(null);
    setCurrentView('auth');
  };

  return (
    <div className="app-container">
      {currentView === 'auth' || !currentUser ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <EcommerceDashboard 
          user={currentUser} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}
