import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    challengesSolved: v.number(),
    totalScore: v.number(),
    rating: v.number(),
    wins: v.number(),
    losses: v.number(),
    globalRank: v.optional(v.number()),
    solvedProblems: v.array(v.id("problems")),
    createdAt: v.number(),
    lastActive: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_total_score", ["totalScore"])
    .index("by_challenges_solved", ["challengesSolved"]),

  problems: defineTable({
    id: v.number(),
    difficulty: v.string(),
    title: v.string(),
    description: v.string(),
    tests: v.array(
      v.object({
        stdin: v.optional(v.string()),
        expected_output: v.string(),
      })
    ),
  }).index("by_difficulty", ["difficulty"]),

  queue: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),
    difficulty: v.string(),
    joinedAt: v.number(),
    status: v.string(), // "waiting" | "matched" | "cancelled"
  })
    .index("by_status", ["status"])
    .index("by_clerk_id", ["clerkId"]),

  matches: defineTable({
    problemId: v.id("problems"),
    player1Id: v.id("users"),
    player2Id: v.optional(v.id("users")), // Optional for solo mode
    player1ClerkId: v.string(),
    player2ClerkId: v.optional(v.string()),
    mode: v.string(), // "solo" | "1v1"
    status: v.string(), // "active" | "completed" | "abandoned"
    difficulty: v.string(),
    startedAt: v.number(),
    endsAt: v.number(),
    timerDuration: v.number(), // in seconds
    winnerId: v.optional(v.id("users")),
    player1Submitted: v.boolean(),
    player2Submitted: v.boolean(),
  })
    .index("by_status", ["status"])
    .index("by_player1", ["player1ClerkId"])
    .index("by_player2", ["player2ClerkId"]),

  submissions: defineTable({
    matchId: v.id("matches"),
    userId: v.id("users"),
    clerkId: v.string(),
    problemId: v.id("problems"),
    code: v.string(),
    language: v.string(),
    codeLength: v.number(),
    passed: v.boolean(),
    output: v.optional(v.string()),
    errors: v.optional(v.string()),
    executionTime: v.optional(v.number()),
    submittedAt: v.number(),
  })
    .index("by_match", ["matchId"])
    .index("by_user", ["userId"])
    .index("by_clerk_id", ["clerkId"]),

  leaderboard: defineTable({
    userId: v.id("users"),
    problemId: v.id("problems"),
    bestScore: v.number(),
    codeLength: v.number(),
    language: v.string(),
    achievedAt: v.number(),
  })
    .index("by_problem", ["problemId", "bestScore"])
    .index("by_user", ["userId"]),
});


