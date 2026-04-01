/**
 * lib/mock-data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All fake data used across the app.
 * Replace individual exports with real API calls module by module.
 */

import type {
  JournalEntry, EmotionEntry, Conversation, TherapySession,
  SessionRequest, TherapistProfile, WellbeingTrend, HeatmapCell,
  OrgAlert, HRSettings, Plan, Company, Resource, User, Message,
} from '@/types';

// ─── Journal ─────────────────────────────────────────────────────────────────

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j1', userId: 'demo-consumer',
    title: 'A quiet morning', body: 'Woke up early and felt surprisingly clear-headed. Had a long walk before logging on.',
    tags: ['morning', 'routine'], mood: 'calm',
    createdAt: '2026-03-30T07:45:00Z', updatedAt: '2026-03-30T07:45:00Z',
  },
  {
    id: 'j2', userId: 'demo-consumer',
    title: 'Presentation nerves', body: 'Big quarterly review today. Rehearsed three times. Feeling the pressure but also ready.',
    tags: ['work', 'anxiety'], mood: 'anxious',
    createdAt: '2026-03-28T21:10:00Z', updatedAt: '2026-03-28T21:10:00Z',
  },
  {
    id: 'j3', userId: 'demo-consumer',
    title: 'Weekend with family', body: "Spent Saturday offline. Cooked with my sister. Didn't check Slack once.",
    tags: ['family', 'rest'], mood: 'happy',
    createdAt: '2026-03-23T19:00:00Z', updatedAt: '2026-03-23T19:00:00Z',
  },
];

// ─── Emotion Check-ins ────────────────────────────────────────────────────────

export const MOCK_EMOTION_ENTRIES: EmotionEntry[] = [
  { id: 'e1', userId: 'demo-consumer', emotion: 'calm',      intensity: 7, recordedAt: '2026-03-30T08:00:00Z' },
  { id: 'e2', userId: 'demo-consumer', emotion: 'anxious',   intensity: 6, recordedAt: '2026-03-29T14:00:00Z' },
  { id: 'e3', userId: 'demo-consumer', emotion: 'happy',     intensity: 8, recordedAt: '2026-03-28T09:00:00Z' },
  { id: 'e4', userId: 'demo-consumer', emotion: 'stressed',  intensity: 9, recordedAt: '2026-03-27T17:00:00Z' },
  { id: 'e5', userId: 'demo-consumer', emotion: 'energized', intensity: 7, recordedAt: '2026-03-26T07:00:00Z' },
  { id: 'e6', userId: 'demo-consumer', emotion: 'neutral',   intensity: 5, recordedAt: '2026-03-25T12:00:00Z' },
  { id: 'e7', userId: 'demo-consumer', emotion: 'calm',      intensity: 8, recordedAt: '2026-03-24T20:00:00Z' },
];

// ─── AI Conversation ─────────────────────────────────────────────────────────

export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', role: 'assistant', content: "Hello! I'm here to listen. How are you feeling today?", timestamp: '2026-03-30T09:00:00Z' },
  { id: 'm2', role: 'user',      content: "I've been a bit anxious about an upcoming work deadline.", timestamp: '2026-03-30T09:01:00Z' },
  { id: 'm3', role: 'assistant', content: "That's completely understandable. Deadlines can feel overwhelming. Would you like to explore what's driving that anxiety, or would you prefer some grounding techniques?", timestamp: '2026-03-30T09:01:30Z' },
];

export const MOCK_AI_RESPONSES = [
  "I hear you. It sounds like you're carrying a lot right now.",
  "That takes real courage to acknowledge. Let's unpack it together.",
  "Have you noticed any physical sensations when that feeling arises?",
  "What would feel like a small, manageable step forward for you today?",
  "You're doing the right thing by checking in with yourself.",
];

// ─── Insights ─────────────────────────────────────────────────────────────────

export const MOCK_INSIGHTS = {
  weeklySummary: "This week you showed great self-awareness by checking in daily. Your most frequent emotion was calm (43%), though anxiety spiked on Thursday linked to work themes.",
  themes: ['work stress', 'sleep quality', 'social connection', 'self-compassion'],
  moodTrend: [
    { day: 'Mon', score: 6 }, { day: 'Tue', score: 7 }, { day: 'Wed', score: 5 },
    { day: 'Thu', score: 4 }, { day: 'Fri', score: 6 }, { day: 'Sat', score: 8 }, { day: 'Sun', score: 7 },
  ],
};

