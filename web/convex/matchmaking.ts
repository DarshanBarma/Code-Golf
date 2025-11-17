import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Join matchmaking queue
export const joinQueue = mutation({
  args: {
    clerkId: v.string(),
    difficulty: v.string(),
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

    // Check if already in queue
    const existingQueue = await ctx.db
      .query("queue")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .first();

    if (existingQueue) {
      return existingQueue._id;
    }

    // Add to queue
    const queueId = await ctx.db.insert("queue", {
      userId: user._id,
      clerkId: args.clerkId,
      difficulty: args.difficulty,
      joinedAt: Date.now(),
      status: "waiting",
    });

    return queueId;
  },
});

// Cancel queue
export const cancelQueue = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const queueEntry = await ctx.db
      .query("queue")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .first();

    if (queueEntry) {
      await ctx.db.patch(queueEntry._id, { status: "cancelled" });
    }
  },
});

// Check if player is matched
export const checkMatchStatus = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const queueEntry = await ctx.db
      .query("queue")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .filter((q) => q.eq(q.field("status"), "matched"))
      .first();

    if (!queueEntry) {
      return null;
    }

    // Find the match
    const match = await ctx.db
      .query("matches")
      .filter((q) =>
        q.or(
          q.eq(q.field("player1ClerkId"), args.clerkId),
          q.eq(q.field("player2ClerkId"), args.clerkId)
        )
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    return match ? match._id : null;
  },
});

// Get queue position
export const getQueuePosition = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const myQueue = await ctx.db
      .query("queue")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .first();

    if (!myQueue) {
      return null;
    }

    const allWaiting = await ctx.db
      .query("queue")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .filter((q) => q.eq(q.field("difficulty"), myQueue.difficulty))
      .collect();

    const sorted = allWaiting.sort((a, b) => a.joinedAt - b.joinedAt);
    const position = sorted.findIndex((q) => q._id === myQueue._id) + 1;

    return {
      position,
      total: allWaiting.length,
      difficulty: myQueue.difficulty,
    };
  },
});

// Pair players (called by cron or action)
export const pairPlayers = mutation({
  args: { difficulty: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Get waiting players
    let waitingPlayers = await ctx.db
      .query("queue")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .collect();

    if (args.difficulty) {
      waitingPlayers = waitingPlayers.filter(
        (p) => p.difficulty === args.difficulty
      );
    }

    // Sort by join time
    waitingPlayers.sort((a, b) => a.joinedAt - b.joinedAt);

    const matchedPairs: string[] = [];

    // Pair players
    for (let i = 0; i < waitingPlayers.length - 1; i += 2) {
      const player1 = waitingPlayers[i];
      const player2 = waitingPlayers[i + 1];

      if (player1.difficulty !== player2.difficulty) continue;

      // Get users
      const user1 = await ctx.db.get(player1.userId);
      const user2 = await ctx.db.get(player2.userId);

      if (!user1 || !user2) continue;

      // Get random problem
      const problems = await ctx.db
        .query("problems")
        .withIndex("by_difficulty", (q) =>
          q.eq("difficulty", player1.difficulty)
        )
        .collect();

      if (problems.length === 0) continue;

      const randomProblem = problems[Math.floor(Math.random() * problems.length)];

      // Create match
      const matchId = await ctx.db.insert("matches", {
        problemId: randomProblem._id,
        player1Id: user1._id,
        player2Id: user2._id,
        player1ClerkId: player1.clerkId,
        player2ClerkId: player2.clerkId,
        mode: "1v1",
        status: "active",
        difficulty: player1.difficulty,
        startedAt: Date.now(),
        endsAt: Date.now() + 15 * 60 * 1000, // 15 minutes
        timerDuration: 15 * 60, // 15 minutes in seconds
        player1Submitted: false,
        player2Submitted: false,
      });

      // Update queue status
      await ctx.db.patch(player1._id, { status: "matched" });
      await ctx.db.patch(player2._id, { status: "matched" });

      matchedPairs.push(matchId);
    }

    return matchedPairs;
  },
});
