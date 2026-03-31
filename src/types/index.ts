// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'consumer' | 'employee' | 'hr' | 'therapist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyId?: string;   // for employee/HR users
  createdAt: string;
  // Pillar 3: Memory Engine settings
  memoryEnabled: boolean;
  memoryRetentionDays?: number; // null for forever
}

export interface AuthSession {
  user: User | null;
  role: UserRole | null;
  isDemo: boolean;
}

// ─── Emotions ─────────────────────────────────────────────────────────────────

export type EmotionLabel =
  | 'calm' | 'happy' | 'anxious' | 'sad'
  | 'angry' | 'stressed' | 'energized' | 'neutral';

export interface EmotionEntry {
  id: string;
  userId: string;
  emotion: EmotionLabel;
  intensity: number;    // 1–10
  note?: string;
  recordedAt: string;
}

// ─── Journal ─────────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  body: string;
  tags: string[];
  mood?: EmotionLabel;
  createdAt: string;
  updatedAt: string;
}

// ─── AI Conversation ─────────────────────────────────────────────────────────

export type ConversationMode = 'text' | 'audio' | 'video';
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  audioUrl?: string;   // for audio mode (ElevenLabs)
  videoUrl?: string;   // for video mode (HeyGen)
  timestamp: string;
  isPinned?: boolean;   // Pillar 3: User-controlled memory
}

export interface Conversation {
  id: string;
  userId: string;
  mode: ConversationMode;
  messages: Message[];
  summary?: string;    // AI-generated summary (shown in Insights)
  themes?: string[];   // e.g. ['work stress', 'relationships']
  createdAt: string;
  updatedAt: string;
}

// ─── Sessions (Therapist) ────────────────────────────────────────────────────

export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface TherapySession {
  id: string;
  therapistId: string;
  clientId: string;
  clientName: string;
  date: string;
  durationMin: number;
  status: SessionStatus;
  notes?: string;
  grossAmount: number;
  platformFeeRate: number; // e.g. 0.20 for 20%
}

export interface SessionRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatarUrl?: string;
  requestedAt: string;
  preferredDate: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high';
}

// ─── Therapist ───────────────────────────────────────────────────────────────

export interface TherapistProfile {
  userId: string;
  name: string;        // Added for UI convenience
  avatarUrl?: string;  // Added for UI convenience
  bio: string;
  specialties: string[];
  languages: string[];
  ratePerSession: number;
  rating: number;         // 0–5
  sessionCount: number;
  availability: AvailabilitySlot[];
  isVerified?: boolean; // For ADELI/Diploma badge
}

export interface AvailabilitySlot {
  day: number;   // 0=Sun … 6=Sat
  hour: number;  // 0–23
  available: boolean;
}

// ─── HR / Analytics ─────────────────────────────────────────────────────────

export interface WellbeingTrend {
  week: string;  // ISO date of Monday
  averageScore: number;   // 0–10
  dominantEmotion: EmotionLabel;
  participantCount: number;
}

export interface HeatmapCell {
  day: number;   // 0=Mon … 6=Sun
  hour: number;  // 0–23
  dominantEmotion: EmotionLabel;
  participantCount: number;  // <5 → privacy blur
}

export interface OrgAlert {
  id: string;
  companyId: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface HRSettings {
  companyId: string;
  kAnonymityThreshold: number;  // default 5
  weeklyReportEnabled: boolean;
  alertsEnabled: boolean;
  notificationEmail: string;
}

// ─── Company & Plans ─────────────────────────────────────────────────────────

export type PlanTier = 'free' | 'pro' | 'premium' | 'enterprise';

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  maxUsers?: number;
  isPopular?: boolean;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string;
  planId: string;
  seatCount: number;
  activeEmployees: number;
  status: 'active' | 'trial' | 'suspended';
  createdAt: string;
}

// ─── Resources ───────────────────────────────────────────────────────────────

export type ResourceCategory = 'article' | 'video' | 'exercise' | 'guide';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  tags: string[];
  readingTimeMin: number;
  imageUrl?: string;
  url: string;
}
