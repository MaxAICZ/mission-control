import type { ApiFromModules } from "convex/server";
import type * as tasks from "../tasks.js";

declare const fullApi: ApiFromModules<{
  tasks: typeof tasks;
}>;
export declare const api: typeof fullApi;
