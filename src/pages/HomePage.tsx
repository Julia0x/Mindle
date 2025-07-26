import React from 'react';
import { ArrowRight, Play, Zap, Bot, Rocket } from 'lucide-react';

const HomePage: React.FC = () => {
  const handleGetStarted = () => {
    console.log('Navigate to register');
  };

  const handleWatchDemo = () => {
    console.log('Play demo video');
  };

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div className="relative flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <div className="text-white/70 text-sm font-medium mb-4 tracking-[0.3em]">MINDLE</div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            BUILD DISCORD
            <br />
            <span className="text-white/30 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">SERVERS</span>
            <br />
            WITH AI
          </h1>
          
          <p className="text-base md:text-lg text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Transform your ideas into fully functional Discord servers in seconds.
            <br />
            No manual setup required—just describe your vision and watch AI bring it to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-lg font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
            >
              START BUILDING
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button 
              onClick={handleWatchDemo}
              className="border border-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              WATCH DEMO
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-white/50 text-xs uppercase tracking-wider">Servers Created</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-white/50 text-xs uppercase tracking-wider">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white mb-1">99.9%</div>
              <div className="text-white/50 text-xs uppercase tracking-wider">Uptime</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
              WHY CHOOSE
              <br />
              <span className="text-white/40">MINDLE?</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-base font-semibold mb-2 uppercase tracking-wide">Lightning Fast</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Create fully functional Discord servers in seconds, not hours. Our AI processes your requirements instantly.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <Bot className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-base font-semibold mb-2 uppercase tracking-wide">AI Powered</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Advanced artificial intelligence understands your vision and builds exactly what you need.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <Rocket className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-base font-semibold mb-2 uppercase tracking-wide">Zero Setup</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                No technical knowledge required. Just describe your server and deploy instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
              HOW IT
              <br />
              <span className="text-white/40">WORKS</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-black font-bold text-sm">1</span>
              </div>
              <h3 className="text-base font-semibold mb-2 uppercase tracking-wide">Describe</h3>
              <p className="text-white/60 text-sm">Tell our AI what kind of Discord server you want to create</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-black font-bold text-sm">2</span>
              </div>
              <h3 className="text-base font-semibold mb-2 uppercase tracking-wide">Generate</h3>
              <p className="text-white/60 text-sm">AI creates your server structure, channels, and settings</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-black font-bold text-sm">3</span>
              </div>
              <h3 className="text-base font-semibold mb-2 uppercase tracking-wide">Deploy</h3>
              <p className="text-white/60 text-sm">Launch your fully configured Discord server instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 tracking-tight">
            READY TO BUILD?
          </h2>
          <p className="text-base text-white/70 mb-8 leading-relaxed">
            Join thousands of community builders who trust Mindle to create amazing Discord servers.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-lg font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 gap-2 group"
          >
            GET STARTED NOW
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;