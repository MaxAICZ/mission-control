import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all calendar events
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").order("asc").take(50);
  },
});

// Get upcoming events
export const getUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query("events")
      .withIndex("by_startTime", (q) => q.gt("startTime", now))
      .order("asc")
      .take(20);
  },
});

// Get events with Meet links
export const getWithMeet = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_startTime", (q) => q.gt("startTime", now))
      .order("asc")
      .take(20);
    return events.filter((e: any) => e.meetLink);
  },
});

// Sync events from Google Calendar
export const syncEvents = mutation({
  args: {
    events: v.array(v.object({
      title: v.string(),
      startTime: v.number(),
      endTime: v.number(),
      attendees: v.array(v.string()),
      meetLink: v.optional(v.string()),
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
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          attendees: event.attendees,
          meetLink: event.meetLink,
          status: "scheduled",
          hasRecording: false,
          recordingAnalyzed: false,
          createdAt: Date.now(),
        });
      }
    }
  },
});
