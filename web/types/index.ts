import { Doc, Id } from "@/convex/_generated/dataModel";

// User Types
export type User = Doc<"users">;
export type UserId = Id<"users">;

export interface UserStats {
  challengesSolved: number;
  totalScore: number;
  globalRank: number | null;
  solvedProblems: Id<"problems">[];
}

// Problem Types
export type Problem = Doc<"problems">;
export type ProblemId = Id<"problems">;

export type Difficulty = "Easy" | "Medium" | "Hard" | "easy" | "medium" | "hard";

export interface ProblemTest {
  stdin?: string;
  expected_output: string;
}

// Submission Types
export type Submission = Doc<"submissions">;
export type SubmissionId = Id<"submissions">;

export interface SubmissionResult {
  submissionId: Id<"submissions">;
  score: number;
  passed: boolean;
}

// Leaderboard Types
export type LeaderboardEntry = Doc<"leaderboard">;

export interface LeaderboardDisplay {
  rank: number;
  name: string;
  imageUrl?: string;
  score: number;
  codeLength: number;
  language: string;
}

export interface TopUser {
  rank: number;
  name: string;
  imageUrl?: string;
  challengesSolved: number;
  totalScore: number;
}

// Component Props Types
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
}

export interface ChallengeCardProps {
  title: string;
  description: string;
  difficulty: Difficulty;
  languages: string[];
  onClick?: () => void;
}

export interface HeaderProps {
  theme: string;
  onThemeToggle: () => void;
}
