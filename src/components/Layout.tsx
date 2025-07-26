import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">M</span>
              </div>
              <span className="text-white font-black text-2xl tracking-tight">MINDLE</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {currentUser ? (
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-white/80 transition-colors font-medium uppercase tracking-wide"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-white hover:text-white/80 transition-colors font-medium uppercase tracking-wide"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors uppercase tracking-wide"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;