import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        clerkUserId: v.string(),
        pictureUrl: v.optional(v.string()),

        createdAt: v.number(),
    }).index("by_clerk_id", ["clerkUserId"]),

    meals: defineTable({
        userId: v.id("users"),
        name: v.string(),
        calories: v.number(),
        protein: v.number(),
        carbs: v.number(),
        fats: v.number(),
        type: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner"), v.literal("snack")),

        createdAt: v.number(),
    }).index("by_user", ["userId"]),

    steps: defineTable({
        userId: v.id("users"),
        stepCount: v.number(),

        createdAt: v.number(),
    }).index("by_user", ["userId"])
    .index("by_user_createdAt", ["userId", "createdAt"]),
});

