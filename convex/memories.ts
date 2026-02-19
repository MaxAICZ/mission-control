import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all memories
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memories").order("desc").take(100);
  },
});

// Get memories by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memories")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .take(50);
  },
});

// Search memories (simple contains)
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("memories").take(200);
    const lowerQuery = args.query.toLowerCase();
    return all.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) || 
      m.content.toLowerCase().includes(lowerQuery)
    );
  },
});

// Create memory
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    source: v.string(),
    importance: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("memories", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get critical memories (for quick access)
export const getCritical = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("memories")
      .withIndex("by_importance", (q) => q.eq("importance", "critical"))
      .order("desc")
      .take(20);
  },
});
