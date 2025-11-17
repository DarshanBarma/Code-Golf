import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all problems
export const getProblems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("problems").collect();
  },
});

// Get random problem by difficulty
export const getRandomProblem = query({
  args: { difficulty: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let problems;
    
    if (args.difficulty && args.difficulty !== "") {
      problems = await ctx.db
        .query("problems")
        .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty!))
        .collect();
    } else {
      problems = await ctx.db.query("problems").collect();
    }
    
    if (problems.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * problems.length);
    return problems[randomIndex];
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

// Get problem by ID (number)
export const getProblemById = query({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    const problems = await ctx.db.query("problems").collect();
    return problems.find((p) => p.id === args.id);
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

// List all problems with pagination
export const listProblems = query({
  args: { 
    limit: v.optional(v.number()),
    difficulty: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    if (args.difficulty && args.difficulty !== "") {
      return await ctx.db
        .query("problems")
        .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty!))
        .take(limit);
    }
    
    return await ctx.db.query("problems").take(limit);
  },
});
