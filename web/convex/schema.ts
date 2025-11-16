import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  problems: defineTable({
    id: v.number(),
    difficulty: v.string(),
    title: v.string(),
    description: v.string(),
    tests: v.array(
      v.object({
        stdin: v.string(),
        expected_output: v.string(),
      })
    ),
  }),
});

