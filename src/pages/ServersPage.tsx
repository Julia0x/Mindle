import React, { useState } from 'react';
import { useServers } from '../contexts/ServerContext';
import { useNavigate } from 'react-router-dom';
import { Server, Plus, Eye, Calendar, Users, Settings, Trash2, Search, Filter } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const ServersPage: React.FC = () => {
  const { servers, loading, deleteServer } = useServers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'channels'>('created');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredServers = servers
    .filter(server => 
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'channels':
          return b.channelCount - a.channelCount;
        default:
          return 0;
      }
    });

  const handleDelete = async (serverId: string) => {
    await deleteServer(serverId);
    setDeleteConfirm(null);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-black mb-1 lg:mb-2 tracking-tight">
                My Servers
              </h1>
              <p className="text-gray-600 text-sm lg:text-lg font-medium">
                Manage all your Discord servers in one place.
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

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search servers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'created' | 'channels')}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white"
              >
                <option value="created">Sort by Created</option>
                <option value="name">Sort by Name</option>
                <option value="channels">Sort by Channels</option>
              </select>
            </div>
          </div>

          {/* Server Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-black mb-2">{servers.length}</div>
              <div className="text-gray-600 uppercase tracking-wide text-sm font-medium">Total Servers</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-black mb-2">
                {servers.reduce((total, server) => total + server.channelCount, 0)}
              </div>
              <div className="text-gray-600 uppercase tracking-wide text-sm font-medium">Total Channels</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-black mb-2">
                {servers.reduce((total, server) => total + server.memberCount, 0)}
              </div>
              <div className="text-gray-600 uppercase tracking-wide text-sm font-medium">Total Members</div>
            </div>
          </div>

          {/* Servers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServers.map((server) => (
                <div
                  key={server.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Server Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">
                        {server.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-black text-lg truncate">{server.name}</h3>
                      <p className="text-gray-600 text-sm truncate">{server.purpose}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/server/${server.id}`)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(server.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Server"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Server Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{server.description}</p>

                  {/* Server Stats */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{server.memberCount} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Server className="w-4 h-4" />
                      <span>{server.channelCount} channels</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(server.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {server.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                    {(server.tags?.length || 0) > 3 && (
                      <span className="text-gray-500 text-xs">+{(server.tags?.length || 0) - 3} more</span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/server/${server.id}`)}
                    className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                  >
                    View Server Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Server className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                {searchTerm ? 'No servers found' : 'No servers yet'}
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                {searchTerm 
                  ? `No servers match "${searchTerm}". Try a different search term.`
                  : 'Create your first AI-generated Discord server to get started!'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => navigate('/create-server')}
                  className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wide gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Server
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-black mb-4">Delete Server?</h3>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete "{servers.find(s => s.id === deleteConfirm)?.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ServersPage;