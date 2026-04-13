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
    title: 'Un matin calme', body: 'Levé tôt, esprit étonnamment clair. Grande promenade avant de commencer la journée.',
    tags: ['matin', 'routine'], mood: 'calm',
    createdAt: '2026-03-30T07:45:00Z', updatedAt: '2026-03-30T07:45:00Z',
  },
  {
    id: 'j2', userId: 'demo-consumer',
    title: 'Trac avant la présentation', body: 'Grande revue trimestrielle aujourd'hui. Répété trois fois. Je sens la pression mais je suis prêt.',
    tags: ['travail', 'anxiété'], mood: 'anxious',
    createdAt: '2026-03-28T21:10:00Z', updatedAt: '2026-03-28T21:10:00Z',
  },
  {
    id: 'j3', userId: 'demo-consumer',
    title: 'Week-end en famille', body: "Samedi sans écran. Cuisinés avec ma sœur. N'ai pas ouvert Slack une seule fois.",
    tags: ['famille', 'repos'], mood: 'happy',
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
  { id: 'm1', role: 'assistant', content: "Bonjour ! Je suis là pour vous écouter. Comment vous sentez-vous aujourd'hui ?",                                                                                               timestamp: '2026-03-30T09:00:00Z' },
  { id: 'm2', role: 'user',      content: "Je suis un peu anxieux à propos d'une échéance professionnelle qui approche.",                                                                            timestamp: '2026-03-30T09:01:00Z' },
  { id: 'm3', role: 'assistant', content: "C'est tout à fait compréhensible. Les échéances peuvent être écrasantes. Voulez-vous explorer ce qui alimente cette anxiété, ou préférez-vous quelques techniques d'ancrage ?", timestamp: '2026-03-30T09:01:30Z' },
];

export const MOCK_AI_RESPONSES = [
  "Je vous entends. Il semble que vous portez beaucoup en ce moment.",
  "Cela demande un vrai courage de le reconnaître. Explorons ça ensemble.",
  "Avez-vous remarqué des sensations physiques lorsque ce sentiment surgit ?",
  "Quel serait un petit pas gérable vers l'avant pour vous aujourd'hui ?",
  "Vous faites la bonne chose en prenant soin de vous.",
  "Pouvez-vous m'en dire plus sur ce qui a déclenché ça ? Je suis entièrement là pour vous.",
  "Il est normal de ne pas avoir toutes les réponses. Permettons-nous juste d'être avec ça un moment.",
];

// ─── Insights ─────────────────────────────────────────────────────────────────

export const MOCK_INSIGHTS = {
  weeklySummary: "Cette semaine, vous avez fait preuve d'une grande conscience de vous-même en faisant un bilan chaque jour. Votre émotion la plus fréquente était le calme (43 %), bien que l'anxiété ait culminé jeudi autour de thèmes professionnels.",
  themes: ['stress professionnel', 'qualité du sommeil', 'lien social', 'bienveillance envers soi'],
  moodTrend: [
    { day: 'Lun', score: 6 }, { day: 'Mar', score: 7 }, { day: 'Mer', score: 5 },
    { day: 'Jeu', score: 4 }, { day: 'Ven', score: 6 }, { day: 'Sam', score: 8 }, { day: 'Dim', score: 7 },
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
      'Texte illimité',
      'Audio limité',
      '3 minutes vidéo / mois',
    ],
  },
  {
    id: 'plan-standard', name: 'Standard', tier: 'standard', audience: 'b2c',
    priceMonthly: 14.90, priceAnnual: 143,
    videoMinutes: 20,
    features: [
      'Texte illimité',
      'Audio illimité',
      '20 minutes vidéo / mois',
    ],
    costEst: 4, marginPct: '70–75%',
  },
  {
    id: 'plan-premium', name: 'Premium', tier: 'premium', audience: 'b2c',
    priceMonthly: 24.90, priceAnnual: 239,
    videoMinutes: 50,
    features: [
      'Texte illimité',
      'Audio illimité',
      '50 minutes vidéo / mois',
    ],
    isPopular: true,
    costEst: 9, marginPct: '60%',
  },
  {
    id: 'plan-pro', name: 'Pro', tier: 'pro', audience: 'b2c',
    priceMonthly: 39.90, priceAnnual: 383,
    videoMinutes: 120,
    features: [
      'Texte illimité',
      'Audio illimité',
      '120 minutes vidéo / mois',
      'Accès prioritaire & expérience optimisée',
    ],
    costEst: 22, marginPct: '45–50%',
  },
];

