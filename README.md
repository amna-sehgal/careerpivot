# CareerPivot 🚀

> AI-Powered Career Gap Intelligence — See exactly how close you are to your next role.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose ODM) |
| AI | OpenRouter API (free — Mistral 7B) |
| Auth | JWT + bcryptjs |
| Styling | DM Serif Display + Plus Jakarta Sans, Glassmorphism UI |

---

## Project Structure

```
careerpivot/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx       — Public landing page
│   │   │   ├── Login.tsx         — Login
│   │   │   ├── Signup.tsx        — Signup (redirects to EditProfile)
│   │   │   ├── Dashboard.tsx     — Main dashboard with profile + latest analysis
│   │   │   ├── EditProfile.tsx   — 3-step profile form
│   │   │   ├── Results.tsx       — AI gap analysis + 3 role cards
│   │   │   └── History.tsx       — All past analyses + progress tracking
│   │   ├── components/
│   │   │   ├── Navbar.tsx        — Fixed nav with active states
│   │   │   ├── RoleCard.tsx      — Rich role card (match %, roadmap, proof of pivot)
│   │   │   └── TagInput.tsx      — Tag input with autocomplete
│   │   └── lib/
│   │       ├── api.ts            — Axios instance with JWT interceptor
│   │       ├── auth.ts           — localStorage user/profile helpers
│   │       └── types.ts          — TypeScript interfaces
│   └── ...
│
└── backend/                  # Express API
    ├── server.js             — Entry point, connects MongoDB then starts server
    ├── lib/
    │   ├── db.js             — Mongoose connection
    │   └── openrouter.js     — OpenRouter API call + prompt + JSON parser
    ├── middleware/
    │   └── auth.js           — JWT verifyToken middleware
    ├── models/
    │   ├── User.js           — User schema (with profile fields embedded)
    │   └── CareerSuggestion.js — Stores each analysis run + profileSnapshot
    └── routes/
        ├── auth.js           — /api/auth/signup, /api/auth/login
        ├── profile.js        — /api/profile (GET + POST)
        └── career.js         — /api/career/analyze, /api/career/history
```

---

## Setup Guide

### Step 1 — Get your API keys (both free)

**MongoDB Atlas:**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free account
2. Build a Database → Free (M0) → Any region
3. Create username & password
4. Connect → Drivers → Copy connection string
5. Replace `<password>` with your actual password

**OpenRouter:**
1. Go to [openrouter.ai](https://openrouter.ai) → Sign up free
2. Go to Keys → Create Key
3. Copy the key (starts with `sk-or-v1-...`)
4. Free models used: `mistralai/mistral-7b-instruct:free`

---

### Step 2 — Backend setup

```bash
cd backend

# Copy and fill env file
cp .env.example .env
# Open .env and fill in: MONGODB_URI, OPENROUTER_API_KEY, JWT_SECRET

# Install dependencies
npm install

# Start dev server
npm run dev
# → Runs on http://localhost:4000
# → You should see: ✅ MongoDB connected  ✅ CareerPivot backend running on :4000
```

---

### Step 3 — Frontend setup

```bash
cd frontend

# Copy env file (default values work as-is)
cp .env.example .env

# Install dependencies
npm install

# Start dev server
npm run dev
# → Runs on http://localhost:5173
```

---

### Step 4 — Test the full flow

1. Open `http://localhost:5173`
2. Click **Get Started Free** → Sign up
3. Fill the 3-step profile form (role, skills, target)
4. Click **Save & Go to Dashboard**
5. Click **Get Career Advice** → wait ~15 seconds
6. See your 3 role cards with match %, roadmap, and Proof of Pivot
7. Go to **History** to see the analysis saved
8. Update your profile with new skills → Re-analyze → watch match % change

---

## API Reference

```
POST  /api/auth/signup              Register new user
POST  /api/auth/login               Login

GET   /api/profile                  Get logged-in user's profile
POST  /api/profile                  Create/update profile fields

POST  /api/career/analyze           Run AI gap analysis (saves to DB, returns suggestions)
GET   /api/career/history           All past analyses for current user (sorted newest first)
GET   /api/career/history/:id       Single analysis set by ID
```

All `/api/profile` and `/api/career` routes require `Authorization: Bearer <token>` header.

---

## Environment Variables

### `backend/.env`
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careerpivot
JWT_SECRET=any_long_random_string_here
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:4000
```

---

## Troubleshooting

**"Analysis couldn't run" error:**
- Open your backend terminal — the full error is logged there
- Check `OPENROUTER_API_KEY` is set correctly in `backend/.env`
- Make sure your profile has: current role + target career + at least 2 skills
- The free Mistral model sometimes rate-limits — wait 30s and retry

**MongoDB connection fails:**
- Check your IP is whitelisted in Atlas (Network Access → Add IP → Allow from anywhere: `0.0.0.0/0`)
- Double-check the connection string format and password

**Tailwind styles not loading:**
- This project uses Tailwind v3. Do NOT upgrade to v4.
- If you see PostCSS errors, run: `npm install tailwindcss@3 postcss autoprefixer`

**Changing the AI model:**
In `backend/lib/openrouter.js`, change the `model` field:
```js
model: 'mistralai/mistral-7b-instruct:free'   // default, free
model: 'meta-llama/llama-3-8b-instruct:free'  // alternative, free
model: 'openai/gpt-4o-mini'                    // better quality, paid
```
See all free models: [openrouter.ai/models?max_price=0](https://openrouter.ai/models?max_price=0)

---

## Features

- **Dashboard** — Profile card, stats (skills count, analyses run, avg match %, weeks to ready), latest analysis preview, quick actions
- **Gap Intelligence Engine** — AI analyzes your profile and returns 3 roles ranked by readiness %
- **Role Cards** — Match % dial, reasoning, Proof of Pivot statement, skill gaps with priority tags, 6-week roadmap
- **Proof of Pivot** — AI-generated 2-3 sentence statement that reframes your old experience as an unfair advantage
- **Profile Evolution** — Every analysis saves a snapshot of your profile at that time
- **History Page** — Visual progression chart, timeline of past analyses, expandable role details, skills at time of analysis
- **Profile Completeness** — Visual indicator showing how complete your profile is (affects recommendation quality)

---

Built for internship submission · CareerPivot v1.0
