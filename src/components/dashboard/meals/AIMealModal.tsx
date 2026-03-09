"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { Id } from "@/convex/_generated/dataModel";
import { Sparkles, Loader2, Check, AlertCircle } from "lucide-react";

interface AIMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIMealModal({ isOpen, onClose }: AIMealModalProps) {
  const [input, setInput] = useState("");
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("lunch");
  const [jobId, setJobId] = useState<Id<"macro_jobs"> | null>(null);
  const [error, setError] = useState("");

  const { convexUserId } = useZustand();
  const createJob = useMutation(api.macroJobs.createJob);
  const logMeal = useMutation(api.meals.logMeal);

  const job = useQuery(
    api.macroJobs.getJob,
    jobId ? { jobId } : "skip",
  );

  // Auto-log meal when job completes
  useEffect(() => {
    if (job?.status === "done" && job.result && convexUserId && jobId) {
      logMeal({
        userId: convexUserId,
        name: job.result.name || "AI Meal",
        calories: job.result.calories,
        protein: job.result.protein_g,
        carbs: job.result.carbs_g,
        fats: job.result.fat_g,
        type: mealType,
      });
      // Brief delay to show success, then close
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  }, [job?.status]);

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError("Please describe what you ate");
      return;
    }
    if (!convexUserId) return;

    setError("");
    const id = await createJob({
      userId: convexUserId,
      input: input.trim(),
    });
    setJobId(id);
  };

  const handleClose = () => {
    setInput("");
    setJobId(null);
    setError("");
    setMealType("lunch");
    onClose();
  };

  const isProcessing = job?.status === "pending" || job?.status === "processing";
  const isDone = job?.status === "done";
  const isError = job?.status === "error";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            AI Macro Calculator
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Type what you ate with quantities and AI will calculate the macros for you.
          </p>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ai-input" className="text-sm font-medium">
              Describe your meal with quantities
            </Label>
            <Textarea
              id="ai-input"
              placeholder="e.g., 50g oats, 250ml milk, 1 banana, 1 scoop whey (30g, 24g protein)"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              rows={4}
              disabled={isProcessing || isDone}
              className="resize-none transition-colors focus-visible:ring-violet-500"
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ai-meal-type">Meal Type</Label>
            <Select
              value={mealType}
              onValueChange={(v) =>
                setMealType(v as "breakfast" | "lunch" | "dinner" | "snack")
              }
              disabled={isProcessing || isDone}
            >
              <SelectTrigger id="ai-meal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status display */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Loader2 className="h-5 w-5 text-violet-500 animate-spin" />
              <div>
                <p className="text-sm font-medium text-violet-400">
                  Calculating macros...
                </p>
                <p className="text-xs text-muted-foreground">
                  AI is analyzing your meal description
                </p>
              </div>
            </div>
          )}

          {isDone && job?.result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-500">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Macros calculated & logged!
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  {
                    label: "Cal",
                    value: job.result.calories,
                    unit: "",
                    color: "text-orange-400",
                  },
                  {
                    label: "Protein",
                    value: job.result.protein_g,
                    unit: "g",
                    color: "text-blue-400",
                  },
                  {
                    label: "Carbs",
                    value: job.result.carbs_g,
                    unit: "g",
                    color: "text-amber-400",
                  },
                  {
                    label: "Fat",
                    value: job.result.fat_g,
                    unit: "g",
                    color: "text-rose-400",
                  },
                  {
                    label: "Fiber",
                    value: job.result.fiber_g,
                    unit: "g",
                    color: "text-emerald-400",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col items-center p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {m.label}
                    </span>
                    <span className={`text-lg font-bold ${m.color}`}>
                      {m.value}
                      <span className="text-xs font-normal">{m.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isError && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 overflow-hidden">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-red-400">
                  Calculation failed
                </p>
                <p className="text-xs text-muted-foreground break-words [overflow-wrap:anywhere]">
                  {job?.error || "Please try again"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {isDone ? "Close" : "Cancel"}
          </Button>
          {!isDone && (
            <Button
              onClick={handleSubmit}
              disabled={isProcessing || !input.trim()}
              className="bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Calculate Macros
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
