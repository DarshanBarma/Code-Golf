import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Submit code
export const submitCode = action({
  args: {
    matchId: v.id("matches"),
    clerkId: v.string(),
    code: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    // Get match and problem
    const match = await ctx.runQuery(api.matches.getMatch, {
      matchId: args.matchId,
    });

    if (!match || !match.problem) {
      throw new Error("Match or problem not found");
    }

    // Call Python FastAPI judge service
    const judgeUrl = process.env.JUDGE_API_URL || "http://localhost:8000";
    
    try {
      const response = await fetch(`${judgeUrl}/judge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: args.code,
          language: args.language,
          tests: match.problem.tests,
          matchId: args.matchId,
          playerId: args.clerkId,
        }),
      });

      if (!response.ok) {
        throw new Error("Judge service failed");
      }

      const result = await response.json();

      // Save submission
      const submissionId = await ctx.runMutation(api.submissions.saveSubmission, {
        matchId: args.matchId,
        clerkId: args.clerkId,
        code: args.code,
        language: args.language,
        passed: result.passed,
        output: result.output ? JSON.stringify(result.output) : undefined,
        errors: result.errors,
        executionTime: result.execution_time,
      });

      // Update match if passed
      if (result.passed) {
        await ctx.runMutation(api.submissions.updateMatchSubmission, {
          matchId: args.matchId,
          clerkId: args.clerkId,
        });
      }

      return {
        submissionId,
        passed: result.passed,
        output: result.output,
        errors: result.errors,
      };
    } catch (error) {
      // Fallback: save submission as failed
      const submissionId = await ctx.runMutation(api.submissions.saveSubmission, {
        matchId: args.matchId,
        clerkId: args.clerkId,
        code: args.code,
        language: args.language,
        passed: false,
        errors: error instanceof Error ? error.message : "Unknown error",
      });

      return {
        submissionId,
        passed: false,
        errors: error instanceof Error ? error.message : "Judge service unavailable",
      };
    }
  },
});

// Save submission to database
export const saveSubmission = mutation({
  args: {
    matchId: v.id("matches"),
    clerkId: v.string(),
    code: v.string(),
    language: v.string(),
    passed: v.boolean(),
    output: v.optional(v.string()),
    errors: v.optional(v.string()),
    executionTime: v.optional(v.number()),
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

    // Get match
    const match = await ctx.db.get(args.matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    const submissionId = await ctx.db.insert("submissions", {
      matchId: args.matchId,
      userId: user._id,
      clerkId: args.clerkId,
      problemId: match.problemId,
      code: args.code,
      language: args.language,
      codeLength: args.code.length,
      passed: args.passed,
      output: args.output,
      errors: args.errors,
      executionTime: args.executionTime,
      submittedAt: Date.now(),
    });

    return submissionId;
  },
});

// Update match submission status
export const updateMatchSubmission = mutation({
  args: {
    matchId: v.id("matches"),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) return;

    const isPlayer1 = match.player1ClerkId === args.clerkId;
    const isPlayer2 = match.player2ClerkId === args.clerkId;

    if (isPlayer1) {
      await ctx.db.patch(args.matchId, { player1Submitted: true });
    } else if (isPlayer2) {
      await ctx.db.patch(args.matchId, { player2Submitted: true });
    }

    // Check if both submitted (for 1v1 mode)
    const updatedMatch = await ctx.db.get(args.matchId);
    if (
      updatedMatch &&
      updatedMatch.mode === "1v1" &&
      updatedMatch.player1Submitted &&
      updatedMatch.player2Submitted
    ) {
      // Determine winner
      const submissions = await ctx.db
        .query("submissions")
        .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
        .filter((q) => q.eq(q.field("passed"), true))
        .collect();

      if (submissions.length > 0) {
        const shortest = submissions.reduce((min, sub) =>
          sub.codeLength < min.codeLength ? sub : min
        );
        await ctx.db.patch(args.matchId, {
          winnerId: shortest.userId,
          status: "completed",
        });
      }
    } else if (updatedMatch && updatedMatch.mode === "solo" && updatedMatch.player1Submitted) {
      // Complete solo match
      await ctx.db.patch(args.matchId, { status: "completed" });
    }
  },
});

// Get user submissions
export const getUserSubmissions = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .take(50);

    return submissions;
  },
});

// Get submission by ID
export const getSubmission = query({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.submissionId);
  },
});

