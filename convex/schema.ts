import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "todo", "doing", "done"
    priority: v.string(), // "low", "medium", "high"
    assignedTo: v.string(), // "max" or "izaak"
    createdAt: v.number(),
    updatedAt: v.number(),
    dueDate: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_priority", ["priority"]),

  memories: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_created", ["createdAt"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    attendees: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_startTime", ["startTime"]),
});
