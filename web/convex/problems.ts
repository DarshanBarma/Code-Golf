import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all problems
export const getProblems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("problems").collect();
  },
});

// Get problems by difficulty
export const getProblemsByDifficulty = query({
  args: { difficulty: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("problems")
      .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty))
      .collect();
  },
});

// Get single problem
export const getProblem = query({
  args: { problemId: v.id("problems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.problemId);
  },
});

// Create a new problem (admin function)
export const createProblem = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const problemId = await ctx.db.insert("problems", args);
    return problemId;
  },
});

// Get featured problems (latest or popular)
export const getFeaturedProblems = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    return await ctx.db.query("problems").take(limit);
  },
});