// ─── Plans ───────────────────────────────────────────────────────────────────

export const MOCK_PLANS: Plan[] = [
  {
    id: 'plan-free', name: 'Free', tier: 'free',
    priceMonthly: 0, priceAnnual: 0,
    features: ['5 AI conversations/month', 'Basic journal', 'Emotion check-in', 'Text mode only'],
  },
  {
    id: 'plan-pro', name: 'Pro', tier: 'pro',
    priceMonthly: 19, priceAnnual: 179,
    features: ['Unlimited AI conversations', 'Full journal + insights', 'Audio mode', 'Weekly summaries', 'Priority support'],
    isPopular: true,
  },
  {
    id: 'plan-premium', name: 'Premium', tier: 'premium',
    priceMonthly: 49, priceAnnual: 449,
    features: ['Everything in Pro', 'Video avatar (HeyGen)', 'Therapist sessions', 'Advanced analytics', 'Custom avatar voice'],
  },
];

// ─── Resources ───────────────────────────────────────────────────────────────

export const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', title: 'Understanding Workplace Burnout', description: 'Learn the signs and stages of burnout and how to recover.', category: 'article', tags: ['burnout', 'work'], readingTimeMin: 8, url: '#' },
  { id: 'r2', title: '5-Minute Box Breathing', description: 'A guided exercise to calm your nervous system instantly.', category: 'exercise', tags: ['breathing', 'anxiety'], readingTimeMin: 5, url: '#' },
  { id: 'r3', title: 'The Science of Sleep & Mental Health', description: 'How sleep architecture impacts your emotional regulation.', category: 'video', tags: ['sleep', 'science'], readingTimeMin: 12, url: '#' },
  { id: 'r4', title: 'Setting Boundaries at Work', description: 'Practical scripts for protecting your energy without damaging relationships.', category: 'guide', tags: ['boundaries', 'work'], readingTimeMin: 10, url: '#' },
  { id: 'r5', title: 'Cognitive Reframing Techniques', description: 'How to challenge and reframe negative thought patterns.', category: 'article', tags: ['CBT', 'mindset'], readingTimeMin: 7, url: '#' },
  { id: 'r6', title: 'Mindful Movement: Desk Yoga', description: 'A 10-minute sequence you can do without leaving your chair.', category: 'exercise', tags: ['movement', 'mindfulness'], readingTimeMin: 10, url: '#' },
];

// ─── HR Analytics ─────────────────────────────────────────────────────────────

export const MOCK_WELLBEING_TRENDS: WellbeingTrend[] = [
  { week: '2026-03-02', averageScore: 6.8, dominantEmotion: 'calm',    participantCount: 42 },
  { week: '2026-03-09', averageScore: 6.2, dominantEmotion: 'neutral', participantCount: 45 },
  { week: '2026-03-16', averageScore: 5.9, dominantEmotion: 'stressed',participantCount: 48 },
  { week: '2026-03-23', averageScore: 5.4, dominantEmotion: 'anxious', participantCount: 51 },
  { week: '2026-03-30', averageScore: 6.1, dominantEmotion: 'calm',    participantCount: 49 },
];

export const MOCK_HEATMAP: HeatmapCell[] = (() => {
  const emotions = ['calm','happy','anxious','stressed','neutral','energized','sad'] as const;
  const cells: HeatmapCell[] = [];
  // Seeded LCG PRNG for deterministic output (no hydration mismatch)
  let seed = 42;
  function rand() {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  }
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const count = Math.floor(rand() * 12);
      cells.push({
        day, hour,
        dominantEmotion: emotions[Math.floor(rand() * emotions.length)],
        participantCount: count,
      });
    }
  }
  return cells;
})();

export const MOCK_ORG_ALERTS: OrgAlert[] = [
  { id: 'a1', companyId: 'company-1', severity: 'critical', title: 'High stress detected in Engineering', description: '72% of Engineering check-ins over the last 7 days reported stress ≥ 7/10.', createdAt: '2026-03-30T08:00:00Z', acknowledged: false },
  { id: 'a2', companyId: 'company-1', severity: 'warning',  title: 'Anxiety trend rising in Sales',       description: 'Upward anxiety trend for 3 consecutive weeks in the Sales department.', createdAt: '2026-03-28T12:00:00Z', acknowledged: false },
  { id: 'a3', companyId: 'company-1', severity: 'info',     title: 'Wellbeing score improved company-wide', description: 'Average wellbeing score increased from 5.4 → 6.1 this week.', createdAt: '2026-03-30T09:00:00Z', acknowledged: true },
];

