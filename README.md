# Confidentia Web App

> AI-powered well-being platform — Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Recharts

## Quick Start

```bash
cd confidentia-web
npm install
npm run dev
# Open http://localhost:3000
```

> **Node.js 18+** is required. Download from [nodejs.org](https://nodejs.org).

## Demo

1. Open `http://localhost:3000` → redirects to `/login`
2. Click **"✨ Continue as Demo"**
3. Pick any role from the animated grid:

| Role | First page | Key features |
|---|---|---|
| **Personal** | `/consumer/chat` | AI chat (text/audio/video), journal, insights, check-in, pricing |
| **Employee** | `/employee/support` | Confidential AI support, resources, privacy explainer |
| **HR Dashboard** | `/hr/analytics` | Anonymized trends, emotion heatmap, alerts, settings |
| **Therapist** | `/therapist/profile` | Profile, availability calendar, requests, sessions, earnings |
| **Admin** | `/admin/users` | User/company/conversation/plan management |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/              # Auth pages
│   ├── select-role/
│   ├── consumer/           # One folder per role
│   ├── employee/
│   ├── hr/
│   ├── therapist/
│   └── admin/
├── components/
│   ├── ui/                 # Primitives: Button, Card, Badge, Input, Avatar, Modal
│   └── layout/             # Sidebar, PageHeader, StaggerList
├── lib/
│   ├── session.ts          # Auth (swap for real provider here)
│   ├── mock-data.ts        # All fake data (swap per-export for real API calls)
│   ├── heygen.ts           # HeyGen stub (add API key + uncomment)
│   ├── elevenlabs.ts       # ElevenLabs stub (add API key + uncomment)
│   └── utils.ts            # Helpers: cn, formatDate, EMOTION_COLORS…
└── types/
    └── index.ts            # All TypeScript interfaces (single source of truth)
```

---

## How to Add a New Feature

### New page in an existing role
1. Create `src/app/<role>/<page>/page.tsx`
2. Add one object to the `NAV` array in `src/app/<role>/layout.tsx`

### New role
1. Add the role to `UserRole` in `src/types/index.ts`
2. Add a demo user to `DEMO_USERS` in `src/lib/session.ts`
3. Add a `ROLE_HOME` entry in `src/lib/session.ts`
4. Create `src/app/<role>/layout.tsx` with your nav items
5. Add a role card in `src/app/select-role/page.tsx`

### Connect real AI services
- **HeyGen**: Add `HEYGEN_API_KEY` to `.env.local`, uncomment the fetch in `src/lib/heygen.ts`
- **ElevenLabs**: Add `ELEVENLABS_API_KEY` to `.env.local`, uncomment the fetch in `src/lib/elevenlabs.ts`

### Connect a real backend
Replace exports in `src/lib/mock-data.ts` one at a time with API calls.

---

## Color Palette (from logo)

| Token | Hex | Use |
|---|---|---|
| `cyan` | `#45D8D4` | Highlights, gradient start |
| `violet` | `#9B6FE8` | Primary brand, active states |
| `pink` | `#E879BC` | Accent, emotions |
| `coral` | `#FF8C6B` | Warnings, CTA |
| `bg` | `#07090F` | Page background |
| `surface` | `#0F1120` | Card surfaces |

Logo gradient: `linear-gradient(135deg, #45D8D4, #9B6FE8, #E879BC, #FF8C6B)`

---

## Environment Variables

```env
# .env.local
HEYGEN_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
```
