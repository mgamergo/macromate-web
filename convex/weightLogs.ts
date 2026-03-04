import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logWeight = mutation({
  args: {
    userId: v.id("users"),
    weight: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("weight_logs", {
      userId: args.userId,
      weight: args.weight,
      createdAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const getWeightHistory = query({
  args: {
    userId: v.id("users"),
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("weight_logs")
      .withIndex("by_user_createdAt", (q) =>
        q
          .eq("userId", args.userId)
          .gte("createdAt", args.from)
          .lte("createdAt", args.to),
      )
      .collect();
  },
});
