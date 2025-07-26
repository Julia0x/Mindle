import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.TargetEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            BACK TO HOME
          </Link>
          
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-black font-bold text-3xl">M</span>
          </div>
          <span className="text-white font-black text-3xl tracking-tight">MINDLE</span>
          
          <h1 className="text-4xl font-black text-white mt-8 mb-4 tracking-tight">WELCOME BACK</h1>
          <p className="text-white/60 text-lg">
            Sign in to your account to continue building amazing servers
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-wide">Sign In</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-4 bg-black border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 bg-black border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent pr-12 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-white bg-black border-white/20 rounded focus:ring-white focus:ring-2"
                />
                <span className="ml-3 text-sm text-white/60 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-white/60 hover:text-white font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 px-4 rounded-xl font-bold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-lg"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/60 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:underline font-bold">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/5 text-white/60 font-medium uppercase tracking-wide">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                disabled
                className="w-full bg-white/5 text-white/30 py-4 px-4 rounded-xl font-bold cursor-not-allowed opacity-50 uppercase tracking-wide"
              >
                Continue with Discord (Disabled)
              </button>
              <button
                disabled
                className="w-full bg-white/5 text-white/30 py-4 px-4 rounded-xl font-bold cursor-not-allowed opacity-50 uppercase tracking-wide"
              >
                Continue with Google (Disabled)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;