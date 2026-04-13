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
  DistressRequest, Pole, PoleMember, TherapistNotification, VideoCreditPack,
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

// Opening message only — no fake user turn so new sessions feel genuine
export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'init-1',
    role: 'assistant',
    content: "Bonjour ! Je suis là pour vous écouter. Comment vous sentez-vous aujourd'hui ?",
    timestamp: new Date(0).toISOString(),
  },
];

// MOCK_MESSAGES kept for Storybook / demo purposes only
export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', role: 'assistant', content: "Bonjour ! Je suis l’écoute. Comment vous sentez-vous aujourd’hui ?",                                                                                               timestamp: '2026-03-30T09:00:00Z' },
  { id: 'm2', role: 'user',      content: "I've been a bit anxious about an upcoming work deadline.",                                                                                             timestamp: '2026-03-30T09:01:00Z' },
  { id: 'm3', role: 'assistant', content: "That's completely understandable. Deadlines can feel overwhelming. Would you like to explore what's driving that anxiety, or would you prefer some grounding techniques?", timestamp: '2026-03-30T09:01:30Z' },
];

export const MOCK_AI_RESPONSES = [
  "I hear you. It sounds like you're carrying a lot right now.",
  "That takes real courage to acknowledge. Let's unpack it together.",
  "Have you noticed any physical sensations when that feeling arises?",
  "What would feel like a small, manageable step forward for you today?",
  "You're doing the right thing by checking in with yourself.",
  "Can you tell me more about what triggered that? I'm fully here with you.",
  "It's okay to not have all the answers. Let's just sit with this for a moment.",
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

// ── B2C consumer plans ────────────────────────────────────────────────────────
export const MOCK_PLANS: Plan[] = [
  {
    id: 'plan-free', name: 'Freemium', tier: 'free', audience: 'b2c',
    priceMonthly: 0, priceAnnual: 0,
    videoMinutes: 3,
    features: [
      'Unlimited text',
      'Limited audio',
      '3 video minutes / month',
    ],
  },
  {
    id: 'plan-standard', name: 'Standard', tier: 'standard', audience: 'b2c',
    priceMonthly: 14.90, priceAnnual: 143,
    videoMinutes: 20,
    features: [
      'Unlimited text',
      'Unlimited audio',
      '20 video minutes / month',
    ],
    costEst: 4, marginPct: '70–75%',
  },
  {
    id: 'plan-premium', name: 'Premium', tier: 'premium', audience: 'b2c',
    priceMonthly: 24.90, priceAnnual: 239,
    videoMinutes: 50,
    features: [
      'Unlimited text',
      'Unlimited audio',
      '50 video minutes / month',
    ],
    isPopular: true,
    costEst: 9, marginPct: '60%',
  },
  {
    id: 'plan-pro', name: 'Pro', tier: 'pro', audience: 'b2c',
    priceMonthly: 39.90, priceAnnual: 383,
    videoMinutes: 120,
    features: [
      'Unlimited text',
      'Unlimited audio',
      '120 video minutes / month',
      'Priority access & optimised experience',
    ],
    costEst: 22, marginPct: '45–50%',
  },
];

// ── B2B platform (HR SaaS) plans ──────────────────────────────────────────────
export const MOCK_B2B_PLATFORM_PLANS: Plan[] = [
  {
    id: 'b2b-smb', name: 'SMB', tier: 'standard', audience: 'b2b-platform',
    priceMonthly: 349, priceAnnual: 3351,
    videoMinutes: 0,
    employeeRange: '0–50 employees',
    features: [
      'HR dashboard',
      'Wellbeing analytics',
      'Anonymised employee tracking',
      'Automated alerts',
    ],
  },
  {
    id: 'b2b-mid', name: 'Mid-Market', tier: 'premium', audience: 'b2b-platform',
    priceMonthly: 490, priceAnnual: 4704,
    videoMinutes: 0,
    employeeRange: '50–200 employees',
    isPopular: true,
    features: [
      'Everything in SMB',
      'Weekly reports',
      'Department segmentation',
      'GDPR data export',
    ],
  },
  {
    id: 'b2b-enterprise', name: 'Enterprise', tier: 'pro', audience: 'b2b-platform',
    priceMonthly: 790, priceAnnual: 7584,
    videoMinutes: 0,
    employeeRange: '200+ employees',
    features: [
      'Everything in Mid-Market',
      'Dedicated account manager',
      'Custom HRIS integration',
      'Premium SLA 99.9%',
    ],
  },
];

// ── B2B employee (per-seat) plans ─────────────────────────────────────────────
export const MOCK_B2B_EMPLOYEE_PLANS: Plan[] = [
  {
    id: 'b2b-emp-light', name: 'Light', tier: 'standard', audience: 'b2b-employee',
    priceMonthly: 6, priceAnnual: 58,
    videoMinutes: 5,
    perUnit: '/employee/month',
    features: [
      'Unlimited text',
      'Unlimited audio',
      '5 video min / month',
    ],
    costEst: 1.5, marginPct: '>60%',
  },
  {
    id: 'b2b-emp-standard', name: 'Standard', tier: 'premium', audience: 'b2b-employee',
    priceMonthly: 9, priceAnnual: 86,
    videoMinutes: 15,
    perUnit: '/employee/month',
    isPopular: true,
    features: [
      'Unlimited text',
      'Unlimited audio',
      '15 video min / month',
    ],
    costEst: 3.5, marginPct: '~60%',
  },
  {
    id: 'b2b-emp-premium', name: 'Premium', tier: 'pro', audience: 'b2b-employee',
    priceMonthly: 14, priceAnnual: 134,
    videoMinutes: 30,
    perUnit: '/employee/month',
    features: [
      'Unlimited text',
      'Unlimited audio',
      '30 video min / month',
    ],
    costEst: 5.5, marginPct: '~60%',
  },
];

// ── Video credit top-up packs ─────────────────────────────────────────────────
export const MOCK_VIDEO_CREDIT_PACKS: VideoCreditPack[] = [
  { id: 'pack-xs', label: 'XS', minutes: 10,  price: 4.99,  color: '#10B981' }, // green
  { id: 'pack-s',  label: 'S',  minutes: 25,  price: 9.99,  color: '#0EA5E9' }, // blue
  { id: 'pack-m',  label: 'M',  minutes: 60,  price: 19.99, color: '#9B6FE8' }, // violet
  { id: 'pack-l',  label: 'L',  minutes: 120, price: 34.99, color: '#F59E0B' }, // amber
];

// ─── Resources ───────────────────────────────────────────────────────────────

export const MOCK_RESOURCES: Resource[] = [
  // ── Featured ──────────────────────────────────────────────────────────────
  {
    id: 'r1',
    title: 'Understanding Workplace Burnout',
    description: 'Burnout is not a badge of honour. This in-depth guide covers the three stages of burnout, early warning signs you can self-assess, and a step-by-step recovery framework used by occupational therapists.',
    category: 'article',
    tags: ['burnout', 'work', 'recovery'],
    readingTimeMin: 10,
    url: '#',
    isFeatured: true,
    difficulty: 'beginner',
    keyTakeaways: [
      'Burnout has 3 stages: exhaustion, cynicism, and ineffectiveness — each requiring different interventions.',
      'The single fastest recovery lever is sleep hygiene, not productivity hacks.',
      'Journalling 3 things you completed (not planned) rewires your reward system within 2 weeks.',
    ],
  },
  {
    id: 'r2',
    title: 'Difficult Conversations with Your Manager',
    description: 'A practical script-based guide for navigating conflict, feedback, and salary discussions with your direct manager — without burning the relationship.',
    category: 'guide',
    tags: ['communication', 'conflict', 'manager'],
    readingTimeMin: 12,
    url: '#',
    isFeatured: true,
    difficulty: 'intermediate',
    keyTakeaways: [
      'Use the "SBI" framework (Situation, Behaviour, Impact) to depersonalise difficult feedback.',
      'Ask for a specific outcome before the meeting — vague conversations produce vague results.',
      'Silence after a hard statement is a power move, not an awkward gap.',
    ],
  },
  {
    id: 'r3',
    title: 'Reclaiming Your Energy After a Draining Week',
    description: 'An evidence-based 48-hour reset protocol designed for people in high-demand roles. Combines sleep science, nutrition, movement, and social recovery.',
    category: 'guide',
    tags: ['recovery', 'energy', 'weekend'],
    readingTimeMin: 8,
    url: '#',
    isFeatured: true,
    difficulty: 'beginner',
    keyTakeaways: [
      'The first 90 minutes of your morning set your cortisol rhythm for the entire day.',
      'One hour of non-screen social time is more restorative than 3 hours of passive entertainment.',
      'Cold-to-warm water contrast showers reduce muscle tension by up to 40% in 10 minutes.',
    ],
  },

  // ── Exercises ─────────────────────────────────────────────────────────────
  {
    id: 'r4',
    title: '5-Minute Box Breathing',
    description: 'The same technique used by Navy SEALs to control performance anxiety. Inhale 4s, hold 4s, exhale 4s, hold 4s. Works in any meeting room.',
    category: 'exercise',
    tags: ['breathing', 'anxiety', 'quick-win'],
    readingTimeMin: 5,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Activates the parasympathetic nervous system within 60 seconds.',
      'Reduces cortisol measurably after just 4 cycles.',
      'Can be done invisibly at your desk — no one will know.',
    ],
  },
  {
    id: 'r5',
    title: 'Mindful Movement: Desk Yoga',
    description: 'A 10-minute chair-based yoga sequence that relieves neck tension, lower back pain, and mental fog — no mat or special clothing required.',
    category: 'exercise',
    tags: ['movement', 'mindfulness', 'posture'],
    readingTimeMin: 10,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Reduces screen-related neck tension by 60% when done three times a week.',
      'The seated forward fold activates the vagus nerve, triggering a calm state.',
      'Pair with a Pomodoro break for maximum cognitive restoration.',
    ],
  },
  {
    id: 'r6',
    title: 'Progressive Muscle Relaxation (PMR)',
    description: 'A clinical technique for releasing physical stress held in the body. Works by tensing and releasing muscle groups from feet to face. Excellent before high-stakes presentations.',
    category: 'exercise',
    tags: ['relaxation', 'stress', 'body'],
    readingTimeMin: 8,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Directly lowers blood pressure within a single 10-minute session.',
      'More effective than meditation for people who "can\'t quiet their mind."',
      'Combines powerfully with box breathing for pre-performance anxiety.',
    ],
  },
  {
    id: 'r7',
    title: 'Emotional Regulation: The STOP Technique',
    description: 'A CBT-based micro-practice for reactive moments: Stop, Take a breath, Observe, Proceed with awareness. Prevents emotional hijacking in real-time.',
    category: 'exercise',
    tags: ['CBT', 'emotions', 'quick-win'],
    readingTimeMin: 4,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Inserts a 6-second pause between stimulus and response — enough to engage the prefrontal cortex.',
      'Reduces regrettable emails, snappy replies, and meeting blow-ups.',
      'Use it when you notice your jaw clenching — that\'s your body\'s first warning sign.',
    ],
  },

  // ── Articles ──────────────────────────────────────────────────────────────
  {
    id: 'r8',
    title: 'The Science of Sleep & Mental Health',
    description: 'How sleep architecture — REM cycles, sleep debt, and chronotype — directly controls your emotional regulation, decision quality, and stress resilience the next day.',
    category: 'article',
    tags: ['sleep', 'science', 'performance'],
    readingTimeMin: 12,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      'Sleep debt of 6 hours degrades cognitive performance equivalent to legal intoxication.',
      'REM sleep is the brain\'s emotional processing cycle — skipping it amplifies next-day reactivity.',
      'A consistent wake time (even weekends) is more impactful than a consistent bedtime.',
    ],
  },
  {
    id: 'r9',
    title: 'Cognitive Reframing: Change the Story, Change the Feeling',
    description: 'How to identify distorted thought patterns (catastrophising, all-or-nothing thinking) and replace them with more accurate, balanced interpretations using CBT techniques.',
    category: 'article',
    tags: ['CBT', 'mindset', 'thoughts'],
    readingTimeMin: 9,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      '"My boss ignored me" → "My boss is distracted". Same fact, different suffering.',
      'The cognitive triangle: thoughts drive emotions which drive behaviours — change one, all shift.',
      'Write the thought down — externalising it reduces its power by up to 50%.',
    ],
  },
  {
    id: 'r10',
    title: 'Introvert Energy Management at Work',
    description: 'For introverts in open-plan offices or back-to-back meeting cultures: how to architect your day around social recovery and protect deep work time without seeming antisocial.',
    category: 'article',
    tags: ['introvert', 'energy', 'work'],
    readingTimeMin: 8,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Block 30 minutes of "decompression" after any meeting-heavy morning — schedule it like a task.',
      'Asynchronous communication is not laziness — it\'s introvert performance optimisation.',
      'Decline at-will: "I\'d love to — can I check in by Thursday?" buys you real thinking time.',
    ],
  },
  {
    id: 'r11',
    title: 'Psychosocial Risks in the Workplace (DUERP)',
    description: 'A clear explanation of the French legal framework for psychosocial risk prevention, what it means for employees, and how to raise concerns through official channels.',
    category: 'article',
    tags: ['legal', 'rights', 'workplace'],
    readingTimeMin: 7,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Every employer with 1+ employee is legally required to assess psychosocial risks annually.',
      'Moral harassment (harcèlement moral) is a criminal offence under French labour code.',
      'You have the right to flag a risk situation without prior management approval.',
    ],
  },
  {
    id: 'r12',
    title: 'Managing Up: Building a Better Relationship with a Difficult Manager',
    description: 'Research-backed techniques for improving the dynamic with a challenging boss — from understanding their motivations to structuring interactions that work for both of you.',
    category: 'article',
    tags: ['manager', 'relationships', 'communication'],
    readingTimeMin: 11,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      'Understand your manager\'s main pressure — most difficult behaviour is fear-driven, not malicious.',
      'Pre-adapt your communication style to their preference (visual, data, narrative).',
      '\"Managing up\" is not manipulation — it\'s making collaboration work for everyone.',
    ],
  },

  // ── Guides ────────────────────────────────────────────────────────────────
  {
    id: 'r13',
    title: 'Setting Boundaries at Work Without Damaging Relationships',
    description: 'Practical scripts for the most common boundary scenarios: last-minute requests, after-hours messages, scope creep, and toxic positivity. Real phrases you can use tomorrow.',
    category: 'guide',
    tags: ['boundaries', 'work', 'assertiveness'],
    readingTimeMin: 10,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      '"I can take this on — which of my current priorities should I deprioritise?" is a full-stop boundary.',
      'Boundary violations repeat until there is a consequence — kindness without limits is not kindness.',
      'Boundaries are not about the other person changing; they\'re about what you will do differently.',
    ],
  },
  {
    id: 'r14',
    title: 'Your First Therapy Session: What to Expect',
    description: 'A demystifying guide for anyone considering therapy for the first time. Covers what types of therapy exist, what the first session looks like, and how to choose the right therapist.',
    category: 'guide',
    tags: ['therapy', 'first-steps', 'mental-health'],
    readingTimeMin: 8,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'The therapeutic alliance (your relationship with your therapist) predicts 30% of outcomes.',
      'The first session is mutual — you\'re also interviewing them.',
      'Therapy works faster when you do micro-reflections between sessions.',
    ],
  },
  {
    id: 'r15',
    title: 'Digital Detox at Work: A 7-Day Reset',
    description: 'A week-long programme to reduce notification anxiety, email reactivity, and social media doom-scrolling — while staying effective and connected at work.',
    category: 'guide',
    tags: ['digital', 'attention', 'focus'],
    readingTimeMin: 9,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Checking email fewer than 3 times a day reduces stress 38% (Gloria Mark, UCI research).',
      'Notification-off = async communication is not possible — it requires explicit team agreement.',
      'Day 1: put your phone in a drawer during lunch. That\'s it. Start there.',
    ],
  },
  {
    id: 'r16',
    title: 'Conflict Resolution at Work: The Harvard Method',
    description: 'Harvard\'s principled negotiation framework applied to workplace conflict — focusing on interests, not positions, to find durable resolutions that both parties can live with.',
    category: 'guide',
    tags: ['conflict', 'negotiation', 'relationships'],
    readingTimeMin: 13,
    url: '#',
    difficulty: 'advanced',
    keyTakeaways: [
      'Separate the person from the problem — attack the issue, not the individual.',
      'Ask "why" behind their position to reveal the underlying interest you can both satisfy.',
      'Invent options for mutual gain before committing to a position.',
    ],
  },

  // ── Videos ────────────────────────────────────────────────────────────────
  {
    id: 'r17',
    title: 'TED Talk: The Power of Vulnerability — Brené Brown',
    description: 'One of the most watched TED talks of all time. Brown\'s research on shame, vulnerability, and connection has helped millions of people reduce perfectionism and reconnect with themselves and others.',
    category: 'video',
    tags: ['vulnerability', 'shame', 'connection'],
    readingTimeMin: 20,
    url: 'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability',
    difficulty: 'beginner',
    keyTakeaways: [
      'Vulnerability is not weakness — it is the birthplace of creativity, belonging and joy.',
      'Numbing vulnerability also numbs joy — you cannot selectively numb emotions.',
      'Wholehearted people lean into imperfection; perfectionists protect against shame.',
    ],
  },
  {
    id: 'r18',
    title: 'Guided Body Scan Meditation (20 min)',
    description: 'A structured body scan meditation for deep stress release, guided by a clinical psychologist. Ideal for end of workday or before sleep. No experience required.',
    category: 'video',
    tags: ['meditation', 'sleep', 'body'],
    readingTimeMin: 20,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Body scan is clinically proven to reduce symptoms of anxiety and insomnia.',
      'Different from mindfulness meditation — no focus on breath, only body sensation.',
      'Use headphones and a lying-down position for maximum effect.',
    ],
  },
  {
    id: 'r19',
    title: 'Workplace Communication Masterclass (3 episodes)',
    description: 'A video series covering non-violent communication (NVC), active listening, and giving feedback like a coach. Based on Marshall Rosenberg\'s framework adapted for corporate environments.',
    category: 'video',
    tags: ['communication', 'NVC', 'leadership'],
    readingTimeMin: 45,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      'NVC separates observation from evaluation — "you\'re always late" vs "you arrived 15 min after 9am."',
      'Active listening is not waiting to speak — it\'s suspending your internal narrative entirely.',
      'The coaching question "What do you need?" shifts conversations from complaint to action.',
    ],
  },
  {
    id: 'r20',
    title: 'Understanding Stress: Your Brain on Cortisol',
    description: 'A neuroscience explainer on how chronic stress physically reshapes the brain, why stress feels addictive, and the 4 fastest science-backed ways to reset your stress response.',
    category: 'video',
    tags: ['neuroscience', 'stress', 'science'],
    readingTimeMin: 18,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      'Chronic cortisol literally shrinks the hippocampus — the memory and learning centre.',
      'The stress response evolved for 90-second threats, not 90-day projects.',
      'Cold water, intense exercise, and deep laughter are the fastest cortisol-clearing tools.',
    ],
  },
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
  {
    id: 'req1', clientId: 'c1', clientName: 'Alex R.', requestedAt: '2026-04-13T08:00:00Z',
    preferredDate: '2026-04-14T14:00:00Z', topic: 'Work anxiety and burnout', urgency: 'high',
    expiresAt: '2026-04-14T08:00:00Z',
  },
  {
    id: 'req2', clientId: 'c2', clientName: 'Jamie L.', requestedAt: '2026-04-12T15:00:00Z',
    preferredDate: '2026-04-15T10:00:00Z', topic: 'Relationship stress', urgency: 'medium',
    expiresAt: '2026-04-13T15:00:00Z',
  },
  {
    id: 'req3', clientId: 'c3', clientName: 'Casey M.', requestedAt: '2026-04-13T11:00:00Z',
    preferredDate: '2026-04-16T16:00:00Z', topic: 'General anxiety management', urgency: 'low',
    expiresAt: '2026-04-14T11:00:00Z',
  },
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

