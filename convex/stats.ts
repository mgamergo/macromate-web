import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logOrUpdateUserStats = mutation({
  args: {
    userId: v.id("users"),

    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    age: v.optional(v.number()),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    bodyFatPercentage: v.number(),
    goal: v.union(
      v.literal("lose_weight"),
      v.literal("maintain_weight"),
      v.literal("gain_weight"),
    ),
    activityLevel: v.union(
      v.literal("sedentary"),
      v.literal("lightly_active"),
      v.literal("moderately_active"),
      v.literal("very_active"),
      v.literal("extremely_active"),
    ),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      throw new Error("User ID is required");
    }

    const existing = await ctx.db
      .query("user_details")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      // Update existing entry for today
      await ctx.db.patch(existing._id, {
        height: args.height,
        weight: args.weight,
        age: args.age,
        gender: args.gender,
        bodyFatPercentage: args.bodyFatPercentage,
        goal: args.goal,
        activityLevel: args.activityLevel,
      });
    } else {
      await ctx.db.insert("user_details", {
        userId: args.userId,
        height: args.height,
        weight: args.weight,
        age: args.age,
        gender: args.gender,
        bodyFatPercentage: args.bodyFatPercentage,
        goal: args.goal,
        activityLevel: args.activityLevel,
        createdAt: Date.now(),
      });
    }
  },
});

export const getUserStats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_details")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

export const logOrUpdateTargets = mutation({
  args: {
    userId: v.id("users"),

    dailyCaloriesIntake: v.number(),
    dailyProtein: v.number(),
    dailyCarbs: v.number(),
    dailyFats: v.number(),
    dailyFiber: v.number(),

    dailyCaloriesBurn: v.number(),
    dailyStepCount: v.number(),
    dailyWaterIntake: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("user_targets")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      )
      .unique();

    if (existing) {
      // Update existing entry for the date
      await ctx.db.patch(existing._id, {
        dailyCaloriesIntake: args.dailyCaloriesIntake,
        dailyProtein: args.dailyProtein,
        dailyCarbs: args.dailyCarbs,
        dailyFats: args.dailyFats,
        dailyFiber: args.dailyFiber,
        dailyCaloriesBurn: args.dailyCaloriesBurn,
        dailyStepCount: args.dailyStepCount,
        dailyWaterIntake: args.dailyWaterIntake,
      });
    } else {
      await ctx.db.insert("user_targets", {
        userId: args.userId,
        dailyCaloriesIntake: args.dailyCaloriesIntake,
        dailyProtein: args.dailyProtein,
        dailyCarbs: args.dailyCarbs,
        dailyFats: args.dailyFats,
        dailyFiber: args.dailyFiber,
        dailyCaloriesBurn: args.dailyCaloriesBurn,
        dailyStepCount: args.dailyStepCount,
        dailyWaterIntake: args.dailyWaterIntake,
        createdAt: Date.now(),
      });
    }
  },
});

export const getUserTargets = query({
  args: {
    userId: v.id("users"),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_targets")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      )
      .unique();
  },
});