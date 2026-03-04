import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkUserId: v.string(),
    pictureUrl: v.optional(v.string()),

    isOnboarded: v.optional(v.boolean()),

    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkUserId"]),

  user_details: defineTable({
    userId: v.id("users"),

    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    age: v.optional(v.number()),
    gender: v.optional(
      v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    ),
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

    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  user_targets: defineTable({
    userId: v.id("users"),

    dailyCaloriesIntake: v.number(),
    dailyProtein: v.number(),
    dailyCarbs: v.number(),
    dailyFats: v.number(),
    dailyFiber: v.number(),

    dailyCaloriesBurn: v.number(),
    dailyStepCount: v.number(),
    dailyWaterIntake: v.number(),

    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  meals: defineTable({
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
      v.literal("snack"),
    ),

    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  steps: defineTable({
    userId: v.id("users"),
    stepCount: v.number(),

    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_createdAt", ["userId", "createdAt"]),

  workouts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    exercises: v.array(
      v.object({
        name: v.string(),
        sets: v.number(),
        reps: v.string(),
        weight: v.string(),
      }),
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_createdAt", ["userId", "createdAt"]),

  supplements: defineTable({
    userId: v.id("users"),
    name: v.string(),
    dosage: v.string(),
    taken: v.boolean(),
    stock: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  weight_logs: defineTable({
    userId: v.id("users"),
    weight: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_createdAt", ["userId", "createdAt"]),

  water_logs: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_createdAt", ["userId", "createdAt"]),
});
