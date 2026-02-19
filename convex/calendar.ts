import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Store calendar events fetched from Google
export const syncEvents = mutation({
  args: {
    events: v.array(v.object({
      id: v.string(),
      summary: v.string(),
      startTime: v.number(),
      endTime: v.number(),
      attendees: v.array(v.string()),
      meetLink: v.optional(v.string()),
      hasRecording: v.optional(v.boolean()),
      recordingAnalyzed: v.optional(v.boolean()),
      insights: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    for (const event of args.events) {
      const existing = await ctx.db
        .query("events")
        .withIndex("by_startTime", (q) => q.eq("startTime", event.startTime))
        .first();
      
      if (!existing) {
        await ctx.db.insert("events", {
          ...event,
          createdAt: Date.now(),
        });
      }
    }
  },
});

// Get upcoming meetings with Meet links
export const getUpcomingWithMeet = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_startTime", (q) => q.gt("startTime", now))
      .order("asc")
      .take(20);
    
    return events.filter(e => e.meetLink);
  },
});

// Mark event as having recording analyzed
export const markRecordingAnalyzed = mutation({
  args: {
    id: v.id("events"),
    insights: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      recordingAnalyzed: true,
      insights: args.insights,
      updatedAt: Date.now(),
    });
  },
});
