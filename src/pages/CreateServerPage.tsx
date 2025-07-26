import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Sparkles, Wand2, Server, Users, Settings, Zap, CreditCard, AlertCircle } from 'lucide-react';
import { useServers } from '../contexts/ServerContext';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const CreateServerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    serverName: '',
    prompt: '',
  });
  const [step, setStep] = useState<'input' | 'generating' | 'success' | 'error'>('input');
  const [generatedServer, setGeneratedServer] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const { createServer, creating } = useServers();
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !formData.serverName.trim() || !formData.prompt.trim()) return;

    // Check if user has enough credits
    if (userProfile.credits < 10) {
      setErrorMessage('You need 10 credits to create a server. You currently have ' + userProfile.credits + ' credits.');
      setStep('error');
      return;
    }

    setStep('generating');
    setProgress(0);
    setErrorMessage('');

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await createServer({
        name: formData.serverName.trim(),
        prompt: formData.prompt.trim(),
        ownerId: userProfile.uid,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success && response.server) {
        setGeneratedServer(response.server);
        setStep('success');
      } else {
        setErrorMessage(response.error || 'Unknown error occurred');
        setStep('error');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setErrorMessage('An unexpected error occurred');
      setStep('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const examplePrompts = [
    {
      icon: <Users className="w-4 h-4" />,
      title: "Gaming Community",
      prompt: "Create a gaming server with channels for different games, voice rooms for parties, roles for streamers, moderators, and regular gamers. Include channels for game announcements, LFG, and memes."
    },
    {
      icon: <Settings className="w-4 h-4" />,
      title: "Study Group",
      prompt: "Build a study server with channels for different subjects like math, science, literature. Include voice study rooms, homework help channels, and roles for tutors and students."
    },
    {
      icon: <Server className="w-4 h-4" />,
      title: "Developer Community",
      prompt: "Create a programming server with channels for different languages, code reviews, project showcases, job postings, and voice channels for collaboration sessions."
    }
  ];

  if (step === 'generating') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              {/* AI Animation */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-black rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-black animate-bounce" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-black mb-2 uppercase tracking-wide">
                AI is Building Your Server
              </h2>
              <p className="text-gray-600 mb-6 font-medium">
                Creating "{formData.serverName}" with all channels, roles, and permissions...
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 font-medium">{Math.round(progress)}% Complete</p>

              {/* Generation Steps */}
              <div className="mt-8 space-y-3 text-left">
                <div className={`flex items-center space-x-3 ${progress > 20 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${progress > 20 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">Analyzing your requirements</span>
                </div>
                <div className={`flex items-center space-x-3 ${progress > 40 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${progress > 40 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">Creating roles and permissions</span>
                </div>
                <div className={`flex items-center space-x-3 ${progress > 60 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${progress > 60 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">Designing channels and categories</span>
                </div>
                <div className={`flex items-center space-x-3 ${progress > 80 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${progress > 80 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">Finalizing server structure</span>
                </div>
              </div>

              {/* Credits Info */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">10 credits will be deducted upon completion</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === 'success') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-lg w-full text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-black mb-4 uppercase tracking-wide">
                Server Created!
              </h2>
              <p className="text-gray-600 mb-8 font-medium">
                "{formData.serverName}" has been successfully generated with all the features you requested!
              </p>

              {/* Server Stats */}
              {generatedServer && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-black">{generatedServer.roleCount || 0}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Roles</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-black">{generatedServer.channelCount || 0}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Channels</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-black">{generatedServer.categories?.length || 0}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Categories</div>
                  </div>
                </div>
              )}

              {/* Credits Info */}
              <div className="mb-8 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium flex items-center justify-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  10 credits deducted • {(userProfile?.credits || 0)} credits remaining
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide"
                >
                  View in Dashboard
                </button>
                <button
                  onClick={() => {
                    setStep('input');
                    setFormData({ serverName: '', prompt: '' });
                    setGeneratedServer(null);
                    setErrorMessage('');
                  }}
                  className="w-full bg-gray-100 text-gray-800 py-4 px-6 rounded-lg font-bold hover:bg-gray-200 transition-colors uppercase tracking-wide"
                >
                  Create Another Server
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === 'error') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>

              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-wide">
                {errorMessage.includes('credits') ? 'Insufficient Credits' : 'Generation Failed'}
              </h2>
              <p className="text-gray-600 mb-8 font-medium">
                {errorMessage || 'Something went wrong while creating your server. Please try again.'}
              </p>

              {errorMessage.includes('credits') && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium flex items-center justify-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    You currently have {userProfile?.credits || 0} credits
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setStep('input');
                  setErrorMessage('');
                }}
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors font-medium mx-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              BACK TO DASHBOARD
            </button>

            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">
              Create Discord Server
            </h1>
            <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
              Tell our AI what kind of Discord server you want, and it will generate a complete server structure with roles, channels, categories, and permissions.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-black mb-8 uppercase tracking-wide flex items-center">
                  <Bot className="w-6 h-6 mr-3" />
                  Server Details
                </h2>

                {/* Credits Display */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium text-gray-700">Available Credits</span>
                    </div>
                    <span className="text-xl font-bold text-black">{userProfile?.credits || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Creating a server costs <strong>10 credits</strong>. {(userProfile?.credits || 0) >= 10 ? 'You have enough credits!' : 'You need more credits.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
                      Server Name
                    </label>
                    <input
                      type="text"
                      name="serverName"
                      value={formData.serverName}
                      onChange={handleInputChange}
                      placeholder="e.g. Gaming Paradise, Study Buddies, Dev Community"
                      className="w-full px-4 py-4 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black font-medium"
                      required
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      {formData.serverName.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
                      Describe Your Server
                    </label>
                    <textarea
                      name="prompt"
                      value={formData.prompt}
                      onChange={handleInputChange}
                      placeholder="Describe what kind of Discord server you want. Include the purpose, target audience, types of channels you need, roles for members, and any special features..."
                      className="w-full px-4 py-4 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black font-medium resize-none"
                      rows={6}
                      required
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      {formData.prompt.length}/1000 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={creating || !formData.serverName.trim() || !formData.prompt.trim() || (userProfile?.credits || 0) < 10}
                    className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-lg flex items-center justify-center gap-3"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Server (10 Credits)
                  </button>
                  
                  {(userProfile?.credits || 0) < 10 && (
                    <p className="text-red-600 text-sm font-medium text-center">
                      You need {10 - (userProfile?.credits || 0)} more credits to create a server.
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* Examples Section */}
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                  Example Prompts
                </h3>
                
                <div className="space-y-4">
                  {examplePrompts.map((example, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300 cursor-pointer group"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          prompt: example.prompt
                        }));
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-200 rounded-lg group-hover:bg-gray-300 transition-colors">
                          {example.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-black text-sm uppercase tracking-wide mb-2">
                            {example.title}
                          </h4>
                          <p className="text-gray-600 text-xs leading-relaxed font-medium">
                            {example.prompt}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <h3 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                  AI Will Create:
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Custom Roles</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Organized Categories</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Text & Voice Channels</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Permission Settings</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Channel Descriptions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span>Server Settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateServerPage;