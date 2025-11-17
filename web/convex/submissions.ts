import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit a solution
export const submitSolution = mutation({
  args: {
    clerkId: v.string(),
    problemId: v.id("problems"),
    code: v.string(),
    language: v.string(),
    passed: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const codeLength = args.code.length;
    const score = args.passed ? Math.max(1000 - codeLength, 100) : 0;

    // Create submission
    const submissionId = await ctx.db.insert("submissions", {
      userId: user._id,
      problemId: args.problemId,
      code: args.code,
      language: args.language,
      codeLength,
      score,
      passed: args.passed,
      submittedAt: Date.now(),
    });

    // If passed, update leaderboard
    if (args.passed) {
      // Check if user has a better score for this problem
      const existingEntry = await ctx.db
        .query("leaderboard")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("problemId"), args.problemId))
        .first();

      if (!existingEntry || score > existingEntry.bestScore) {
        if (existingEntry) {
          await ctx.db.patch(existingEntry._id, {
            bestScore: score,
            codeLength,
            language: args.language,
            achievedAt: Date.now(),
          });
        } else {
          await ctx.db.insert("leaderboard", {
            userId: user._id,
            problemId: args.problemId,
            bestScore: score,
            codeLength,
            language: args.language,
            achievedAt: Date.now(),
          });
        }
      }
    }

    return { submissionId, score, passed: args.passed };
  },
});

// Get user submissions
export const getUserSubmissions = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get problem leaderboard
export const getProblemLeaderboard = query({
  args: { problemId: v.id("problems"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const entries = await ctx.db
      .query("leaderboard")
      .withIndex("by_problem", (q) => q.eq("problemId", args.problemId))
      .order("desc")
      .take(limit);

    // Populate user data
    const leaderboard = await Promise.all(
      entries.map(async (entry, index) => {
        const user = await ctx.db.get(entry.userId);
        return {
          rank: index + 1,
          name: user?.name || user?.username || "Anonymous",
          imageUrl: user?.imageUrl,
          score: entry.bestScore,
          codeLength: entry.codeLength,
          language: entry.language,
        };
      })
    );

    return leaderboard;
  },
});
