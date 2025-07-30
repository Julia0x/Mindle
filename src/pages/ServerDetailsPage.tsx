import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Download, Share2, Crown, Users, MessageSquare, Copy, Check } from 'lucide-react';
import { useServers } from '../contexts/ServerContext';
import ServerPreview from '../components/ServerPreview';
import DashboardLayout from '../components/DashboardLayout';

const ServerDetailsPage: React.FC = () => {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const { getServer, deleteServer } = useServers();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedSetup, setCopiedSetup] = useState(false);
  const [copiedServerId, setCopiedServerId] = useState(false);
  
  const server = serverId ? getServer(serverId) : null;

  if (!server) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Server Not Found</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = async () => {
    if (serverId) {
      await deleteServer(serverId);
      navigate('/dashboard');
    }
  };

  const copySetupCommand = async () => {
    if (serverId) {
      const setupCommand = `/setup ${serverId}`;
      await navigator.clipboard.writeText(setupCommand);
      setCopiedSetup(true);
      setTimeout(() => setCopiedSetup(false), 2000);
    }
  };

  const copyServerId = async () => {
    if (serverId) {
      await navigator.clipboard.writeText(serverId);
      setCopiedServerId(true);
      setTimeout(() => setCopiedServerId(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              BACK TO DASHBOARD
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {server.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">
                    {server.name}
                  </h1>
                  <p className="text-gray-600 text-lg font-medium mb-4 max-w-2xl">
                    {server.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {server.tags?.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Edit3 className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-3 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Server Info */}
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">Server Info</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-600 text-sm font-medium mb-1">Purpose</div>
                    <div className="text-black font-semibold">{server.purpose}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm font-medium mb-1">Theme</div>
                    <div className="text-black font-semibold">{server.theme}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm font-medium mb-1">Target Audience</div>
                    <div className="text-black font-semibold">{server.targetAudience}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm font-medium mb-1">Created</div>
                    <div className="text-black font-semibold">{new Date(server.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-black mb-1">{server.roles?.length || 0}</div>
                    <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">Roles</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-black mb-1">{server.categories?.length || 0}</div>
                    <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">Categories</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-black mb-1">{server.channelCount}</div>
                    <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">Channels</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-black mb-1">{server.memberCount}</div>
                    <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">Members</div>
                  </div>
                </div>
              </div>

              {/* AI Prompt */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">Original Prompt</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 text-sm leading-relaxed italic">
                    "{server.aiPrompt}"
                  </p>
                </div>
              </div>
            </div>

            {/* Server Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-black uppercase tracking-wide">Discord Preview</h3>
                  <div className="text-gray-600 text-sm font-medium">
                    Interactive server structure
                  </div>
                </div>
                <ServerPreview server={server} />
              </div>
            </div>
          </div>

          {/* Roles & Permissions Details */}
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            {/* Roles */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide flex items-center">
                <Crown className="w-5 h-5 mr-3" />
                Roles & Permissions
              </h3>
              <div className="space-y-4">
                {server.roles?.map((role) => (
                  <div key={role.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: role.color === '#99AAB5' ? '#6B7280' : role.color }}
                        ></div>
                        <div>
                          <h4 className="font-semibold text-black">{role.name}</h4>
                          <p className="text-gray-600 text-sm">{role.description}</p>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">{role.memberCount || 0} members</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions?.filter(p => p.enabled).slice(0, 4).map((permission) => (
                        <span key={permission.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {permission.name}
                        </span>
                      ))}
                      {(role.permissions?.filter(p => p.enabled).length || 0) > 4 && (
                        <span className="text-gray-600 text-xs">
                          +{(role.permissions?.filter(p => p.enabled).length || 0) - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories & Channels */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide flex items-center">
                <MessageSquare className="w-5 h-5 mr-3" />
                Categories & Channels
              </h3>
              <div className="space-y-6">
                {server.categories?.map((category) => (
                  <div key={category.id}>
                    <h4 className="font-semibold text-black mb-3 uppercase tracking-wide text-sm">
                      {category.name}
                    </h4>
                    <div className="space-y-2 ml-4">
                      {category.channels.map((channel) => (
                        <div key={channel.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="text-gray-600">
                            {channel.type === 'voice' ? <Users className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-black">{channel.name}</div>
                            {channel.description && (
                              <div className="text-gray-600 text-sm">{channel.description}</div>
                            )}
                          </div>
                          <div className="text-gray-500 text-xs uppercase">
                            {channel.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-black mb-4">Delete Server?</h3>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete "{server.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default ServerDetailsPage;