export const MOCK_HR_SETTINGS: HRSettings = {
  companyId: 'company-1',
  kAnonymityThreshold: 5,
  weeklyReportEnabled: true,
  alertsEnabled: true,
  notificationEmail: 'morgan.hr@techcorp.com',
};

// ─── Therapist ───────────────────────────────────────────────────────────────

export const MOCK_THERAPIST_PROFILE: TherapistProfile = {
  userId: 'demo-therapist',
  name: 'Dr. Sam Patel',
  avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200',
  bio: 'Specialising in anxiety, burnout, and life transitions. I use an integrative approach drawing from CBT, ACT and mindfulness practices.',
  specialties: ['Anxiety', 'Burnout', 'CBT', 'ACT', 'Mindfulness', 'Life transitions'],
  languages: ['English', 'Hindi'],
  ratePerSession: 120,
  rating: 4.9,
  sessionCount: 847,
  availability: (() => {
    const slots = [];
    for (let day = 1; day <= 5; day++) {
      for (let hour = 9; hour <= 17; hour++) {
        slots.push({ day, hour, available: Math.random() > 0.35 });
      }
    }
    return slots;
  })(),
};

export const MOCK_SESSION_REQUESTS: SessionRequest[] = [
  { id: 'req1', clientId: 'c1', clientName: 'Alex R.', requestedAt: '2026-03-30T10:00:00Z', preferredDate: '2026-04-02T14:00:00Z', topic: 'Work anxiety and burnout', urgency: 'high' },
  { id: 'req2', clientId: 'c2', clientName: 'Jamie L.', requestedAt: '2026-03-29T15:00:00Z', preferredDate: '2026-04-03T10:00:00Z', topic: 'Relationship stress', urgency: 'medium' },
  { id: 'req3', clientId: 'c3', clientName: 'Casey M.', requestedAt: '2026-03-28T11:00:00Z', preferredDate: '2026-04-04T16:00:00Z', topic: 'General anxiety management', urgency: 'low' },
];

export const MOCK_THERAPY_SESSIONS: TherapySession[] = [
  { id: 's1', therapistId: 'demo-therapist', clientId: 'c4', clientName: 'Robin T.', date: '2026-04-01T11:00:00Z', durationMin: 50, status: 'confirmed', grossAmount: 120, platformFeeRate: 0.20 },
  { id: 's2', therapistId: 'demo-therapist', clientId: 'c5', clientName: 'Sam K.',   date: '2026-04-03T14:00:00Z', durationMin: 50, status: 'pending', grossAmount: 120, platformFeeRate: 0.20 },
  { id: 's3', therapistId: 'demo-therapist', clientId: 'c6', clientName: 'Dana P.',  date: '2026-03-28T10:00:00Z', durationMin: 50, status: 'completed', grossAmount: 120, platformFeeRate: 0.20 },
  { id: 's4', therapistId: 'demo-therapist', clientId: 'c7', clientName: 'Ellis J.', date: '2026-03-25T15:00:00Z', durationMin: 50, status: 'completed', grossAmount: 120, platformFeeRate: 0.20 },
  { id: 's5', therapistId: 'demo-therapist', clientId: 'c8', clientName: 'Quinn R.', date: '2026-03-21T13:00:00Z', durationMin: 50, status: 'completed', grossAmount: 120, platformFeeRate: 0.20 },
];

export const MOCK_EARNINGS_DATA = [
  { month: 'Oct', gross: 2160, net: 1728 }, { month: 'Nov', gross: 2400, net: 1920 },
  { month: 'Dec', gross: 1800, net: 1440 }, { month: 'Jan', gross: 2880, net: 2304 },
  { month: 'Feb', gross: 3120, net: 2496 }, { month: 'Mar', gross: 3360, net: 2688 },
];

// ─── Admin ────────────────────────────────────────────────────────────────────

