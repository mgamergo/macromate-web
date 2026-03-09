import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logWater = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("water_logs", {
      userId: args.userId,
      amount: args.amount,
      createdAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const getTodayWater = query({
  args: {
    userId: v.id("users"),
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("water_logs")
      .withIndex("by_user_createdAt", (q) =>
        q
          .eq("userId", args.userId)
          .gte("createdAt", args.from)
          .lte("createdAt", args.to),
      )
      .collect();
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  },
});

export const getWaterLogsByDay = query({
  args: {
    userId: v.id("users"),
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("water_logs")
      .withIndex("by_user_createdAt", (q) =>
        q
          .eq("userId", args.userId)
          .gte("createdAt", args.from)
          .lte("createdAt", args.to),
      )
      .collect();
  },
});
