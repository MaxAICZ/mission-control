import { apiFromModules } from "convex/server";
import * as tasks from "../tasks.js";
import * as memories from "../memories.js";
import * as events from "../events.js";
import * as agentActivity from "../agentActivity.js";
import * as integrations from "../integrations.js";

export const api = apiFromModules({
  tasks,
  memories,
  events,
  agentActivity,
  integrations,
});