// ─── Distress Requests ─────────────────────────────────────────────────────────────

export const MOCK_DISTRESS_REQUESTS: DistressRequest[] = [
  {
    id: 'dr1', employeeId: 'u2', employeeName: 'Jordan Kim', employeeEmail: 'jordan@techcorp.com',
    category: 'time_off',
    note: "I've been feeling really overwhelmed this week and I think a mental health day would help me reset. Could we discuss?",
    submittedAt: '2026-04-13T09:30:00Z', status: 'pending', acknowledged: false,
  },
  {
    id: 'dr2', employeeId: 'u6', employeeName: 'Robin T.', employeeEmail: 'robin@startup.io',
    category: 'overload',
    note: 'I have 4 projects due this week and I\'m struggling to prioritise. I need some help figuring out what to push back.',
    submittedAt: '2026-04-11T14:00:00Z', status: 'in_progress', acknowledged: true,
  },
];

// ─── HR Department Poles ──────────────────────────────────────────────────────────

export const MOCK_POLES: Pole[] = [
  { id: 'pole-1', companyId: 'company-1', name: 'Commercial', color: '#7C3AED', emoji: '💼', memberCount: 18, createdAt: '2026-02-01T00:00:00Z', createdBy: 'u3' },
  { id: 'pole-2', companyId: 'company-1', name: 'Tech & Engineering', color: '#0EA5E9', emoji: '⚙️', memberCount: 32, createdAt: '2026-02-01T00:00:00Z', createdBy: 'u3' },
  { id: 'pole-3', companyId: 'company-1', name: 'Operations', color: '#F59E0B', emoji: '📦', memberCount: 15, createdAt: '2026-02-15T00:00:00Z', createdBy: 'u3' },
  { id: 'pole-4', companyId: 'company-1', name: 'R&D', color: '#10B981', emoji: '🔬', memberCount: 11, createdAt: '2026-03-01T00:00:00Z', createdBy: 'u3' },
];

