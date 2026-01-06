import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addSteps = mutation({
    args: {
        userId: v.id("users"),
        steps: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("steps", {
            userId: args.userId,
            stepCount: args.steps,
            createdAt: Date.now(),
        })
    }
})

export const getStepsByDay = query({
    args: {
        userId: v.id("users"),
        from: v.number(),
        to: v.number(),
    },
    handler: async (ctx,args) => {
        return await ctx.db.query("steps")
        .withIndex("by_user_createdAt", q => 
            q.eq("userId", args.userId)
            .gte("createdAt", args.from)
            .lte("createdAt", args.to)
        )
        .collect();
    }
})