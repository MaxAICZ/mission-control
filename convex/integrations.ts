import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all integrations
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("integrations").order("desc").take(20);
  },
});

// Get integration by type
export const getByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("integrations")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .first();
  },
});

// Create or update integration
export const upsert = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    status: v.string(),
    config: v.optional(v.object({})),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("integrations")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        lastSync: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("integrations", {
        ...args,
        lastSync: Date.now(),
        createdAt: Date.now(),
      });
    }
  },
});

// Update status
export const updateStatus = mutation({
  args: {
    id: v.id("integrations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      lastSync: Date.now(),
    });
  },
});
