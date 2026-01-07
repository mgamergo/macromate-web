import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logMeal = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fats: v.number(),
    type: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack")
    ),
  },
  handler: async (ctx, args) => {
    const mealId = await ctx.db.insert("meals", {
      userId: args.userId,
      name: args.name,
      calories: args.calories,
      protein: args.protein,
      carbs: args.carbs,
      fats: args.fats,
      type: args.type,
      createdAt: Date.now(),
    });
    return await ctx.db.get(mealId);
  },
});

export const getMealsByDates = query({
  args: {
    userId: v.id("users"),
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meals")
      .withIndex("by_user", (q) =>
        q
          .eq("userId", args.userId)
          .gte("_creationTime", args.from)
          .lte("_creationTime", args.to)
      ).collect();
  },
});
