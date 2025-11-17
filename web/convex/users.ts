import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user from Clerk
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        username: args.username,
        imageUrl: args.imageUrl,
        lastActive: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      username: args.username,
      imageUrl: args.imageUrl,
      challengesSolved: 0,
      totalScore: 0,
      solvedProblems: [],
      createdAt: Date.now(),
      lastActive: Date.now(),
    });

    return userId;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

// Get user stats
export const getUserStats = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    // Get user's rank
    const allUsers = await ctx.db
      .query("users")
      .withIndex("by_total_score")
      .order("desc")
      .collect();

    const rank = allUsers.findIndex((u) => u._id === user._id) + 1;

    return {
      challengesSolved: user.challengesSolved,
      totalScore: user.totalScore,
      globalRank: rank > 0 ? rank : null,
      solvedProblems: user.solvedProblems,
    };
  },
});

// Update user stats after solving a problem
export const updateUserStats = mutation({
  args: {
    clerkId: v.string(),
    problemId: v.id("problems"),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if problem already solved
    const alreadySolved = user.solvedProblems.includes(args.problemId);

    if (!alreadySolved) {
      await ctx.db.patch(user._id, {
        challengesSolved: user.challengesSolved + 1,
        totalScore: user.totalScore + args.score,
        solvedProblems: [...user.solvedProblems, args.problemId],
        lastActive: Date.now(),
      });
    } else {
      // Update score if better
      await ctx.db.patch(user._id, {
        totalScore: user.totalScore + args.score,
        lastActive: Date.now(),
      });
    }
  },
});

// Get top users (leaderboard)
export const getTopUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    const users = await ctx.db
      .query("users")
      .withIndex("by_total_score")
      .order("desc")
      .take(limit);

    return users.map((user, index) => ({
      rank: index + 1,
      name: user.name || user.username || "Anonymous",
      imageUrl: user.imageUrl,
      challengesSolved: user.challengesSolved,
      totalScore: user.totalScore,
    }));
  },
});
