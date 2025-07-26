import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { GeneratedServer, ServerCreationRequest, AIServerResponse } from '../types/server';
import { useAuth } from './AuthContext';
import geminiService from '../services/geminiService';

interface ServerContextType {
  servers: GeneratedServer[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  createServer: (request: ServerCreationRequest) => Promise<AIServerResponse>;
  fetchServers: () => Promise<void>;
  updateServer: (serverId: string, updates: Partial<GeneratedServer>) => Promise<void>;
  deleteServer: (serverId: string) => Promise<void>;
  getServer: (serverId: string) => GeneratedServer | null;
}

const ServerContext = createContext<ServerContextType | null>(null);

export const useServers = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServers must be used within a ServerProvider');
  }
  return context;
};

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servers, setServers] = useState<GeneratedServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, userProfile, updateUserProfile } = useAuth();

  const fetchServers = async () => {
    if (!currentUser) {
      setServers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, 'servers'),
        where('ownerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const fetchedServers: GeneratedServer[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedServers.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as GeneratedServer);
      });

      setServers(fetchedServers);
    } catch (err) {
      console.error('Error fetching servers:', err);
      setError('Failed to fetch servers');
    } finally {
      setLoading(false);
    }
  };

  const createServer = async (request: ServerCreationRequest): Promise<AIServerResponse> => {
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    if (!userProfile) {
      return { success: false, error: 'User profile not loaded' };
    }

    // Check if user has enough credits (10 credits per server)
    if (userProfile.credits < 10) {
      return { success: false, error: 'Insufficient credits. You need 10 credits to create a server.' };
    }

    try {
      setCreating(true);
      setError(null);

      // Generate server with AI
      const aiResponse = await geminiService.generateServer(request);
      
      if (!aiResponse.success || !aiResponse.server) {
        throw new Error(aiResponse.error || 'Failed to generate server');
      }

      // Prepare server data for Firestore
      const serverData = {
        ...aiResponse.server,
        ownerId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'servers'), serverData);
      
      const newServer = {
        ...serverData,
        id: docRef.id,
      } as GeneratedServer;

      // Update local state
      setServers(prev => [newServer, ...prev]);

      // Deduct 10 credits from user profile
      await updateUserProfile({ 
        credits: userProfile.credits - 10,
        totalServers: userProfile.totalServers + 1
      });

      return { success: true, server: newServer };
    } catch (err) {
      console.error('Error creating server:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create server';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCreating(false);
    }
  };

  const updateServer = async (serverId: string, updates: Partial<GeneratedServer>) => {
    try {
      const serverRef = doc(db, 'servers', serverId);
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      await updateDoc(serverRef, updateData);

      // Update local state
      setServers(prev => 
        prev.map(server => 
          server.id === serverId 
            ? { ...server, ...updateData, updatedAt: new Date() }
            : server
        )
      );
    } catch (err) {
      console.error('Error updating server:', err);
      setError('Failed to update server');
    }
  };

  const deleteServer = async (serverId: string) => {
    try {
      await deleteDoc(doc(db, 'servers', serverId));

      // Update local state
      setServers(prev => prev.filter(server => server.id !== serverId));
    } catch (err) {
      console.error('Error deleting server:', err);
      setError('Failed to delete server');
    }
  };

  const getServer = (serverId: string): GeneratedServer | null => {
    return servers.find(server => server.id === serverId) || null;
  };

  // Fetch servers when user changes
  useEffect(() => {
    fetchServers();
  }, [currentUser]);

  const value = {
    servers,
    loading,
    creating,
    error,
    createServer,
    fetchServers,
    updateServer,
    deleteServer,
    getServer,
  };

  return (
    <ServerContext.Provider value={value}>
      {children}
    </ServerContext.Provider>
  );
};