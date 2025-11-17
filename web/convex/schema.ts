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

  submissions: defineTable({
    userId: v.id("users"),
    problemId: v.id("problems"),
    code: v.string(),
    language: v.string(),
    codeLength: v.number(),
    score: v.number(),
    passed: v.boolean(),
    submittedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_problem", ["problemId"])
    .index("by_user_and_problem", ["userId", "problemId"]),

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