export const MOCK_ALL_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera',   email: 'alex@demo.com',       role: 'consumer',  createdAt: '2026-01-10T00:00:00Z', memoryEnabled: true, memoryRetentionDays: 30 },
  { id: 'u2', name: 'Jordan Kim',    email: 'jordan@techcorp.com', role: 'employee',  companyId: 'company-1', createdAt: '2026-01-15T00:00:00Z', memoryEnabled: true, memoryRetentionDays: 90 },
  { id: 'u3', name: 'Morgan Lee',    email: 'morgan@techcorp.com', role: 'hr',        companyId: 'company-1', createdAt: '2026-01-20T00:00:00Z', memoryEnabled: false },
  { id: 'u4', name: 'Dr. Sam Patel', email: 'sam@therapists.com',  role: 'therapist', createdAt: '2025-11-01T00:00:00Z', memoryEnabled: false },
  { id: 'u5', name: 'Casey M.',      email: 'casey@demo.com',      role: 'consumer',  createdAt: '2026-02-05T00:00:00Z', memoryEnabled: true },
  { id: 'u6', name: 'Robin T.',      email: 'robin@startup.io',    role: 'employee',  companyId: 'company-2', createdAt: '2026-02-14T00:00:00Z', memoryEnabled: true },
  { id: 'u7', name: 'Dana P.',       email: 'dana@acme.com',       role: 'hr',        companyId: 'company-2', createdAt: '2026-02-20T00:00:00Z', memoryEnabled: false },
  { id: 'u8', name: 'Dr. Ellis J.',  email: 'ellis@therapists.com',role: 'therapist', createdAt: '2025-10-01T00:00:00Z', memoryEnabled: false },
];

export const MOCK_COMPANIES: Company[] = [
  { id: 'company-1', name: 'TechCorp',  domain: 'techcorp.com',  planId: 'plan-premium', seatCount: 500,  activeEmployees: 448, status: 'active', createdAt: '2025-09-01T00:00:00Z' },
  { id: 'company-2', name: 'Startup.io',domain: 'startup.io',   planId: 'plan-pro',     seatCount: 50,   activeEmployees: 42,  status: 'active', createdAt: '2026-01-10T00:00:00Z' },
  { id: 'company-3', name: 'Acme Corp', domain: 'acme.com',     planId: 'plan-free',    seatCount: 10,   activeEmployees: 7,   status: 'trial',  createdAt: '2026-03-01T00:00:00Z' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'conv1', userId: 'u1', mode: 'text',  messages: MOCK_MESSAGES, summary: 'Discussed work deadline anxiety and coping strategies.', themes: ['work', 'anxiety'], createdAt: '2026-03-30T09:00:00Z', updatedAt: '2026-03-30T09:15:00Z' },
  { id: 'conv2', userId: 'u5', mode: 'audio', messages: [], summary: 'Explored relationship challenges and setting healthy boundaries.', themes: ['relationships', 'boundaries'], createdAt: '2026-03-29T14:00:00Z', updatedAt: '2026-03-29T14:25:00Z' },
];

export const MOCK_THERAPISTS: TherapistProfile[] = [
  {
    userId: 't1',
    name: 'Dr. Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200&h=200',
    bio: 'Specializing in cognitive behavioral therapy and workplace stress management. 10+ years of experience helping professionals find balance.',
    specialties: ['Anxiety', 'Workplace Stress', 'CBT'],
    languages: ['English', 'Mandarin'],
    ratePerSession: 85,
    rating: 4.9,
    sessionCount: 1240,
    isVerified: true,
    availability: [
       { day: 1, hour: 9, available: true },
       { day: 1, hour: 10, available: true },
       { day: 2, hour: 14, available: true },
    ]
  },
  {
    userId: 't2',
    name: 'Marcus Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    bio: 'Dedicated to helping individuals navigate life transitions and emotional fatigue. Focused on empathetic, person-centered therapy.',
    specialties: ['Grief', 'Relationships', 'Depression'],
    languages: ['English', 'Spanish'],
    ratePerSession: 95,
    rating: 4.8,
    sessionCount: 890,
    isVerified: true,
    availability: [
       { day: 3, hour: 11, available: true },
       { day: 4, hour: 15, available: true },
    ]
  },
  {
    userId: 't3',
    name: 'Elena Rodriguez',
    avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200',
    bio: 'Integrative therapist with a focus on mindfulness and emotional regulation. Passionate about providing a safe space for all.',
    specialties: ['Mindfulness', 'Trauma', 'Self-Esteem'],
    languages: ['English', 'Spanish', 'Portuguese'],
    ratePerSession: 75,
    rating: 5.0,
    sessionCount: 450,
    isVerified: true,
    availability: [
       { day: 5, hour: 10, available: true },
       { day: 5, hour: 11, available: true },
    ]
  }
];
