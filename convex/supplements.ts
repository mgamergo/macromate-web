import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addSupplement = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    dosage: v.string(),
    stock: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("supplements", {
      userId: args.userId,
      name: args.name,
      dosage: args.dosage,
      stock: args.stock,
      taken: false,
      createdAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const toggleSupplement = mutation({
  args: {
    supplementId: v.id("supplements"),
    taken: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.supplementId, { taken: args.taken });
  },
});

export const deleteSupplement = mutation({
  args: {
    supplementId: v.id("supplements"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.supplementId);
  },
});

export const getSupplements = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("supplements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const resetDailyTaken = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const supplements = await ctx.db
      .query("supplements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const supp of supplements) {
      await ctx.db.patch(supp._id, { taken: false });
    }
  },
});