// ── B2B platform (HR SaaS) plans ──────────────────────────────────────────────
export const MOCK_B2B_PLATFORM_PLANS: Plan[] = [
  {
    id: 'b2b-smb', name: 'PME', tier: 'standard', audience: 'b2b-platform',
    priceMonthly: 349, priceAnnual: 3351,
    videoMinutes: 0,
    employeeRange: '0–50 employés',
    features: [
      'Tableau de bord RH',
      'Analytiques bien-être',
      'Suivi anonymisé des employés',
      'Alertes automatiques',
    ],
  },
  {
    id: 'b2b-mid', name: 'Intermédiaire', tier: 'premium', audience: 'b2b-platform',
    priceMonthly: 490, priceAnnual: 4704,
    videoMinutes: 0,
    employeeRange: '50–200 employés',
    isPopular: true,
    features: [
      'Tout ce qui est dans PME',
      'Rapports hebdomadaires',
      'Segmentation par département',
      'Export de données RGPD',
    ],
  },
  {
    id: 'b2b-enterprise', name: 'Entreprise', tier: 'pro', audience: 'b2b-platform',
    priceMonthly: 790, priceAnnual: 7584,
    videoMinutes: 0,
    employeeRange: '200+ employés',
    features: [
      'Tout ce qui est dans Intermédiaire',
      'Chargé de compte dédié',
      'Intégration SIRH personnalisée',
      'SLA Premium 99,9 %',
    ],
  },
];

