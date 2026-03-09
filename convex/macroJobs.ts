import {
  mutation,
  query,
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Create a new macro calculation job (called from frontend)
export const createJob = mutation({
  args: {
    userId: v.id("users"),
    input: v.string(),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("macro_jobs", {
      userId: args.userId,
      input: args.input,
      status: "pending",
      createdAt: Date.now(),
    });

    // Fire and forget — schedule the LLM action
    await ctx.scheduler.runAfter(0, internal.macroJobs.processJob, {
      jobId,
    });

    return jobId;
  },
});

// Internal mutation to update the job result (called from action)
export const updateJobResult = internalMutation({
  args: {
    jobId: v.id("macro_jobs"),
    status: v.union(
      v.literal("processing"),
      v.literal("done"),
      v.literal("error"),
    ),
    result: v.optional(
      v.object({
        name: v.optional(v.string()),
        calories: v.number(),
        protein_g: v.number(),
        fat_g: v.number(),
        carbs_g: v.number(),
        fiber_g: v.number(),
      }),
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: args.status,
      ...(args.result !== undefined ? { result: args.result } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
    });
  },
});

// Action: calls OpenRouter API with the meal description
export const processJob = internalAction({
  args: {
    jobId: v.id("macro_jobs"),
  },
  handler: async (ctx, args) => {
    // Mark as processing
    await ctx.runMutation(internal.macroJobs.updateJobResult, {
      jobId: args.jobId,
      status: "processing",
    });

    // Get the job to read input
    const job = await ctx.runQuery(internal.macroJobs.getJobInternal, {
      jobId: args.jobId,
    });

    if (!job) {
      await ctx.runMutation(internal.macroJobs.updateJobResult, {
        jobId: args.jobId,
        status: "error",
        error: "Job not found",
      });
      return;
    }

    const prompt = `/no_think

You are a nutrition calculator. The user will describe food they ate with quantities. Calculate the total macros and respond with ONLY a valid JSON object, no explanation, no markdown, no extra text.

Also generate a short 1-3 word name for this meal (e.g. "Oatmeal Bowl", "Chicken Rice", "Protein Shake").

JSON format:
{"name": "Short Name", "calories": 0, "protein_g": 0, "fat_g": 0, "carbs_g": 0, "fiber_g": 0}

User meal: ${job.input}`;

    try {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY not set");
      }

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemma-3-12b-it:free",
            messages: [{ role: "user", content: prompt }],
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `OpenRouter API error: ${response.status} ${errorText}`,
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content in LLM response");
      }

      // Extract JSON from response (handle potential markdown wrapping)
      let jsonStr = content.trim();
      // Strip markdown code fences if present
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr
          .replace(/```json?\n?/g, "")
          .replace(/```/g, "")
          .trim();
      }

      const macros = JSON.parse(jsonStr);

      // Validate the response has the expected fields
      const result = {
        name: String(macros.name || "Meal").slice(0, 50),
        calories: Number(macros.calories) || 0,
        protein_g: Number(macros.protein_g) || 0,
        fat_g: Number(macros.fat_g) || 0,
        carbs_g: Number(macros.carbs_g) || 0,
        fiber_g: Number(macros.fiber_g) || 0,
      };

      await ctx.runMutation(internal.macroJobs.updateJobResult, {
        jobId: args.jobId,
        status: "done",
        result,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await ctx.runMutation(internal.macroJobs.updateJobResult, {
        jobId: args.jobId,
        status: "error",
        error: errorMessage,
      });
    }
  },
});

// Internal query to read job data (used by action)
export const getJobInternal = internalQuery({
  args: {
    jobId: v.id("macro_jobs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

// Public query: frontend subscribes to job updates
export const getJob = query({
  args: {
    jobId: v.id("macro_jobs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

// Get recent jobs for a user
export const getRecentJobs = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    return await ctx.db
      .query("macro_jobs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});
