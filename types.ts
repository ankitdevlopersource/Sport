export type Page = 'Home' | 'Join Athletics' | 'Messages' | 'Leaderboard' | 'Profile';

export type Role = 'Athlete' | 'Coach' | 'Sponsor';

export interface User {
  name: string;
  role: Role;
  sport: string;
  location: string;
  profilePictureUrl: string;
  districtRank: number;
  stateRank: number;
  totalScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  sport: string;
  score: number;
  profilePictureUrl?: string;
}

export interface Conversation {
    id: number;
    sender: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    type: 'sponsor' | 'team' | 'system';
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
}

export interface Performance {
    id: number;
    title: string;
    date: string;
    score: number;
    metric?: string;
    imageUrl: string;
}

// FIX: Add Drill and TrainingPlan types for the Training Hub screen.
export interface Drill {
    name: string;
    description: string;
}

export interface TrainingPlan {
    summary: string;
    drills: Drill[];
}