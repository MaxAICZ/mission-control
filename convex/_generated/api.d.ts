import type { ApiFromModules } from "convex/server";
import type * as tasks from "../tasks.js";
import type * as memories from "../memories.js";
import type * as events from "../events.js";
import type * as agentActivity from "../agentActivity.js";
import type * as integrations from "../integrations.js";

declare const fullApi: ApiFromModules<{
  tasks: typeof tasks;
  memories: typeof memories;
  events: typeof events;
  agentActivity: typeof agentActivity;
  integrations: typeof integrations;
}>;

export declare const api: typeof fullApi;
