export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  position: number;
  permissions: Permission[];
  mentionable: boolean;
  displaySeparately: boolean;
  memberCount?: number;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'voice' | 'announcement' | 'stage' | 'forum';
  categoryId?: string;
  position: number;
  permissions: {
    roleId: string;
    allow: string[];
    deny: string[];
  }[];
  topic?: string;
  isNSFW?: boolean;
  slowMode?: number;
  userLimit?: number; // for voice channels
}

export interface Category {
  id: string;
  name: string;
  description: string;
  position: number;
  permissions: {
    roleId: string;
    allow: string[];
    deny: string[];
  }[];
  channels: Channel[];
}

export interface ServerSettings {
  verificationLevel: 'none' | 'low' | 'medium' | 'high' | 'very_high';
  defaultNotifications: 'all_messages' | 'only_mentions';
  explicitContentFilter: 'disabled' | 'members_without_roles' | 'all_members';
  afkTimeout: number;
  afkChannelId?: string;
  systemChannelId?: string;
  rulesChannelId?: string;
  publicUpdatesChannelId?: string;
}

export interface GeneratedServer {
  id: string;
  name: string;
  description: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // AI Generated Content
  aiPrompt: string;
  theme: string;
  purpose: string;
  targetAudience: string;
  
  // Server Structure
  roles: Role[];
  categories: Category[];
  channels: Channel[];
  settings: ServerSettings;
  
  // Stats
  memberCount: number;
  channelCount: number;
  roleCount: number;
  
  // Meta
  isPublic: boolean;
  inviteCode?: string;
  tags: string[];
  region: string;
  boostLevel: 0 | 1 | 2 | 3;
}

export interface ServerCreationRequest {
  name: string;
  prompt: string;
  ownerId: string;
}

export interface AIServerResponse {
  success: boolean;
  server?: Partial<GeneratedServer>;
  error?: string;
}