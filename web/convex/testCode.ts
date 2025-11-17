import { action } from "./_generated/server";
import { v } from "convex/values";
import axios from "axios";

// Simple Judge0 test action (no match/problem dependencies)
export const testCode = action({
  args: {
    language_id: v.number(),
    source_code: v.string(),
    stdin: v.optional(v.string()),
  },

  handler: async (_, { language_id, source_code, stdin }) => {
    const key = process.env.JUDGE0_API_KEY!;
    const host = process.env.JUDGE0_HOST!;

    try {
      const response = await axios.post(
        `https://${host}/submissions?base64_encoded=false&wait=true`,
        {
          language_id,
          source_code,
          stdin: stdin || "",
        },
        {
          headers: {
            "x-rapidapi-key": key,
            "x-rapidapi-host": host,
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      return {
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        compile_output: result.compile_output || "",
        status: result.status?.description || "Unknown",
        time: result.time || null,
        memory: result.memory || null,
      };
    } catch (error) {
      return {
        stdout: "",
        stderr: error instanceof Error ? error.message : "Unknown error",
        compile_output: "",
        status: "Error",
        time: null,
        memory: null,
      };
    }
  },
});
