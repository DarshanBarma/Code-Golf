import { query } from "./_generated/server";

export const getProblems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("problems").collect();
  },
});