export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  credits: number;
  isPro: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalServers: number;
}

export interface Server {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  lastActive: Date;
}