import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "todo", "doing", "done"
    priority: v.string(), // "low", "medium", "high", "urgent"
    assignedTo: v.string(), // "max" or "izaak"
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()), // "manual", "meeting", "proactive"
  })
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_priority", ["priority"])
    .index("by_created", ["createdAt"]),

  memories: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(), // "decision", "preference", "project", "lesson", "context"
    source: v.string(), // donde vino (email, chat, file, meeting)
    importance: v.string(), // "low", "medium", "high", "critical"
    createdAt: v.number(),
    updatedAt: v.number(),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_category", ["category"])
    .index("by_importance", ["importance"])
    .index("by_created", ["createdAt"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    attendees: v.array(v.string()),
    location: v.optional(v.string()),
    meetLink: v.optional(v.string()),
    status: v.string(), // "scheduled", "confirmed", "cancelled"
    hasRecording: v.optional(v.boolean()),
    recordingAnalyzed: v.optional(v.boolean()),
    insights: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_startTime", ["startTime"])
    .index("by_status", ["status"]),

  meetings: defineTable({
    eventId: v.id("events"),
    transcript: v.string(),
    summary: v.string(),
    actionItems: v.array(v.string()),
    insights: v.string(),
    sentBy: v.string(),
    receivedAt: v.number(),
    processed: v.boolean(),
    tasksCreated: v.optional(v.array(v.string())),
    processedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_processed", ["processed"])
    .index("by_received", ["receivedAt"]),

  proactive: defineTable({
    type: v.string(), // "task", "insight", "followup", "opportunity"
    source: v.string(), // "meeting", "email", "calendar", "analysis"
    title: v.string(),
    description: v.string(),
    reasoning: v.string(),
    priority: v.string(), // "low", "medium", "high", "urgent"
    autoExecute: v.boolean(),
    executed: v.boolean(),
    result: v.optional(v.string()),
    executedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_executed", ["executed"])
    .index("by_type", ["type"])
    .index("by_priority", ["priority"]),

  agentActivity: defineTable({
    agentName: v.string(),
    action: v.string(),
    details: v.optional(v.string()),
    status: v.string(), // "working", "idle", "completed", "error"
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_agent", ["agentName"])
    .index("by_status", ["status"])
    .index("by_started", ["startedAt"]),

  integrations: defineTable({
    name: v.string(),
    type: v.string(), // "github", "notion", "gmail", "calendar", etc
    status: v.string(), // "connected", "disconnected", "error"
    lastSync: v.optional(v.number()),
    config: v.optional(v.object({})),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"]),
});
