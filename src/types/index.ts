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

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'other';
  sizeBytes: number;
  url: string; // object URL or CDN URL
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  audioUrl?: string;   // for audio mode (ElevenLabs) or voice note blob
  videoUrl?: string;   // for video mode (HeyGen)
  timestamp: string;
  isPinned?: boolean;   // Pillar 3: User-controlled memory
  isVoiceNote?: boolean; // recorded voice note in text mode
  attachments?: MessageAttachment[];
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
  /** ISO timestamp — auto-expires 24h after requestedAt */
  expiresAt: string;
  /** Set when auto-reassigned to another therapist after expiry */
  reassignedTo?: string;
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
  /** Additional notification emails (multi-recipient) */
  notificationEmails: string[];
  /** How often reports are sent */
  reportFrequency: 'daily' | 'weekly' | 'monthly';
}

// ─── Company & Plans ─────────────────────────────────────────────────────────

export type PlanTier = 'free' | 'standard' | 'premium' | 'pro';
export type PlanAudience = 'b2c' | 'b2b-platform' | 'b2b-employee';

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  audience: PlanAudience;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  videoMinutes: number | 'unlimited'; // minutes per month
  maxUsers?: number;
  isPopular?: boolean;
  /** For B2B platform plans: employee range label e.g. '0–50' */
  employeeRange?: string;
  /** For B2B per-seat plans: label shown under price */
  perUnit?: string;
  /** Cost estimate shown internally for margin tracking */
  costEst?: number;
  marginPct?: string;
}

export interface VideoCreditPack {
  id: string;
  label: string;          // XS / S / M / L
  minutes: number;
  price: number;          // in €
  color: string;          // Tailwind/CSS accent
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
export type ResourceDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  tags: string[];
  readingTimeMin: number;
  imageUrl?: string;
  url: string;
  /** Shown in the featured row at the top */
  isFeatured?: boolean;
  /** Skill level signal for the user */
  difficulty?: ResourceDifficulty;
  /** 2–3 bullet takeaways shown on hover / expanded card */
  keyTakeaways?: string[];
}

// ─── Employee Distress Requests ───────────────────────────────────────────────

export type DistressCategory =
  | 'wellbeing'      // Not feeling well, need mental health support
  | 'time_off'       // Need a day / half-day off
  | 'speak_hr'       // Want to speak with HR about something personal
  | 'overload'       // Work overload, need help prioritising
  | 'urgent'         // Urgent situation requiring immediate support
  | 'other';         // Free text

export interface DistressRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  category: DistressCategory;
  /** Employee's own words — shown verbatim to HR (explicit consent given) */
  note?: string;
  submittedAt: string;
  status: 'pending' | 'in_progress' | 'resolved';
  acknowledged: boolean;
}

// ─── HR Department Poles ──────────────────────────────────────────────────────

export interface Pole {
  id: string;
  companyId: string;
  name: string;
  color: string;      // hex color for visual identity
  emoji: string;      // single emoji icon
  memberCount: number;
  createdAt: string;
  createdBy: string;  // HR manager userId
}

export interface PoleMember {
  poleId: string;
  userId: string;
  userName: string;
  userEmail: string;
  addedAt: string;
}

// ─── Therapist Notifications ──────────────────────────────────────────────────

export type NotificationType = 'new_request' | 'session_reminder' | 'request_expired' | 'system';

export interface TherapistNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}