// ── B2B employee (per-seat) plans ─────────────────────────────────────────────
export const MOCK_B2B_EMPLOYEE_PLANS: Plan[] = [
  {
    id: 'b2b-emp-light', name: 'Essentiel', tier: 'standard', audience: 'b2b-employee',
    priceMonthly: 6, priceAnnual: 58,
    videoMinutes: 5,
    perUnit: '/employé/mois',
    features: [
      'Texte illimité',
      'Audio illimité',
      '5 min vidéo / mois',
    ],
    costEst: 1.5, marginPct: '>60%',
  },
  {
    id: 'b2b-emp-standard', name: 'Standard', tier: 'premium', audience: 'b2b-employee',
    priceMonthly: 9, priceAnnual: 86,
    videoMinutes: 15,
    perUnit: '/employé/mois',
    isPopular: true,
    features: [
      'Texte illimité',
      'Audio illimité',
      '15 min vidéo / mois',
    ],
    costEst: 3.5, marginPct: '~60%',
  },
  {
    id: 'b2b-emp-premium', name: 'Premium', tier: 'pro', audience: 'b2b-employee',
    priceMonthly: 14, priceAnnual: 134,
    videoMinutes: 30,
    perUnit: '/employé/mois',
    features: [
      'Texte illimité',
      'Audio illimité',
      '30 min vidéo / mois',
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
  // ── À la une ───────────────────────────────────────────────────────────────
  {
    id: 'r1',
    title: 'Comprendre le burn-out professionnel',
    description: 'Le burn-out n’est pas une marque de courage. Ce guide approfondi couvre les trois stades du burn-out, les signes précurseurs que vous pouvez auto-évaluer, et un plan de récupération étape par étape utilisé par des thérapeutes du travail.',
    category: 'article',
    tags: ['burn-out', 'travail', 'récupération'],
    readingTimeMin: 10,
    url: '#',
    isFeatured: true,
    difficulty: 'beginner',
    keyTakeaways: [
      'Le burn-out comporte 3 stades : épuisement, cynisme et inefficacité — chacun requière une intervention différente.',
      'Le levier de récupération le plus rapide est l’hygiène du sommeil, pas les hacks de productivité.',
      'Noter 3 choses accomplies (pas planifiées) reconfigure votre système de récompense en 2 semaines.',
    ],
  },
  {
    id: 'r2',
    title: 'Les conversations difficiles avec votre manager',
    description: 'Un guide pratique basé sur des scripts pour naviguer les conflits, les retours et les discussions salariales avec votre responsable direct — sans abimer la relation.',
    category: 'guide',
    tags: ['communication', 'conflit', 'manager'],
    readingTimeMin: 12,
    url: '#',
    isFeatured: true,
    difficulty: 'intermediate',
    keyTakeaways: [
      'Utilisez le cadre « SCI » (Situation, Comportement, Impact) pour dépersonnaliser les feedbacks difficiles.',
      'Demandez un résultat précis avant la réunion — les conversations vagues produisent des résultats vagues.',
      'Le silence après une déclaration difficile est une posture de force, pas un moment gênant.',
    ],
  },
  {
    id: 'r3',
    title: 'Retrouver son énergie après une semaine épuisante',
    description: 'Un protocole de remise à zéro de 48h basé sur des preuves, conçu pour les personnes dans des rôles à haute demande. Combine science du sommeil, nutrition, mouvement et récupération sociale.',
    category: 'guide',
    tags: ['récupération', 'énergie', 'week-end'],
    readingTimeMin: 8,
    url: '#',
    isFeatured: true,
    difficulty: 'beginner',
    keyTakeaways: [
      'Les 90 premières minutes de votre matin fixent le rythme cortisol pour toute la journée.',
      'Une heure de socialisation sans écran est plus restauratrice que 3 heures de divertissement passif.',
      'Les douches contraste froid-chaud réduisent les tensions musculaires de 40 % en 10 minutes.',
    ],
  },

  // ── Exercices ────────────────────────────────────────────────────────────────────
  {
    id: 'r4',
    title: 'Respiration carrée en 5 minutes',
    description: 'La même technique utilisée par les forces spéciales pour contrôler l’anxiété en performance. Inspirez 4s, retenez 4s, expirez 4s, retenez 4s. Fonctionne dans n’importe quelle salle de réunion.',
    category: 'exercise',
    tags: ['respiration', 'anxiété', 'quick-win'],
    readingTimeMin: 5,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Active le système nerveux parasympathique en moins de 60 secondes.',
      'Réduit le cortisol de façon mesurable après seulement 4 cycles.',
      'Peut se pratiquer discrètement à votre bureau — personne ne le saura.',
    ],
  },
  {
    id: 'r5',
    title: 'Mouvement conscient : yoga au bureau',
    description: 'Une séquence de yoga de 10 minutes sur chaise qui soulève les tensions dans le cou, les lombaires et le brouillard mental — sans tapis ni tenue spéciale.',
    category: 'exercise',
    tags: ['mouvement', 'pleine-conscience', 'posture'],
    readingTimeMin: 10,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Réduit de 60 % les tensions cervicales liées aux écrans pratiquée trois fois par semaine.',
      'La flexion avant assise active le nerf vague, induisant un état de calme.',
      'Combinez avec une pause Pomodoro pour une restauration cognitive maximale.',
    ],
  },
  {
    id: 'r6',
    title: 'Relaxation musculaire progressive (RMP)',
    description: 'Une technique clinique pour libérer le stress physique ancré dans le corps. Consiste à contracter puis relâcher les groupes musculaires des pieds au visage. Excellent avant les présentations à enjeux.',
    category: 'exercise',
    tags: ['relaxation', 'stress', 'corps'],
    readingTimeMin: 8,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Abaisse directement la pression artérielle dès la première séance de 10 minutes.',
      'Plus efficace que la méditation pour les personnes qui « n’arrivent pas à faire le vide ».',
      'Se combine parfaitement avec la respiration carrée avant un événement stressant.',
    ],
  },
  {
    id: 'r7',
    title: 'Régulation émotionnelle : la technique STOP',
    description: 'Une micro-pratique basée sur la TCC pour les moments réactifs : Stop, Temps de respiration, Observation, Poursuite avec conscience. Prévient le détournement émotionnel en temps réel.',
    category: 'exercise',
    tags: ['TCC', 'émotions', 'quick-win'],
    readingTimeMin: 4,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Insère une pause de 6 secondes entre stimulus et réponse — suffisant pour engager le cortex préfrontal.',
      'Réduit les e-mails regrettables, les répliques vives et les éclats en réunion.',
      'Utilisez-le quand vous sentez votre mâchoire se contracter — premier signal d’alarme du corps.',
    ],
  },

  // ── Articles ────────────────────────────────────────────────────────────────────
  {
    id: 'r8',
    title: 'La science du sommeil et de la santé mentale',
    description: 'Comment l’architecture du sommeil — cycles REM, dette de sommeil et chronotype — contrôle directement votre régulation émotionnelle, la qualité de vos décisions et votre résilience au stress le lendemain.',
    category: 'article',
    tags: ['sommeil', 'science', 'performance'],
    readingTimeMin: 12,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      'Une dette de sommeil de 6 heures dégrade les performances cognitives autant qu’un état d’ivresse légale.',
      'Le sommeil REM est le cycle de traitement émotionnel du cerveau — le sauter amplifie la réactivité du lendemain.',
      'Une heure de réveil constante (même le week-end) est plus impactante qu’une heure de coucher fixée.',
    ],
  },
  {
    id: 'r9',
    title: 'Recadrage cognitif : changer la narration pour changer le ressenti',
    description: 'Comment identifier les schémas de pensée déformés (catastrophisme, pensée tout-ou-rien) et les remplacer par des interprétations plus précises et équilibrées grâce aux techniques TCC.',
    category: 'article',
    tags: ['TCC', 'mindset', 'pensées'],
    readingTimeMin: 9,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      '« Mon chef m’a ignoré » → « Mon chef était distrait ». Même fait, souffrance différente.',
      'Le triangle cognitif : les pensées influencent les émotions qui influencent les comportements — changez-en un, tout bouge.',
      'Écrivez la pensée — l’extérioriser réduit son emprise jusqu’à 50 %.',
    ],
  },
  {
    id: 'r10',
    title: 'Gérer son énergie d’introverti au travail',
    description: 'Pour les introvertis dans des open spaces ou des cultures de réunions enchaînées : comment structurer votre journée autour de la récupération sociale et protéger le temps de travail profond sans paraître asocial.',
    category: 'article',
    tags: ['introverti', 'énergie', 'travail'],
    readingTimeMin: 8,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Réservez 30 minutes de « décompression » après tout matin chargé en réunions — planifiez-le comme une tâche.',
      'La communication asynchrone n’est pas de la paresse — c’est l’optimisation de performance de l’introverti.',
      '« Avec plaisir — je vous confirme jeudi ? » vous donne du vrai temps de réflexion.',
    ],
  },
  {
    id: 'r11',
    title: 'Les risques psychosociaux au travail (DUERP)',
    description: 'Une explication claire du cadre juridique français pour la prévention des risques psychosociaux, ce que cela signifie pour les employés, et comment signaler des préoccupations via les canaux officiels.',
    category: 'article',
    tags: ['juridique', 'droits', 'travail'],
    readingTimeMin: 7,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Tout employeur avec au moins 1 salarié est légalement obligé d’évaluer les risques psychosociaux annuellement.',
      'Le harcèlement moral est un délit pénal selon le code du travail français.',
      'Vous avez le droit de signaler une situation à risque sans accord préalable de la direction.',
    ],
  },
  {
    id: 'r12',
    title: 'Manager vers le haut : améliorer sa relation avec un chef difficile',
    description: 'Techniques basées sur la recherche pour améliorer la dynamique avec un responsable difficile — de la compréhension de ses motivations à la structuration d’interactions qui fonctionnent pour les deux parties.',
    category: 'article',
    tags: ['manager', 'relations', 'communication'],
    readingTimeMin: 11,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      'Comprenez la pression principale de votre manager — la plupart des comportements difficiles sont motivés par la peur, pas par la malveillance.',
      'Adaptez votre style de communication à leur préférence (visuel, données, narratif).',
      '« Manager vers le haut » n’est pas de la manipulation — c’est rendre la collaboration possible pour tous.',
    ],
  },

  // ── Guides ────────────────────────────────────────────────────────────────────────
  {
    id: 'r13',
    title: 'Poser des limites au travail sans abîmer les relations',
    description: 'Scripts pratiques pour les scénarios de limites les plus courants : demandes de dernière minute, messages après les heures, extension de périmètre, et positivité toxique. Des phrases réelles à utiliser dès demain.',
    category: 'guide',
    tags: ['limites', 'travail', 'assertivité'],
    readingTimeMin: 10,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      '« Je peux prendre ça — quelle priorité actuelle dois-je déprioriser ? » est une limite claire et complète.',
      'Les violations de limites se répètent jusqu’à ce qu’il y ait une conséquence — la bienveillance sans limite n’est pas de la bienveillance.',
      'Les limites ne concernent pas le changement de l’autre ; elles concernent ce que VOUS ferez différemment.',
    ],
  },
  {
    id: 'r14',
    title: 'Ma première séance de thérapie : à quoi s’attendre',
    description: 'Un guide démystificateur pour quiconque envisage une thérapie pour la première fois. Couvre les types de thérapie existants, le déroulement de la première séance, et comment choisir le bon thérapeute.',
    category: 'guide',
    tags: ['thérapie', 'premiers-pas', 'santé-mentale'],
    readingTimeMin: 8,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'L’alliance thérapeutique (votre relation avec votre thérapeute) prédit 30 % des résultats.',
      'La première séance est mutuelle — vous les évaluez aussi.',
      'La thérapie progresse plus vite quand vous faites de micro-réflexions entre les séances.',
    ],
  },
  {
    id: 'r15',
    title: 'Détoxication numérique au travail : un reset de 7 jours',
    description: 'Un programme d’une semaine pour réduire l’anxiété des notifications, la réactivité aux e-mails, et le défilement compulsif des réseaux sociaux — tout en restant efficace et connecté au travail.',
    category: 'guide',
    tags: ['numérique', 'attention', 'concentration'],
    readingTimeMin: 9,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Consulter ses e-mails moins de 3 fois par jour réduit le stress de 38 % (Gloria Mark, UCI).',
      'Désactiver les notifications n’est possible qu’avec un accord explicite de l’équipe.',
      'Jour 1 : posez votre téléphone dans le tiroir pendant le déjeuner. Juste ça. Commencez là.',
    ],
  },
  {
    id: 'r16',
    title: 'Résolution des conflits au travail : la méthode Harvard',
    description: 'Le cadre de négociation principielle de Harvard appliqué aux conflits professionnels — en se concentrant sur les intérêts, et non les positions, pour trouver des solutions durables que les deux parties peuvent accepter.',
    category: 'guide',
    tags: ['conflit', 'négociation', 'relations'],
    readingTimeMin: 13,
    url: '#',
    difficulty: 'advanced',
    keyTakeaways: [
      'Séparez la personne du problème — attaquez l’enjeu, pas l’individu.',
      'Demandez « pourquoi » derrière leur position pour révéler l’intérêt sous-jacent que vous pouvez satisfaire ensemble.',
      'Inventez des options à gains mutuels avant de vous engager sur une position.',
    ],
  },

  // ── Vidéos ────────────────────────────────────────────────────────────────────────
  {
    id: 'r17',
    title: 'TED Talk : Le pouvoir de la vulnérabilité — Brené Brown',
    description: 'L’une des TED talks les plus regardées de tous les temps. Les recherches de Brown sur la honte, la vulnérabilité et la connexion ont aidé des millions de personnes à réduire le perfectionnisme et à se reconnecter à elles-mêmes et aux autres.',
    category: 'video',
    tags: ['vulnérabilité', 'honte', 'connexion'],
    readingTimeMin: 20,
    url: 'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability',
    difficulty: 'beginner',
    keyTakeaways: [
      'La vulnérabilité n’est pas une faiblesse — c’est le berceau de la créativité, de l’appartenance et de la joie.',
      'Engourdir la vulnérabilité engourdit aussi la joie — on ne peut pas sélectionner ses émotions.',
      'Les personnes qui vivent pleinement embrassent l’imperfection ; les perfectionnistes se protègent de la honte.',
    ],
  },
  {
    id: 'r18',
    title: 'Méditation de balayage corporel guidée (20 min)',
    description: 'Un scan corporel structuré pour une libération profonde du stress, guidé par un psychologue clinicien. Idéal en fin de journée ou avant de dormir. Aucune expérience requise.',
    category: 'video',
    tags: ['méditation', 'sommeil', 'corps'],
    readingTimeMin: 20,
    url: '#',
    difficulty: 'beginner',
    keyTakeaways: [
      'Le balayage corporel est cliniquement prouvé pour réduire les symptômes d\'anxiété et d\'insomnie.',
      'Différent de la méditation de pleine conscience — pas de focus sur la respiration, seulement les sensations corporelles.',
      'Utilisez un casque et une position allongée pour un effet maximum.',
    ],
  },
  {
    id: 'r19',
    title: 'Masterclass communication professionnelle (3 épisodes)',
    description: 'Une série vidéo couvrant la communication non-violente (CNV), l\'écoute active, et donner du feedback comme un coach. Basé sur le cadre de Marshall Rosenberg adapté aux environnements corporate.',
    category: 'video',
    tags: ['communication', 'CNV', 'leadership'],
    readingTimeMin: 45,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      'La CNV sépare l\'observation de l\'évaluation — « tu es toujours en retard » vs « tu es arrivé 15 min après 9h ».',
      'Écouter activement, ce n\'est pas attendre de parler — c\'est suspendre totalement votre narration interne.',
      'La question de coaching « De quoi avez-vous besoin ? » fait basculer la conversation de la plainte à l\'action.',
    ],
  },
  {
    id: 'r20',
    title: 'Comprendre le stress : votre cerveau sous cortisol',
    description: 'Un exposé en neurosciences sur la façon dont le stress chronique reconfigure physiquement le cerveau, pourquoi le stress peut devenir addictif, et les 4 méthodes les plus rapides et prouvées pour réinitialiser votre réponse au stress.',
    category: 'video',
    tags: ['neurosciences', 'stress', 'science'],
    readingTimeMin: 18,
    url: '#',
    difficulty: 'intermediate',
    keyTakeaways: [
      'Le cortisol chronique rétrécit littéralement l\'hippocampe — le centre de la mémoire et de l\'apprentissage.',
      'La réponse au stress a évolué pour des menaces de 90 secondes, pas des projets de 90 jours.',
      'L\'eau froide, l\'exercice intense et le rire profond sont les outils les plus rapides pour éliminer le cortisol.',
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
  { id: 'a1', companyId: 'company-1', severity: 'critical', title: 'Niveau de stress élevé détecté en Ingénierie', description: '72 % des bilans du pôle Ingénierie sur les 7 derniers jours signalent un stress ≥ 7/10.', createdAt: '2026-03-30T08:00:00Z', acknowledged: false },
  { id: 'a2', companyId: 'company-1', severity: 'warning',  title: 'Tendance anxiété en hausse — Commercial',    description: 'Tendance anxieuse à la hausse depuis 3 semaines consécutives dans le pôle Commercial.', createdAt: '2026-03-28T12:00:00Z', acknowledged: false },
  { id: 'a3', companyId: 'company-1', severity: 'info',     title: 'Score bien-être en amélioration globale',     description: 'Le score moyen de bien-être est passé de 5,4 → 6,1 cette semaine.', createdAt: '2026-03-30T09:00:00Z', acknowledged: true },
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
  bio: 'Spécialisé dans l'anxiété, le burn-out et les transitions de vie. J'utilise une approche intégrative combinant TCC, ACT et pratiques de pleine conscience.',
  specialties: ['Anxiété', 'Burn-out', 'TCC', 'ACT', 'Pleine conscience', 'Transitions de vie'],
  languages: ['Anglais', 'Hindi'],
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
    preferredDate: '2026-04-14T14:00:00Z', topic: 'Anxiété professionnelle et burn-out', urgency: 'high',
    expiresAt: '2026-04-14T08:00:00Z',
  },
  {
    id: 'req2', clientId: 'c2', clientName: 'Jamie L.', requestedAt: '2026-04-12T15:00:00Z',
    preferredDate: '2026-04-15T10:00:00Z', topic: 'Stress relationnel', urgency: 'medium',
    expiresAt: '2026-04-13T15:00:00Z',
  },
  {
    id: 'req3', clientId: 'c3', clientName: 'Casey M.', requestedAt: '2026-04-13T11:00:00Z',
    preferredDate: '2026-04-16T16:00:00Z', topic: 'Gestion générale de l\'anxiété', urgency: 'low',
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
  { id: 'conv1', userId: 'u1', mode: 'text',  messages: MOCK_MESSAGES, summary: 'Discussion sur l\'anxiété liée aux échéances professionnelles et les stratégies d\'adaptation.', themes: ['travail', 'anxiété'], createdAt: '2026-03-30T09:00:00Z', updatedAt: '2026-03-30T09:15:00Z' },
  { id: 'conv2', userId: 'u5', mode: 'audio', messages: [], summary: 'Exploration des défis relationnels et établissement de limites saines.', themes: ['relations', 'limites'], createdAt: '2026-03-29T14:00:00Z', updatedAt: '2026-03-29T14:25:00Z' },
];

export const MOCK_THERAPISTS: TherapistProfile[] = [
  {
    userId: 't1',
    name: 'Dr. Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200&h=200',
    bio: 'Spécialisée en thérapie cognitivo-comportementale (TCC) et gestion du stress professionnel. Plus de 10 ans d\'expérience à aider les professionnels à retrouver l\'équilibre.',
    specialties: ['Anxiété', 'Stress professionnel', 'TCC'],
    languages: ['Anglais', 'Mandarin'],
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
    bio: 'Dédié à accompagner les personnes dans les transitions de vie et la fatigue émotionnelle. Thérapie empathique centrée sur la personne.',
    specialties: ['Deuil', 'Relations', 'Dépression'],
    languages: ['Anglais', 'Espagnol'],
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
    bio: 'Thérapeute intégrative axée sur la pleine conscience et la régulation émotionnelle. Passionnée par la création d\'un espace sûr et bienveillant pour tous.',
    specialties: ['Pleine conscience', 'Trauma', 'Estime de soi'],
    languages: ['Anglais', 'Espagnol', 'Portugais'],
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
    note: "Je me sens vraiment submergé(e) cette semaine et je pense qu'une journée santé mentale m'aiderait à me ressourcer. Pourrait-on en discuter ?",
    submittedAt: '2026-04-13T09:30:00Z', status: 'pending', acknowledged: false,
  },
  {
    id: 'dr2', employeeId: 'u6', employeeName: 'Robin T.', employeeEmail: 'robin@startup.io',
    category: 'overload',
    note: "J'ai 4 projets à rendre cette semaine et j'ai du mal à prioriser. J'aurais besoin d'aide pour savoir ce que je peux reporter.",
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
  { id: 'tn1', type: 'new_request',      title: 'Nouvelle demande de séance',           body: 'Alex R. a demandé une séance le 14 avril à 14h00.',                                                         createdAt: '2026-04-13T08:00:00Z', read: false, actionUrl: '/therapist/requests' },
  { id: 'tn2', type: 'session_reminder', title: 'Séance dans 1 heure',                  body: 'Votre séance avec Robin T. commence à 11h00.',                                                              createdAt: '2026-04-01T10:00:00Z', read: false, actionUrl: '/therapist/sessions' },
  { id: 'tn3', type: 'request_expired',  title: 'Demande expirée — réassignée auto.',   body: 'La demande de Jamie L. a expiré après 24h et a été transmise à Dr. Elena Rodriguez.',                      createdAt: '2026-04-13T15:00:00Z', read: false, actionUrl: '/therapist/requests' },
  { id: 'tn4', type: 'system',           title: 'Récapitulatif hebdomadaire disponible', body: 'Votre rapport de revenus pour la semaine du 7 avril est maintenant disponible.', createdAt: '2026-04-07T09:00:00Z', read: true,  actionUrl: '/therapist/earnings' },
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


