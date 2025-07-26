import React, { useState } from 'react';
import { X, User, Mail, Shield, Star, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: userProfile?.email || '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !userProfile) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-white/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-white/10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white uppercase tracking-wide">Account Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-white/10 rounded-lg sm:rounded-xl"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Profile Info */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white font-bold text-2xl sm:text-3xl">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white uppercase tracking-wide">
                  {userProfile.firstName} {userProfile.lastName}
                </h3>
                {userProfile.verified && (
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" />
                )}
                {userProfile.isPro && (
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400" />
                )}
              </div>
              <p className="text-white/60 font-medium mt-1 sm:mt-2 text-sm sm:text-base">{userProfile.email}</p>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-medium text-sm sm:text-base"
                    />
                  ) : (
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white font-medium text-sm sm:text-base">
                      {userProfile.firstName}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-medium text-sm sm:text-base"
                    />
                  ) : (
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white font-medium text-sm sm:text-base">
                      {userProfile.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white/60 font-medium text-sm sm:text-base">
                  {userProfile.email}
                </div>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1.5 sm:mt-2 font-medium uppercase tracking-wide">Email cannot be changed</p>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10">
              <h4 className="text-xs sm:text-sm font-bold text-white mb-4 sm:mb-6 uppercase tracking-wide">Account Information</h4>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
                <div>
                  <div className="text-white/60 font-medium uppercase tracking-wide mb-0.5 sm:mb-1">Status</div>
                  <div className="text-white font-bold uppercase tracking-wide">
                    {userProfile.verified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 font-medium uppercase tracking-wide mb-0.5 sm:mb-1">Plan</div>
                  <div className="text-white font-bold uppercase tracking-wide">
                    {userProfile.isPro ? 'Pro' : 'Free'}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 font-medium uppercase tracking-wide mb-0.5 sm:mb-1">Credits</div>
                  <div className="text-white font-bold text-lg sm:text-xl">{userProfile.credits}</div>
                </div>
                <div>
                  <div className="text-white/60 font-medium uppercase tracking-wide mb-0.5 sm:mb-1">Role</div>
                  <div className="text-white font-bold uppercase tracking-wide">
                    {userProfile.isAdmin ? 'Admin' : 'User'}
                  </div>
                </div>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center text-xs sm:text-sm text-white/60 font-medium">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="uppercase tracking-wide">Joined {userProfile.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex justify-end space-x-3 sm:space-x-4 p-4 sm:p-6 lg:p-8 border-t border-white/10 bg-black">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 sm:px-6 py-2 sm:py-3 text-white/60 hover:text-white transition-colors font-medium uppercase tracking-wide text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg sm:rounded-xl font-bold hover:bg-white/90 transition-colors disabled:opacity-50 uppercase tracking-wide text-xs sm:text-sm"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 text-white rounded-lg sm:rounded-xl font-bold hover:bg-white/20 transition-colors uppercase tracking-wide text-xs sm:text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;