# Code Golf - Challenge Your Coding Skills 🏌️

A competitive coding platform where developers write the shortest code possible to solve programming challenges.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Convex
```bash
npx convex dev
```

### 3. Set Up Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
web/
├── app/
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── auth/            # Authentication pages
│   └── page.tsx         # Main dashboard
├── convex/
│   ├── schema.ts        # Database schema
│   ├── users.ts         # User management
│   ├── problems.ts      # Challenge management
│   └── submissions.ts   # Submission tracking
├── types/               # TypeScript type definitions
└── middleware.ts        # Authentication middleware
```

## 🎯 Features

- ✅ **User Authentication** - Clerk integration
- ✅ **Real-time Database** - Convex backend
- ✅ **User Stats** - Track challenges solved, scores, and rank
- ✅ **Problem Management** - Create and manage coding challenges
- ✅ **Submission System** - Track user submissions and scores
- ✅ **Leaderboard** - Global and per-problem rankings
- ✅ **Theme Toggle** - Light/Dark mode
- ✅ **Responsive Design** - Works on all devices
- ✅ **Type-safe** - Full TypeScript support

## 📚 Documentation

- [Backend Setup Guide](./BACKEND_SETUP.md) - Detailed Convex setup
- [Project Structure](./PROJECT_STRUCTURE.md) - Architecture overview
- [Component Usage](./PROJECT_STRUCTURE.md#component-usage) - How to use components

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Backend**: Convex
- **Auth**: Clerk
- **Styling**: Tailwind CSS + CSS Variables
- **Fonts**: Geist Sans & Geist Mono

## 🔧 Development

### Start Convex (Terminal 1)
```bash
npx convex dev
```

### Start Next.js (Terminal 2)
```bash
npm run dev
```

## 📊 Database Schema

### Users
- Stores user profiles with Clerk integration
- Tracks challenges solved, scores, and rankings

### Problems
- Coding challenges with tests and metadata
- Difficulty levels and tags

### Submissions
- User code submissions with scores
- Pass/fail status and code length

### Leaderboard
- Best scores per problem
- Global rankings

## 🎨 Theming

Edit `app/globals.css` to customize colors:

```css
:root[data-theme="light"] {
  --primary-500: #9d7562;
  --background-50: #f5f1ef;
  /* ... */
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For detailed setup instructions, see:
- [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.

---

Built with ❤️ using Next.js, Convex, and Clerk

