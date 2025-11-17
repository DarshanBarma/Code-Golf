import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create solo match
export const createSoloMatch = mutation({
  args: {
    clerkId: v.string(),
    difficulty: v.optional(v.string()),
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

    // Get random problem
    const difficulty = args.difficulty || "easy";
    const problems = await ctx.db
      .query("problems")
      .withIndex("by_difficulty", (q) => q.eq("difficulty", difficulty))
      .collect();

    if (problems.length === 0) {
      // Fallback to any problem
      const allProblems = await ctx.db.query("problems").collect();
      if (allProblems.length === 0) {
        throw new Error("No problems available");
      }
      const randomProblem = allProblems[Math.floor(Math.random() * allProblems.length)];
      
      const matchId = await ctx.db.insert("matches", {
        problemId: randomProblem._id,
        player1Id: user._id,
        player1ClerkId: args.clerkId,
        mode: "solo",
        status: "active",
        difficulty: randomProblem.difficulty,
        startedAt: Date.now(),
        endsAt: Date.now() + 15 * 60 * 1000,
        timerDuration: 15 * 60,
        player1Submitted: false,
        player2Submitted: false,
      });
      
      return matchId;
    }

    const randomProblem = problems[Math.floor(Math.random() * problems.length)];

    // Create match
    const matchId = await ctx.db.insert("matches", {
      problemId: randomProblem._id,
      player1Id: user._id,
      player1ClerkId: args.clerkId,
      mode: "solo",
      status: "active",
      difficulty,
      startedAt: Date.now(),
      endsAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      timerDuration: 15 * 60, // 15 minutes in seconds
      player1Submitted: false,
      player2Submitted: false,
    });

    return matchId;
  },
});

// Get match by ID
export const getMatch = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) return null;

    const problem = await ctx.db.get(match.problemId);
    const player1 = await ctx.db.get(match.player1Id);
    const player2 = match.player2Id ? await ctx.db.get(match.player2Id) : null;

    return {
      ...match,
      problem,
      player1,
      player2,
    };
  },
});

// Get active match for user
export const getActiveMatch = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const match = await ctx.db
      .query("matches")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("player1ClerkId"), args.clerkId),
            q.eq(q.field("player2ClerkId"), args.clerkId)
          ),
          q.eq(q.field("status"), "active")
        )
      )
      .first();

    return match;
  },
});

// Update timer (called by cron)
export const updateMatchTimers = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const activeMatches = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    for (const match of activeMatches) {
      if (match.endsAt <= now) {
        await ctx.db.patch(match._id, { status: "completed" });
        
        // Determine winner based on submissions
        const submissions = await ctx.db
          .query("submissions")
          .withIndex("by_match", (q) => q.eq("matchId", match._id))
          .filter((q) => q.eq(q.field("passed"), true))
          .collect();

        if (submissions.length > 0) {
          const shortest = submissions.reduce((min, sub) =>
            sub.codeLength < min.codeLength ? sub : min
          );
          await ctx.db.patch(match._id, { winnerId: shortest.userId });
        }
      }
    }
  },
});

// Complete match
export const completeMatch = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.matchId, { status: "completed" });
  },
});

// Abandon match
export const abandonMatch = mutation({
  args: { 
    matchId: v.id("matches"),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) return;

    await ctx.db.patch(args.matchId, { status: "abandoned" });
  },
});

// Get match submissions
export const getMatchSubmissions = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .collect();
  },
});

// Get remaining time for match
export const getRemainingTime = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) return 0;

    const remaining = Math.max(0, match.endsAt - Date.now());
    return Math.floor(remaining / 1000); // Convert to seconds
  },
});
