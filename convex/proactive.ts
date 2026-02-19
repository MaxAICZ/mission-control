import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Store proactive suggestions
export const createSuggestion = mutation({
  args: {
    type: v.string(), // "task", "insight", "followup", "opportunity"
    source: v.string(), // "meeting", "email", "calendar", "analysis"
    title: v.string(),
    description: v.string(),
    reasoning: v.string(),
    priority: v.string(), // "low", "medium", "high", "urgent"
    autoExecute: v.boolean(),
    executed: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("proactive", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get pending suggestions
export const getPending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("proactive")
      .withIndex("by_executed", (q) => q.eq("executed", false))
      .order("desc")
      .take(20);
  },
});

// Mark suggestion as executed or dismissed
export const markExecuted = mutation({
  args: {
    id: v.id("proactive"),
    result: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      executed: true,
      result: args.result,
      executedAt: Date.now(),
    });
  },
});

// Get insights by type
export const getByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("proactive")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc")
      .take(20);
  },
});
