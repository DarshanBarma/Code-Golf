# Code Golf Platform - Complete Setup Guide

A competitive coding platform where the shortest code wins! Built with Next.js, Convex, Clerk, and Judge0.

## 🎯 Features

### Game Modes
- **Solo Mode**: Practice against random problems with a timer
- **1v1 Mode**: Compete against other players in real-time matchmaking

### Platform Features
- ⚡ Real-time matchmaking queue system
- 🎯 Live code execution with Judge0 API
- 📊 User stats, rating, wins/losses tracking
- 🏆 Achievements system
- 🔒 Secure authentication with Clerk
- 💾 Real-time database with Convex
- 🎨 Beautiful UI with Tailwind CSS
- 📝 Monaco code editor

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Next.js    │─────▶│   Convex    │─────▶│  Judge0 API │
│  Frontend   │      │   Backend   │      │  (FastAPI)  │
└─────────────┘      └─────────────┘      └─────────────┘
      │                     │
      │                     │
      ▼                     ▼
┌─────────────┐      ┌─────────────┐
│    Clerk    │      │   Database  │
│    Auth     │      │   (Convex)  │
└─────────────┘      └─────────────┘
```

## 📁 Project Structure

```
web/
├── app/
│   ├── page.tsx                    # Landing page with action buttons
│   ├── (auth)/                     # Authentication pages
│   ├── challenge/[matchId]/        # Main coding interface
│   ├── matchmaking/                # Queue waiting UI
│   ├── problems/                   # Problem browser
│   ├── profile/                    # User stats and achievements
│   └── components/                 # Reusable components
├── convex/
│   ├── schema.ts                   # Database schema
│   ├── users.ts                    # User management
│   ├── problems.ts                 # Problem queries
│   ├── matchmaking.ts              # Queue system
│   ├── matches.ts                  # Match lifecycle
│   ├── submissions.ts              # Code submission handling
│   └── crons.ts                    # Background jobs (pairing, timers)
└── backend/
    ├── main.py                     # FastAPI application
    ├── judge.py                    # Judge0 integration
    ├── requirements.txt            # Python dependencies
    └── Dockerfile                  # Container config
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.11+
- Convex account (free tier available)
- Clerk account (free tier available)
- Judge0 API key from RapidAPI (or self-hosted)

### Step 1: Clone and Install Dependencies

```bash
cd web
npm install
```

### Step 2: Convex Setup

```bash
npx convex dev
```

This creates a new Convex project and deploys your schema.

### Step 3: Clerk Setup

1. Go to https://clerk.com and create an account
2. Create a new application
3. Enable Email/Password authentication
4. Copy your API keys

### Step 4: Environment Variables

Create `web/.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
JUDGE_API_URL=http://localhost:8000
```

### Step 5: Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env`:
```env
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
```

Get your Judge0 API key:
1. Sign up at https://rapidapi.com
2. Subscribe to Judge0 CE API (free tier available)
3. Copy your API key

### Step 6: Run Everything

Terminal 1 - Convex:
```bash
cd web
npx convex dev
```

Terminal 2 - Backend:
```bash
cd backend
python main.py
```

Terminal 3 - Frontend:
```bash
cd web
npm run dev
```

Visit http://localhost:3000

## 📊 Database Schema

### Users Table
```typescript
{
  clerkId: string
  email: string
  username?: string
  rating: number        // Elo-style rating (starts at 1200)
  wins: number
  losses: number
  challengesSolved: number
  totalScore: number
  solvedProblems: Id<"problems">[]
}
```

### Problems Table
```typescript
{
  id: number
  difficulty: "easy" | "medium" | "hard"
  title: string
  description: string
  tests: Array<{
    stdin?: string
    expected_output: string
  }>
}
```

### Matches Table
```typescript
{
  problemId: Id<"problems">
  player1Id: Id<"users">
  player2Id?: Id<"users">     // Optional for solo mode
  mode: "solo" | "1v1"
  status: "active" | "completed" | "abandoned"
  difficulty: string
  startedAt: number
  endsAt: number
  timerDuration: number        // in seconds
  winnerId?: Id<"users">
  player1Submitted: boolean
  player2Submitted: boolean
}
```

### Queue Table
```typescript
{
  userId: Id<"users">
  clerkId: string
  difficulty: string
  joinedAt: number
  status: "waiting" | "matched" | "cancelled"
}
```

### Submissions Table
```typescript
{
  matchId: Id<"matches">
  userId: Id<"users">
  problemId: Id<"problems">
  code: string
  language: string
  codeLength: number
  passed: boolean
  output?: string
  errors?: string
  executionTime?: number
  submittedAt: number
}
```

## 🎮 How It Works

### Solo Mode Flow
1. User clicks "New Challenge" on landing page
2. `createSoloMatch` mutation creates match with random problem
3. User redirected to `/challenge/[matchId]`
4. Timer starts (default: 15 minutes)
5. User writes code in Monaco editor
6. On submit:
   - Code sent to `saveSubmission` mutation
   - Mutation calls FastAPI backend at `/judge`
   - Backend sends code to Judge0 API
   - Results returned and saved
   - Match marked as completed
7. User redirected to home

### 1v1 Mode Flow
1. User clicks "Find Match"
2. `joinQueue` mutation adds user to queue
3. User redirected to `/matchmaking`
4. Cron job (every 5 seconds) runs `pairPlayers`
5. When match found:
   - Both players removed from queue
   - Match created with same problem
   - Both players redirected to `/challenge/[matchId]`
6. Players code simultaneously
7. First to submit shortest passing code wins
8. Rating adjustments applied
9. Match completed

### Cron Jobs
```typescript
// Pair players every 5 seconds
crons.interval("pair players", { seconds: 5 }, api.matchmaking.pairPlayers)

// Update match timers every 60 seconds
crons.interval("update timers", { seconds: 60 }, api.matches.updateMatchTimers)
```

## 🎨 UI Components

### Pages
- **Landing (`/`)**: Action buttons for New Challenge, Find Match, View Problems, Profile
- **Challenge (`/challenge/[matchId]`)**: Split view with problem description and Monaco editor
- **Matchmaking (`/matchmaking`)**: Animated waiting screen with queue position
- **Problems (`/problems`)**: Grid of all problems with difficulty filters
- **Problem Detail (`/problems/[id]`)**: View problem and test cases
- **Profile (`/profile`)**: User stats, achievements, win/loss record

### Key Components
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Timer**: Live countdown display
- **Opponent Status**: Real-time submission indicators in 1v1
- **Language Selector**: Python, JavaScript, Java, C++, C support

## 🔧 Development

### Adding Problems
Use Convex dashboard or create directly:
```bash
npx convex run problems:createProblem '{
  "id": 1,
  "difficulty": "easy",
  "title": "Two Sum",
  "description": "Return indices of two numbers that add up to target",
  "tests": [
    {"stdin": "2,7,11,15\\n9", "expected_output": "0,1"}
  ]
}'
```

### Testing Judge Service
```bash
curl -X POST http://localhost:8000/judge \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(2 + 2)",
    "language": "python",
    "tests": [{"expected_output": "4"}],
    "matchId": "test",
    "playerId": "test"
  }'
```

### Viewing Logs
- **Convex**: Real-time logs in terminal running `npx convex dev`
- **Backend**: FastAPI logs in terminal running `python main.py`
- **Frontend**: Browser console and Next.js terminal

## 🚢 Deployment

### Frontend (Vercel)
```bash
vercel
```

Set environment variables in Vercel dashboard.

### Convex
Auto-deployed with:
```bash
npx convex deploy
```

### Backend

#### Docker
```bash
cd backend
docker build -t codegolf-judge .
docker run -p 8000:8000 --env-file .env codegolf-judge
```

#### Railway/Render/Fly.io
1. Connect your GitHub repo
2. Set environment variables
3. Deploy from `backend/` directory

## 🐛 Troubleshooting

### "Cannot find module '@monaco-editor/react'"
```bash
cd web
npm install @monaco-editor/react
```

### Convex schema errors
```bash
npx convex dev --once
```

### Judge0 API not working
1. Check your API key in `backend/.env`
2. Verify RapidAPI subscription is active
3. Check rate limits

### User not syncing
- Verify `UserSync` component is in root layout
- Check Clerk webhook configuration
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set

## 📚 API Reference

### Convex Functions

#### Queries
- `users.getUserByClerkId({ clerkId })`
- `problems.getRandomProblem({ difficulty? })`
- `problems.listProblems({ limit?, difficulty? })`
- `matches.getMatch({ matchId })`
- `matchmaking.getQueuePosition({ clerkId })`
- `matchmaking.checkMatchStatus({ clerkId })`

#### Mutations
- `users.createUser({ clerkId, email, ... })`
- `matches.createSoloMatch({ clerkId, difficulty })`
- `matchmaking.joinQueue({ clerkId, difficulty })`
- `matchmaking.cancelQueue({ clerkId })`
- `submissions.saveSubmission({ matchId, code, ... })`
- `matches.abandonMatch({ matchId, clerkId })`

#### Actions
- `submissions.submitCode({ matchId, code, language, ... })`

### Judge API

#### POST /judge
```typescript
Request: {
  code: string
  language: "python" | "javascript" | "java" | "cpp" | "c"
  tests: Array<{ stdin?: string, expected_output: string }>
  matchId: string
  playerId: string
}

Response: {
  passed: boolean
  output: Array<TestResult>
  errors?: string
  execution_time?: number
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or production!

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Convex for real-time backend infrastructure
- Clerk for authentication
- Judge0 for code execution
- Monaco Editor team

---

Built with ❤️ by the Code Golf community
