import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get current activity
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("agentActivity")
      .withIndex("by_status", (q) => q.eq("status", "working"))
      .order("desc")
      .take(20);
  },
});

// Get all activity
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agentActivity").order("desc").take(50);
  },
});

// Log activity
export const logActivity = mutation({
  args: {
    agentName: v.string(),
    action: v.string(),
    details: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentActivity", {
      ...args,
      startedAt: Date.now(),
    });
  },
});

// Update activity status
export const updateStatus = mutation({
  args: {
    id: v.id("agentActivity"),
    status: v.string(),
    completedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      completedAt: args.completedAt,
    });
  },
});
