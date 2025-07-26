import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Hash, Volume2, Settings, Users, Crown, Shield, Star } from 'lucide-react';
import { GeneratedServer, Role, Category, Channel } from '../types/server';

interface ServerPreviewProps {
  server: GeneratedServer;
  className?: string;
}

const ServerPreview: React.FC<ServerPreviewProps> = ({ server, className = '' }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(server.categories?.map(cat => cat.id) || [])
  );
  const [selectedChannel, setSelectedChannel] = useState<string>(server.channels?.[0]?.id || '');

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getRoleIcon = (role: Role) => {
    if (role.name.toLowerCase().includes('admin') || role.name.toLowerCase().includes('owner')) {
      return <Crown className="w-3 h-3" />;
    }
    if (role.name.toLowerCase().includes('mod')) {
      return <Shield className="w-3 h-3" />;
    }
    if (role.name.toLowerCase().includes('vip') || role.name.toLowerCase().includes('premium')) {
      return <Star className="w-3 h-3" />;
    }
    return null;
  };

  const getChannelIcon = (channel: Channel) => {
    if (channel.type === 'voice') {
      return <Volume2 className="w-4 h-4" />;
    }
    return <Hash className="w-4 h-4" />;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-300 overflow-hidden shadow-lg ${className}`}>
      {/* Server Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {server.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-black text-lg">{server.name}</h3>
              <p className="text-gray-600 text-sm">
                {server.memberCount} members • {server.channelCount} channels
              </p>
            </div>
          </div>
          <Settings className="w-5 h-5 text-gray-500 hover:text-black cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-96">
        {/* Mobile Categories Toggle */}
        <div className="lg:hidden border-b border-gray-200 p-4">
          <select 
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            onChange={(e) => setSelectedChannel(e.target.value)}
            value={selectedChannel}
          >
            {server.categories?.map((category) => (
              <optgroup key={category.id} label={category.name}>
                {category.channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    #{channel.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Channels Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-2">
            {/* Categories and Channels */}
            {server.categories?.map((category) => (
              <div key={category.id} className="mb-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-gray-600 hover:text-black text-xs font-semibold uppercase tracking-wide group transition-colors"
                >
                  <div className="flex items-center">
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-3 h-3 mr-1" />
                    ) : (
                      <ChevronRight className="w-3 h-3 mr-1" />
                    )}
                    {category.name}
                  </div>
                </button>
                
                {expandedCategories.has(category.id) && (
                  <div className="ml-2 space-y-0.5">
                    {category.channels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={`w-full flex items-center px-2 py-1 rounded text-sm transition-colors ${
                          selectedChannel === channel.id
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:text-black hover:bg-gray-100'
                        }`}
                      >
                        <div className={`mr-2 ${selectedChannel === channel.id ? 'text-white' : 'text-gray-400'}`}>
                          {getChannelIcon(channel)}
                        </div>
                        <span className="truncate">{channel.name}</span>
                        {channel.isNSFW && (
                          <span className="ml-1 text-xs bg-red-600 text-white px-1 rounded">18+</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Orphaned channels (not in categories) */}
            {server.channels?.filter(ch => !server.categories?.some(cat => cat.channels.some(catCh => catCh.id === ch.id))).map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full flex items-center px-2 py-1 rounded text-sm transition-colors mb-0.5 ${
                  selectedChannel === channel.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                <div className={`mr-2 ${selectedChannel === channel.id ? 'text-white' : 'text-gray-400'}`}>
                  {getChannelIcon(channel)}
                </div>
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Channel Header */}
          {(() => {
            const currentChannel = server.channels?.find(ch => ch.id === selectedChannel);
            return currentChannel ? (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="text-gray-600">
                    {getChannelIcon(currentChannel)}
                  </div>
                  <h4 className="font-semibold text-black text-lg">{currentChannel.name}</h4>
                  {currentChannel.isNSFW && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">NSFW</span>
                  )}
                </div>
                {currentChannel.description && (
                  <p className="text-gray-600 text-sm mt-1">{currentChannel.description}</p>
                )}
                {currentChannel.topic && (
                  <p className="text-gray-500 text-xs mt-1 italic">Topic: {currentChannel.topic}</p>
                )}
              </div>
            ) : null;
          })()}

          {/* Channel Content Preview */}
          <div className="flex-1 p-4 bg-white flex items-center justify-center">
            <div className="text-gray-600 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash className="w-8 h-8 text-gray-500" />
              </div>
              <h5 className="text-black font-semibold text-lg mb-2">
                Welcome to #{server.channels?.find(ch => ch.id === selectedChannel)?.name || 'general'}!
              </h5>
              <p className="text-sm text-gray-600">
                This is the beginning of the #{server.channels?.find(ch => ch.id === selectedChannel)?.name || 'general'} channel.
              </p>
            </div>
          </div>
        </div>

        {/* Members Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-48 bg-gray-50 border-l border-gray-200 p-2 overflow-y-auto">
          <div className="space-y-4">
            {server.roles?.filter(role => role.name !== '@everyone' && role.displaySeparately).slice(0, 3).map((role) => (
              <div key={role.id}>
                <h6 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                  {getRoleIcon(role)}
                  <span className="ml-1 text-black">
                    {role.name} — {role.memberCount || 0}
                  </span>
                </h6>
                <div className="space-y-1">
                  {Array.from({ length: Math.min(role.memberCount || 3, 3) }, (_, i) => (
                    <div key={i} className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 text-sm transition-colors">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-xs font-semibold text-white">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-gray-700">User {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Online Members */}
            <div>
              <h6 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Online — {Math.min(server.memberCount, 10)}
              </h6>
              <div className="space-y-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 text-sm transition-colors">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                      {String.fromCharCode(88 + i)}
                    </div>
                    <span className="text-gray-700">Member {i + 1}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server Stats Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center text-xs">
          <div>
            <div className="font-semibold text-black text-lg">{server.roles?.length || 0}</div>
            <div className="text-gray-600 uppercase tracking-wide">Roles</div>
          </div>
          <div>
            <div className="font-semibold text-black text-lg">{server.categories?.length || 0}</div>
            <div className="text-gray-600 uppercase tracking-wide">Categories</div>
          </div>
          <div>
            <div className="font-semibold text-black text-lg">{server.channelCount || 0}</div>
            <div className="text-gray-600 uppercase tracking-wide">Channels</div>
          </div>
          <div>
            <div className="font-semibold text-black text-lg">{server.memberCount || 0}</div>
            <div className="text-gray-600 uppercase tracking-wide">Members</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerPreview;