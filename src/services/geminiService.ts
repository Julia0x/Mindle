import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedServer, ServerCreationRequest, AIServerResponse } from '../types/server';

class GeminiService {
  private genAI: GoogleGenerativeAI | undefined;
  private model: any;
  private apiKey: string | undefined;

  constructor() {
    // Try to get API key from environment first, then fall back to any other source
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Remove the hardcoded key check - if you have a real key, replace 'your_api_key_here' with it
    // this.apiKey = this.apiKey || "YOUR_ACTUAL_API_KEY_HERE";
    
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      console.warn('Gemini API key not configured. Server generation will not work.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Gemini service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
    }
  }

  async generateServer(request: ServerCreationRequest): Promise<AIServerResponse> {
    try {
      // Check if service is properly initialized
      if (!this.apiKey || this.apiKey === 'your_api_key_here') {
        return {
          success: false,
          error: 'Gemini API key not configured. Please add your API key to enable server generation.'
        };
      }

      if (!this.model || !this.genAI) {
        return {
          success: false,
          error: 'AI service not properly initialized. Please check your API key.'
        };
      }

      const prompt = this.buildServerGenerationPrompt(request);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the AI response
      const serverData = this.parseAIResponse(text, request);

      return {
        success: true,
        server: serverData
      };
    } catch (error) {
      console.error('Error generating server:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Add a method to check if service is ready
  isReady(): boolean {
    return !!(this.apiKey && this.model && this.genAI);
  }

  // Method to update API key at runtime if needed
  updateApiKey(newApiKey: string): boolean {
    try {
      this.apiKey = newApiKey;
      this.genAI = new GoogleGenerativeAI(newApiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('API key updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update API key:', error);
      return false;
    }
  }

  private buildServerGenerationPrompt(request: ServerCreationRequest): string {
    return `You are an expert Discord server architect. Create a comprehensive Discord server structure based on this request:

SERVER NAME: ${request.name}
USER REQUEST: ${request.prompt}

Generate a complete Discord server structure with the following requirements:

1. ANALYZE THE REQUEST and determine the server's purpose, theme, and target audience
2. CREATE ROLES with detailed permissions (at least 4-8 roles including @everyone)
3. DESIGN CATEGORIES to organize content logically (4-8 categories)
4. CREATE CHANNELS within each category with specific purposes (15-30 total channels)
5. SET APPROPRIATE PERMISSIONS for each role and channel
6. ADD DETAILED DESCRIPTIONS for everything

RESPOND WITH VALID JSON in this exact format:

{
  "analysis": {
    "purpose": "Main purpose of the server",
    "theme": "Theme/topic of the server", 
    "targetAudience": "Who this server is for",
    "description": "Detailed server description (2-3 sentences)"
  },
  "roles": [
    {
      "name": "Role Name",
      "description": "What this role does",
      "color": "#HEX_COLOR",
      "position": 1,
      "permissions": [
        "MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_MESSAGES", 
        "SEND_MESSAGES", "READ_MESSAGES", "CONNECT", "SPEAK", "USE_VOICE_ACTIVITY"
      ],
      "mentionable": true,
      "displaySeparately": true
    }
  ],
  "categories": [
    {
      "name": "Category Name",
      "description": "Purpose of this category",
      "position": 1,
      "channels": [
        {
          "name": "channel-name",
          "description": "Channel purpose and rules",
          "type": "text",
          "position": 1,
          "topic": "Channel topic/description",
          "isNSFW": false,
          "slowMode": 0,
          "permissions": [
            {
              "roleName": "Role Name",
              "allow": ["SEND_MESSAGES", "READ_MESSAGES"],
              "deny": ["MANAGE_MESSAGES"]
            }
          ]
        }
      ]
    }
  ],
  "settings": {
    "verificationLevel": "medium",
    "defaultNotifications": "only_mentions",
    "explicitContentFilter": "members_without_roles"
  },
  "tags": ["tag1", "tag2", "tag3"]
}

IMPORTANT GUIDELINES:
- Include @everyone role with basic permissions
- Create admin, moderator, and member roles minimum
- Make channel names lowercase with hyphens
- Include both text and voice channels
- Add welcome/rules channels
- Set logical permission hierarchies
- Include variety: announcement, general, topic-specific, voice channels
- Make descriptions helpful and engaging
- Use appropriate colors for roles (#FF0000 for admin, #00FF00 for mod, etc.)

Generate for: ${request.prompt}`;
  }

  private parseAIResponse(text: string, request: ServerCreationRequest): Partial<GeneratedServer> {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const aiData = JSON.parse(jsonMatch[0]);
      const now = new Date();

      // Build the server object
      const server: Partial<GeneratedServer> = {
        name: request.name || 'Untitled Server',
        description: aiData.analysis?.description || `${request.name || 'Server'} - Generated by AI`,
        ownerId: request.ownerId,
        createdAt: now,
        updatedAt: now,

        aiPrompt: request.prompt || 'No prompt provided',
        theme: aiData.analysis?.theme || 'General',
        purpose: aiData.analysis?.purpose || 'Community',
        targetAudience: aiData.analysis?.targetAudience || 'General Users',

        roles: this.processRoles(Array.isArray(aiData.roles) ? aiData.roles : []),
        categories: this.processCategories(
            Array.isArray(aiData.categories) ? aiData.categories : [],
            Array.isArray(aiData.roles) ? aiData.roles : []
        ),
        settings: {
          verificationLevel: (aiData.settings?.verificationLevel as any) || 'medium',
          defaultNotifications: (aiData.settings?.defaultNotifications as any) || 'only_mentions',
          explicitContentFilter: (aiData.settings?.explicitContentFilter as any) || 'members_without_roles',
          afkTimeout: 300,
        },

        memberCount: 1,
        channelCount: 0, // Will be calculated below
        roleCount: 0, // Will be calculated below

        isPublic: true,
        tags: Array.isArray(aiData.tags) ? aiData.tags : [],
        region: 'us-west',
        boostLevel: 0,

        // Optional fields - explicitly set to null for Firestore compatibility
        icon: null,
        banner: null,
        inviteCode: null,
      };

      // Count channels and roles
      const categories = server.categories || [];
      const roles = server.roles || [];

      server.channelCount = categories.reduce((total, cat) => total + (cat.channels?.length || 0), 0);
      server.roleCount = roles.length;

      // Flatten channels from categories
      server.channels = categories.flatMap(cat => cat.channels || []);

      return server;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  private processRoles(aiRoles: any[]): any[] {
    if (!Array.isArray(aiRoles)) {
      aiRoles = [];
    }

    const roles = aiRoles.map((role, index) => ({
      id: this.generateId(),
      name: role.name || 'New Role',
      description: role.description || 'No description',
      color: role.color || '#99AAB5',
      position: typeof role.position === 'number' ? role.position : index + 1,
      permissions: this.processPermissions(Array.isArray(role.permissions) ? role.permissions : []),
      mentionable: role.mentionable !== false,
      displaySeparately: role.displaySeparately !== false,
      memberCount: (role.name === '@everyone') ? 100 : Math.floor(Math.random() * 50) + 1
    }));

    // Ensure @everyone role exists
    if (!roles.some(role => role.name === '@everyone')) {
      roles.unshift({
        id: this.generateId(),
        name: '@everyone',
        description: 'Default role for all server members',
        color: '#99AAB5',
        position: 0,
        permissions: this.processPermissions(['READ_MESSAGES', 'SEND_MESSAGES', 'CONNECT', 'SPEAK']),
        mentionable: false,
        displaySeparately: false,
        memberCount: 100
      });
    }

    return roles;
  }

  private processCategories(aiCategories: any[], roles: any[]): any[] {
    if (!Array.isArray(aiCategories)) {
      aiCategories = [];
    }
    if (!Array.isArray(roles)) {
      roles = [];
    }

    return aiCategories.map((category, index) => ({
      id: this.generateId(),
      name: category.name || 'General',
      description: category.description || 'No description',
      position: typeof category.position === 'number' ? category.position : index,
      permissions: [],
      channels: (Array.isArray(category.channels) ? category.channels : []).map((channel: any, channelIndex: number) => ({
        id: this.generateId(),
        name: channel.name || `channel-${channelIndex}`,
        description: channel.description || 'No description',
        type: channel.type || 'text',
        position: typeof channel.position === 'number' ? channel.position : channelIndex,
        permissions: this.processChannelPermissions(Array.isArray(channel.permissions) ? channel.permissions : [], roles),
        topic: channel.topic || channel.description || '',
        isNSFW: Boolean(channel.isNSFW),
        slowMode: typeof channel.slowMode === 'number' ? channel.slowMode : 0,
        userLimit: channel.type === 'voice' ? (typeof channel.userLimit === 'number' ? channel.userLimit : null) : null
      }))
    }));
  }

  private processPermissions(permissions: string[]): any[] {
    const allPermissions = [
      { id: 'READ_MESSAGES', name: 'View Channels', description: 'Allows members to view channels' },
      { id: 'SEND_MESSAGES', name: 'Send Messages', description: 'Allows members to send messages' },
      { id: 'MANAGE_MESSAGES', name: 'Manage Messages', description: 'Allows members to delete messages from other users' },
      { id: 'EMBED_LINKS', name: 'Embed Links', description: 'Allows members to embed links' },
      { id: 'ATTACH_FILES', name: 'Attach Files', description: 'Allows members to upload images and files' },
      { id: 'MENTION_EVERYONE', name: 'Mention @everyone', description: 'Allows members to use @everyone and @here' },
      { id: 'USE_EXTERNAL_EMOJIS', name: 'Use External Emojis', description: 'Allows the usage of custom emojis from other servers' },
      { id: 'CONNECT', name: 'Connect', description: 'Allows members to connect to voice channels' },
      { id: 'SPEAK', name: 'Speak', description: 'Allows members to speak in voice channels' },
      { id: 'USE_VOICE_ACTIVITY', name: 'Use Voice Activity', description: 'Allows members to use voice activity detection' },
      { id: 'KICK_MEMBERS', name: 'Kick Members', description: 'Allows members to remove other members from this server' },
      { id: 'BAN_MEMBERS', name: 'Ban Members', description: 'Allows members to permanently ban other members from this server' },
      { id: 'MANAGE_GUILD', name: 'Manage Server', description: 'Allows members to change the server name and region' },
      { id: 'MANAGE_ROLES', name: 'Manage Roles', description: 'Allows members to create new roles and edit or delete roles lower than their highest role' },
      { id: 'MANAGE_CHANNELS', name: 'Manage Channels', description: 'Allows members to create, edit, or delete channels' }
    ];

    return allPermissions.map(perm => ({
      ...perm,
      enabled: permissions.includes(perm.id)
    }));
  }

  private processChannelPermissions(channelPermissions: any[], roles: any[]): any[] {
    if (!Array.isArray(channelPermissions)) {
      return [];
    }
    if (!Array.isArray(roles)) {
      return [];
    }

    return channelPermissions.map(perm => ({
      roleId: roles.find(r => r.name === perm?.roleName)?.id || (roles.length > 0 ? roles[0].id : 'default'),
      allow: Array.isArray(perm?.allow) ? perm.allow : [],
      deny: Array.isArray(perm?.deny) ? perm.deny : []
    })).filter(perm => perm.roleId !== 'default'); // Remove invalid permissions
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const geminiService = new GeminiService();
export default geminiService;
