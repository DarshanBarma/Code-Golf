import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import axios from "axios";

export const runCode = action({
  args: {
    matchId: v.id("matches"),
    clerkId: v.string(),
    language_id: v.number(),
    source_code: v.string(),
    language: v.string(),
  },

  handler: async (ctx, { matchId, clerkId, language_id, source_code, language }) => {
    const key = process.env.JUDGE0_API_KEY!;
    const host = process.env.JUDGE0_HOST!;

    // Get match and problem with test cases
    const match = await ctx.runQuery(api.matches.getMatch, { matchId });
    
    if (!match || !match.problem) {
      throw new Error("Match or problem not found");
    }

    const tests = match.problem.tests;
    let allPassed = true;
    let errors: string[] = [];
    let outputs: any[] = [];
    let totalExecutionTime = 0;

    // Run code against all test cases
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      try {
        const submitRes = await axios.post(
          `https://${host}/submissions?base64_encoded=false&wait=true`,
          {
            language_id,
            source_code,
            stdin: test.stdin || "",
          },
          {
            headers: {
              "x-rapidapi-key": key,
              "x-rapidapi-host": host,
              "Content-Type": "application/json",
            },
          }
        );

        const result = submitRes.data;
        
        // Check for compilation or runtime errors
        if (result.status.id === 6) {
          // Compilation error
          allPassed = false;
          errors.push(`Test ${i + 1}: Compilation Error - ${result.compile_output || result.stderr}`);
          break;
        } else if (result.status.id === 11 || result.status.id === 12 || result.status.id === 13) {
          // Runtime errors (11: Runtime Error (NZEC), 12: Runtime Error (Other), 13: Internal Error)
          allPassed = false;
          errors.push(`Test ${i + 1}: Runtime Error - ${result.stderr || result.message}`);
          break;
        } else if (result.status.id === 5) {
          // Time Limit Exceeded
          allPassed = false;
          errors.push(`Test ${i + 1}: Time Limit Exceeded`);
          break;
        }

        // Check if output matches expected output
        const actualOutput = (result.stdout || "").trim();
        const expectedOutput = test.expected_output.trim();
        
        if (actualOutput !== expectedOutput) {
          allPassed = false;
          errors.push(`Test ${i + 1}: Wrong Answer - Expected "${expectedOutput}", got "${actualOutput}"`);
        }

        outputs.push({
          testCase: i + 1,
          passed: actualOutput === expectedOutput,
          output: actualOutput,
          expected: expectedOutput,
          time: result.time,
        });

        if (result.time) {
          totalExecutionTime += parseFloat(result.time);
        }

      } catch (error) {
        allPassed = false;
        errors.push(`Test ${i + 1}: Execution failed - ${error instanceof Error ? error.message : "Unknown error"}`);
        break;
      }
    }

    // Save submission
    // @ts-ignore - Convex API types work at runtime
    const submissionId = await ctx.runMutation(api.submissions.saveSubmission, {
      matchId,
      clerkId,
      code: source_code,
      language,
      passed: allPassed,
      output: JSON.stringify(outputs),
      errors: errors.length > 0 ? errors.join("\n") : undefined,
      executionTime: totalExecutionTime,
    });

    // Update match if all tests passed
    if (allPassed) {
      // @ts-ignore - Convex API types work at runtime
      await ctx.runMutation(api.submissions.updateMatchSubmission, {
        matchId,
        clerkId,
      });

      // Get updated match to check completion status
      // @ts-ignore - Convex API types work at runtime
      const updatedMatch = await ctx.runQuery(api.matches.getMatch, { matchId });
      
      return {
        success: true,
        passed: true,
        submissionId,
        message: "All test cases passed!",
        outputs,
        executionTime: totalExecutionTime,
        matchCompleted: updatedMatch?.status === "completed",
        matchResults: updatedMatch?.status === "completed" ? {
          winner: updatedMatch.winnerId,
          player1: updatedMatch.player1,
          player2: updatedMatch.player2,
          player1Submitted: updatedMatch.player1Submitted,
          player2Submitted: updatedMatch.player2Submitted,
        } : null,
      };
    } else {
      return {
        success: true,
        passed: false,
        submissionId,
        message: "Code execution failed",
        errors: errors.join("\n"),
        outputs,
      };
    }
  },
});
