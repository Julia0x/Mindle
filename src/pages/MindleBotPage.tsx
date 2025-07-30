import React, { useState } from 'react';
import { Bot, Shield, MessageSquare, Zap, Settings, Users, Crown, Sparkles, ArrowRight, Check } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useServers } from '../contexts/ServerContext';

const MindleBotPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { servers } = useServers();
  const [selectedServers, setSelectedServers] = useState<Set<string>>(new Set());
  const [setupStep, setSetupStep] = useState<'selection' | 'configuration' | 'deployment'>('selection');

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Welcome & Leave Messages",
      description: "Custom greeting and farewell messages with embeds",
      included: true
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Auto Moderation",
      description: "Spam protection, link filtering, and profanity detection",
      included: true
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Leveling System",
      description: "XP and level rewards for active members",
      included: true
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Custom Commands",
      description: "Create unlimited custom bot commands",
      included: true
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Role Management",
      description: "Auto-assign roles and reaction roles",
      included: true
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Server Analytics",
      description: "Member activity and server statistics",
      included: true
    }
  ];

  const toggleServerSelection = (serverId: string) => {
    const newSelection = new Set(selectedServers);
    if (newSelection.has(serverId)) {
      newSelection.delete(serverId);
    } else {
      newSelection.add(serverId);
    }
    setSelectedServers(newSelection);
  };

  const handleDeployment = () => {
    // Implementation for bot deployment
    console.log('Deploying Mindle Bot to servers:', Array.from(selectedServers));
  };

  if (setupStep === 'configuration') {
    return (
      <DashboardLayout>
        <div className="p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">
                Configure Mindle Bot
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Customize your bot settings for {selectedServers.size} selected server{selectedServers.size !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">Bot Configuration</h2>
              <div className="text-center py-16">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Configuration interface coming soon!</p>
                <button
                  onClick={() => setSetupStep('deployment')}
                  className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  Continue to Deployment
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (setupStep === 'deployment') {
    return (
      <DashboardLayout>
        <div className="p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">
                Bot Deployed Successfully!
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Mindle Bot has been deployed to your selected servers and is ready to use.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-black mb-4">What's Next?</h2>
              <p className="text-gray-600 mb-6">
                Your bot is now active and managing your servers. Use the setup commands to configure specific features.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setSetupStep('selection')}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                >
                  Deploy to More Servers
                </button>
                <button className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                  View Bot Dashboard
                </button>
              </div>
            </div>
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
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-4xl font-black text-black uppercase tracking-tight">Mindle Bot</span>
                <span className="ml-3 px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full font-bold uppercase">
                  Beta
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black mb-4 uppercase tracking-wide">
              Multiguild Bot Setup
            </h1>
            <p className="text-gray-600 text-lg font-medium max-w-3xl mx-auto">
              Deploy our AI-powered bot across multiple Discord servers. Replaces Mee6, Carl-bot, and others with intelligent automation that adapts to your server's needs.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {feature.icon}
                  </div>
                  {feature.included && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-bold uppercase">
                      Included
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Server Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2 uppercase tracking-wide">
                  Select Servers
                </h2>
                <p className="text-gray-600 font-medium">
                  Choose which servers to deploy Mindle Bot to
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-black">
                  {selectedServers.size}
                </div>
                <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                  Selected
                </div>
              </div>
            </div>

            {servers.length === 0 ? (
              <div className="text-center py-16">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-black mb-2">No Servers Found</h3>
                <p className="text-gray-600 mb-6">You need to create servers first to deploy the bot.</p>
                <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                  Create Your First Server
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {servers.map((server) => (
                    <div
                      key={server.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedServers.has(server.id)
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleServerSelection(server.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">
                            {server.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-black">{server.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {server.memberCount} members • {server.channelCount} channels
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedServers.has(server.id)
                            ? 'border-black bg-black'
                            : 'border-gray-300'
                        }`}>
                          {selectedServers.has(server.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-gray-600 font-medium">
                    Bot deployment is free for all Mindle users
                  </div>
                  <button
                    onClick={() => setSetupStep('configuration')}
                    disabled={selectedServers.size === 0}
                    className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Deploy Bot</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MindleBotPage;