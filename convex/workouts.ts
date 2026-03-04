import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const exerciseValidator = v.object({
  name: v.string(),
  sets: v.number(),
  reps: v.string(),
  weight: v.string(),
});

export const logWorkout = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    exercises: v.array(exerciseValidator),
  },
  handler: async (ctx, args) => {
    const workoutId = await ctx.db.insert("workouts", {
      userId: args.userId,
      name: args.name,
      exercises: args.exercises,
      createdAt: Date.now(),
    });
    return await ctx.db.get(workoutId);
  },
});

export const getWorkoutsByDay = query({
  args: {
    userId: v.id("users"),
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workouts")
      .withIndex("by_user_createdAt", (q) =>
        q
          .eq("userId", args.userId)
          .gte("createdAt", args.from)
          .lte("createdAt", args.to),
      )
      .collect();
  },
});

export const deleteWorkout = mutation({
  args: {
    workoutId: v.id("workouts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.workoutId);
  },
});
