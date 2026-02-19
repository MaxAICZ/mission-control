import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Store meeting recordings/transcripts
export const addRecording = mutation({
  args: {
    eventId: v.id("events"),
    transcript: v.string(),
    summary: v.string(),
    actionItems: v.array(v.string()),
    insights: v.string(),
    sentBy: v.string(),
    receivedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("meetings", {
      ...args,
      processed: false,
      createdAt: Date.now(),
    });
  },
});

// Get unprocessed recordings (for proactive analysis)
export const getUnprocessed = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("meetings")
      .withIndex("by_processed", (q) => q.eq("processed", false))
      .order("desc")
      .take(10);
  },
});

// Mark as processed and create tasks
export const processRecording = mutation({
  args: {
    id: v.id("meetings"),
    tasksCreated: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      processed: true,
      tasksCreated: args.tasksCreated,
      processedAt: Date.now(),
    });
  },
});

// Get all recordings with insights
export const getAllWithInsights = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("meetings").order("desc").take(50);
  },
});
