import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useServers } from '../contexts/ServerContext';
import { useNavigate } from 'react-router-dom';
import { Server, Plus, Eye, TrendingUp, Calendar, Users, Clock, Activity, CreditCard } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { servers, loading } = useServers();
  const navigate = useNavigate();

  if (!userProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <div className="text-black font-semibold text-lg">Loading...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 lg:mb-12">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-black mb-1 lg:mb-2 tracking-tight">
                Welcome back, {userProfile.firstName}
              </h1>
              <p className="text-gray-600 text-sm lg:text-lg font-medium">
                Here's what's happening with your servers today.
              </p>
            </div>
            <button 
              onClick={() => navigate('/create-server')}
              className="w-full sm:w-auto bg-black text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 text-xs lg:text-sm shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Create Server
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6 mb-8 lg:mb-12">
            <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-gray-600 text-[10px] lg:text-xs font-medium uppercase tracking-wide">Total Servers</h3>
                <Server className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-black mb-1 lg:mb-2">{servers.length}</div>
              <div className="text-green-600 text-[10px] lg:text-xs flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                {servers.length > 0 ? `+${servers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length} this week` : 'Create first server'}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-gray-600 text-[10px] lg:text-xs font-medium uppercase tracking-wide">Credits</h3>
                <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-black mb-1 lg:mb-2">{userProfile.credits}</div>
              <div className="text-gray-600 text-[10px] lg:text-xs font-medium uppercase tracking-wide">
                {userProfile.isPro ? 'Pro Plan' : 'Free Plan'}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-gray-600 text-[10px] lg:text-xs font-medium uppercase tracking-wide">Account</h3>
                <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${userProfile.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              </div>
              <div className="text-sm lg:text-lg font-semibold text-black mb-1 uppercase tracking-wide">
                {userProfile.verified ? 'Verified' : 'Unverified'}
              </div>
              <div className="text-gray-600 text-[10px] lg:text-xs font-medium uppercase tracking-wide">
                {userProfile.isAdmin ? 'Admin' : userProfile.isPro ? 'Pro User' : 'Standard'}
              </div>
            </div>
          </div>

          {/* Recent Servers and Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div className="flex items-center">
                    <Server className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 mr-2 lg:mr-3" />
                    <h2 className="text-lg lg:text-xl font-semibold text-black uppercase tracking-wide">Your Servers</h2>
                  </div>
                  <button 
                    onClick={() => navigate('/servers')}
                    className="text-gray-500 hover:text-black text-xs lg:text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-3 h-3" />
                    View All
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : servers.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {servers.slice(0, 5).map((server) => (
                      <div
                        key={server.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300 group gap-3"
                      >
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm lg:text-base">
                              {server.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-black text-xs lg:text-sm uppercase tracking-wide truncate">{server.name}</h3>
                            <div className="flex items-center space-x-3 mt-0.5 lg:mt-1">
                              <p className="text-[10px] lg:text-xs text-gray-600 font-medium flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {server.channelCount} channels
                              </p>
                              <p className="text-[10px] lg:text-xs text-gray-600 font-medium flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(server.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-2 lg:space-x-3">
                          <span className="inline-flex items-center px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[10px] lg:text-xs font-medium bg-green-100 text-green-800 uppercase tracking-wide">
                            <Activity className="w-3 h-3 mr-1" />
                            Ready
                          </span>
                          <button 
                            onClick={() => navigate(`/server/${server.id}`)}
                            className="p-1.5 lg:p-2 text-gray-500 hover:text-black hover:bg-white rounded-lg transition-all duration-200"
                          >
                            <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {servers.length > 5 && (
                      <button 
                        onClick={() => navigate('/servers')}
                        className="w-full p-3 lg:p-4 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium text-xs lg:text-sm uppercase tracking-wide border border-gray-200"
                      >
                        View All {servers.length} Servers
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <Server className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2 uppercase tracking-wide">No Servers Yet</h3>
                    <p className="text-gray-600 text-sm mb-6 font-medium">Create your first AI-generated Discord server to get started!</p>
                    <button 
                      onClick={() => navigate('/create-server')}
                      className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wide gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Your First Server
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <div className="flex items-center mb-4 lg:mb-6">
                  <Server className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 mr-2 lg:mr-3" />
                  <h2 className="text-lg lg:text-xl font-semibold text-black uppercase tracking-wide">Quick Actions</h2>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <button 
                    onClick={() => navigate('/create-server')}
                    className="w-full flex items-center space-x-3 p-3 lg:p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-300 font-medium text-xs lg:text-sm group border border-gray-200"
                  >
                    <div className="p-1 rounded bg-gray-200 group-hover:bg-gray-300 transition-colors">
                      <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                    </div>
                    <span className="uppercase tracking-wide">Create New Server</span>
                  </button>
                  <button 
                    onClick={() => navigate('/servers')}
                    className="w-full flex items-center space-x-3 p-3 lg:p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-300 font-medium text-xs lg:text-sm group border border-gray-200"
                  >
                    <div className="p-1 rounded bg-gray-200 group-hover:bg-gray-300 transition-colors">
                      <Server className="w-3 h-3 lg:w-4 lg:h-4" />
                    </div>
                    <span className="uppercase tracking-wide">View My Servers</span>
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
                  <h3 className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide mb-3 lg:mb-4">Recent Activity</h3>
                  {servers.length > 0 ? (
                    <div className="space-y-2 lg:space-y-3">
                      {servers.slice(0, 3).map((server) => (
                        <div key={server.id} className="flex items-center space-x-2 lg:space-x-3 text-[10px] lg:text-xs">
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-black rounded-full"></div>
                          <span className="text-gray-600">"{server.name}" created</span>
                          <span className="text-gray-500">
                            {new Date(server.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-gray-400 text-xs font-medium mb-2">No activity yet</div>
                      <p className="text-gray-300 text-[10px]">Create a server to see activity here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;