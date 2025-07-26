import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Server, Plus, Settings, LogOut, Menu, X, User, CreditCard } from 'lucide-react';
import UserProfileModal from './UserProfileModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <div className="text-black font-semibold text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <>
      <div className="p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-8 lg:mb-10">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-black rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg lg:text-xl">M</span>
          </div>
          <div>
            <div className="text-black font-bold text-lg lg:text-xl tracking-tight">MINDLE</div>
            <div className="text-gray-500 text-[10px] lg:text-xs font-medium uppercase tracking-wide">Server Builder</div>
          </div>
        </div>

        <div className="space-y-2 mb-8 lg:mb-10">
          <h3 className="text-gray-500 text-[10px] lg:text-xs uppercase tracking-wider font-medium mb-3 lg:mb-4 px-2">Main Menu</h3>
          
          <button 
            onClick={() => {
              navigate('/dashboard');
              setShowMobileSidebar(false);
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 lg:py-3 rounded-lg font-semibold text-xs lg:text-sm transition-all duration-200 ${
              isActive('/dashboard') 
                ? 'bg-black text-white' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <Server className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="uppercase tracking-wide">Dashboard</span>
          </button>

          <button 
            onClick={() => {
              navigate('/servers');
              setShowMobileSidebar(false);
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 lg:py-3 rounded-lg font-semibold text-xs lg:text-sm transition-all duration-200 ${
              isActive('/servers') 
                ? 'bg-black text-white' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <Server className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="uppercase tracking-wide">My Servers</span>
          </button>

          <button 
            onClick={() => {
              navigate('/create-server');
              setShowMobileSidebar(false);
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 lg:py-3 rounded-lg font-semibold text-xs lg:text-sm transition-all duration-200 ${
              isActive('/create-server') 
                ? 'bg-black text-white' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="uppercase tracking-wide">Create Server</span>
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-gray-500 text-[10px] lg:text-xs uppercase tracking-wider font-medium mb-3 lg:mb-4 px-2">Account</h3>
          <button 
            onClick={() => {
              setShowProfileModal(true);
              setShowMobileSidebar(false);
            }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 lg:py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-200 font-medium text-xs lg:text-sm"
          >
            <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="uppercase tracking-wide">Settings</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 lg:py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium text-xs lg:text-sm"
          >
            <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="uppercase tracking-wide">Sign Out</span>
          </button>
        </div>
      </div>

      {/* User Profile at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 border-t border-gray-200 bg-gradient-to-t from-white/80 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
            <span className="text-black font-medium text-xs lg:text-sm">
              {userProfile.firstName[0]}{userProfile.lastName[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs lg:text-sm font-semibold text-black truncate uppercase tracking-wide">
              {userProfile.firstName} {userProfile.lastName}
            </div>
            <div className="text-[10px] lg:text-xs text-gray-500 truncate font-medium flex items-center">
              <CreditCard className="w-3 h-3 mr-1" />
              {userProfile.credits} credits
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${showMobileSidebar ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            showMobileSidebar ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setShowMobileSidebar(false)}
        />
        
        {/* Sidebar */}
        <div className={`absolute left-0 top-0 h-full w-72 bg-white border-r border-gray-200 transition-transform duration-300 ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="p-2 text-gray-500 hover:text-black rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 text-gray-500 hover:text-black rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-black font-bold tracking-tight">MINDLE</span>
          </div>
          <button 
            onClick={() => navigate('/create-server')}
            className="p-2 text-gray-500 hover:text-black rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen bg-white pt-16 lg:pt-0">
        {children}
      </div>

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;