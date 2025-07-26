import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types/user';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification immediately after registration
    await sendEmailVerification(user);

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      firstName,
      lastName,
      verified: false, // Will be updated when email is verified
      credits: 100, // Starting credits
      isPro: false,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalServers: 0,
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    const updatedProfile = {
      ...updates,
      updatedAt: new Date(),
    };

    await updateDoc(doc(db, 'users', currentUser.uid), updatedProfile);
    
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updatedProfile });
    }
  };

  const fetchUserProfile = async (user: User) => {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const profileData = userDoc.data() as UserProfile;
      
      // Sync verification status from Firebase Auth
      const isVerified = user.emailVerified;
      if (profileData.verified !== isVerified) {
        // Update Firestore if verification status changed
        await updateDoc(doc(db, 'users', user.uid), {
          verified: isVerified,
          updatedAt: new Date(),
        });
        profileData.verified = isVerified;
      }
      
      setUserProfile({
        ...profileData,
        verified: isVerified, // Always use Firebase Auth status
        createdAt: profileData.createdAt instanceof Date ? profileData.createdAt : new Date(profileData.createdAt),
        updatedAt: profileData.updatedAt instanceof Date ? profileData.updatedAt : new Date(profileData.updatedAt),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};