export const MOCK_POLE_MEMBERS: PoleMember[] = [
  { poleId: 'pole-1', userId: 'u2', userName: 'Jordan Kim',    userEmail: 'jordan@techcorp.com', addedAt: '2026-02-01T00:00:00Z' },
  { poleId: 'pole-2', userId: 'u6', userName: 'Robin T.',      userEmail: 'robin@startup.io',   addedAt: '2026-02-01T00:00:00Z' },
  { poleId: 'pole-3', userId: 'u5', userName: 'Casey M.',      userEmail: 'casey@demo.com',     addedAt: '2026-02-15T00:00:00Z' },
];

// ─── Therapist Notifications ───────────────────────────────────────────────────────────

export const MOCK_THERAPIST_NOTIFICATIONS: TherapistNotification[] = [
  { id: 'tn1', type: 'new_request', title: 'New session request', body: 'Alex R. has requested a session on April 14 at 14:00.', createdAt: '2026-04-13T08:00:00Z', read: false, actionUrl: '/therapist/requests' },
  { id: 'tn2', type: 'session_reminder', title: 'Session in 1 hour', body: 'Your session with Robin T. starts at 11:00.', createdAt: '2026-04-01T10:00:00Z', read: false, actionUrl: '/therapist/sessions' },
  { id: 'tn3', type: 'request_expired', title: 'Request expired — auto-reassigned', body: 'The request from Jamie L. expired after 24h and was forwarded to Dr. Elena Rodriguez.', createdAt: '2026-04-13T15:00:00Z', read: false, actionUrl: '/therapist/requests' },
  { id: 'tn4', type: 'system', title: 'Weekly summary ready', body: 'Your earnings report for the week of April 7 is now available.', createdAt: '2026-04-07T09:00:00Z', read: true, actionUrl: '/therapist/earnings' },
];

