import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sendEmailVerification, reload } from 'firebase/auth';

const EmailVerificationPage: React.FC = () => {
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Auto-refresh to check verification status every 3 seconds
  useEffect(() => {
    if (!currentUser) return;

    const checkVerificationStatus = async () => {
      try {
        setIsCheckingVerification(true);
        await reload(currentUser);
        
        if (currentUser.emailVerified) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setIsCheckingVerification(false);
      }
    };

    // Check immediately
    checkVerificationStatus();

    // Set up interval to check every 3 seconds
    const interval = setInterval(checkVerificationStatus, 3000);

    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!currentUser || resendCooldown > 0) return;

    setResendLoading(true);
    setMessage('');

    try {
      await sendEmailVerification(currentUser);
      setMessage('Verification email sent successfully!');
      setMessageType('success');
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      setMessage(error.message || 'Failed to send verification email');
      setMessageType('error');
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            BACK TO LOGIN
          </button>
          
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-black font-bold text-3xl">M</span>
          </div>
          <span className="text-white font-black text-3xl tracking-tight">MINDLE</span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
              Verify Your Email
            </h1>
            <p className="text-white/60 font-medium">
              We've sent a verification email to <br />
              <span className="text-white font-semibold">{currentUser.email}</span>
            </p>
          </div>

          {/* Status Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              messageType === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              <p className="text-sm font-medium flex items-center">
                {messageType === 'success' ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2" />
                )}
                {message}
              </p>
            </div>
          )}

          {/* Auto-refresh indicator */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm font-medium">
                Auto-checking verification status...
              </span>
              <RefreshCw className={`w-4 h-4 text-white/60 ${isCheckingVerification ? 'animate-spin' : ''}`} />
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">
              Next Steps:
            </h3>
            <ol className="space-y-3 text-white/60 text-sm font-medium">
              <li className="flex items-start">
                <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 font-bold">1</span>
                Check your email inbox for the verification message
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 font-bold">2</span>
                Click the verification link in the email
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 font-bold">3</span>
                Return to this page - you'll be redirected automatically
              </li>
            </ol>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResendVerification}
            disabled={resendLoading || resendCooldown > 0}
            className="w-full bg-white text-black py-4 px-4 rounded-xl font-bold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm mb-4"
          >
            {resendLoading ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                SENDING...
              </span>
            ) : resendCooldown > 0 ? (
              `RESEND IN ${resendCooldown}S`
            ) : (
              'RESEND VERIFICATION EMAIL'
            )}
          </button>

          {/* Help text */}
          <div className="text-center">
            <p className="text-white/40 text-xs font-medium">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;