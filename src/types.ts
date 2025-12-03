export type MemoryType = 'peak' | 'daily' | 'crisis_repair';
export type MediaType = 'text' | 'audio' | 'video';

export interface Memory {
    id: string;
    type: MemoryType;
    content: string;
    promptText?: string;
    timestamp: number;
    mediaType: MediaType;
    mediaUrl?: string;
    template?: string;
    isFavorite?: boolean;
}

export interface Profile {
    name: string;
    partnerName: string;
    priorities: string[];
    likes: string[];
    dislikes: string[];
    expandedStateEnabled: boolean;
    streak: number;
    lastPulse: number;
}

export interface Prompt {
    id: string;
    text: string;
    category: 'peak' | 'daily' | 'crisis' | 'expanded_entry' | 'expanded_peak' | 'expanded_landing' | 'deep_dive' | 'playful';
    isCustom: boolean;
    activityType?: 'speaking' | 'action' | 'sensory';
}
