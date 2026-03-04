/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as meals from "../meals.js";
import type * as stats from "../stats.js";
import type * as steps from "../steps.js";
import type * as supplements from "../supplements.js";
import type * as users from "../users.js";
import type * as waterLogs from "../waterLogs.js";
import type * as weightLogs from "../weightLogs.js";
import type * as workouts from "../workouts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  meals: typeof meals;
  stats: typeof stats;
  steps: typeof steps;
  supplements: typeof supplements;
  users: typeof users;
  waterLogs: typeof waterLogs;
  weightLogs: typeof weightLogs;
  workouts: typeof workouts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
