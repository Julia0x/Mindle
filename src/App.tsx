import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ServerProvider } from './contexts/ServerContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import ServersPage from './pages/ServersPage';
import CreateServerPage from './pages/CreateServerPage';
import ServerDetailsPage from './pages/ServerDetailsPage';
import MindleBotPage from './pages/MindleBotPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ServerProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/servers" 
                element={
                  <ProtectedRoute>
                    <ServersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-server" 
                element={
                  <ProtectedRoute>
                    <CreateServerPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/server/:serverId" 
                element={
                  <ProtectedRoute>
                    <ServerDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mindle-bot" 
                element={
                  <ProtectedRoute>
                    <MindleBotPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </ServerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;