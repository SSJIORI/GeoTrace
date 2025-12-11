import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