// ─── Weekly Heatmap (day × week) ────────────────────────────────────────────────────────

/** Day-level aggregates (no hour dimension) for the simplified heatmap */
export type DayHeatCell = {
  day: number;           // 0=Mon … 6=Sun
  averageScore: number;  // 0–10
  dominantEmotion: string;
  participantCount: number;
  week?: number;          // 0=this week, 1=last week, 2=2 weeks ago, 3=3 weeks ago
};

export const MOCK_DAY_HEATMAP: DayHeatCell[] = (() => {
  const emotions = ['calm','happy','anxious','stressed','neutral','energized','sad'] as const;
  const cells: DayHeatCell[] = [];
  let seed = 99;
  function rand() { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; }
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      cells.push({
        day, week,
        averageScore: 4 + Math.round(rand() * 5 * 10) / 10,
        dominantEmotion: emotions[Math.floor(rand() * emotions.length)],
        participantCount: 5 + Math.floor(rand() * 40),
      });
    }
  }
  return cells;
})();

/** Per-pole heatmap data — each pole has its own DayHeatCell[] so HR can filter by department */
export const MOCK_POLE_DAY_HEATMAP: Record<string, DayHeatCell[]> = (() => {
  const emotions = ['calm','happy','anxious','stressed','neutral','energized','sad'] as const;
  const poleSeeds: Record<string, number> = {
    'pole-1': 42,
    'pole-2': 777,
    'pole-3': 314,
    'pole-4': 191,
  };

  // Helper — returns a closure over its own seed so each pole is independent
  function makePrng(initSeed: number) {
    let seed = initSeed;
    return () => { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; };
  }

  const result: Record<string, DayHeatCell[]> = {};
  for (const [poleId, initSeed] of Object.entries(poleSeeds)) {
    const rand = makePrng(initSeed);
    const cells: DayHeatCell[] = [];
    const baseCount = poleId === 'pole-2' ? 32 : poleId === 'pole-1' ? 18 : poleId === 'pole-3' ? 15 : 11;
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        const count = Math.max(0, Math.floor(baseCount * (0.4 + rand() * 0.7)));
        cells.push({
          day, week,
          averageScore: 3.5 + Math.round(rand() * 5.5 * 10) / 10,
          dominantEmotion: emotions[Math.floor(rand() * emotions.length)],
          participantCount: count,
        });
      }
    }
    result[poleId] = cells;
  }
  return result;
})();


