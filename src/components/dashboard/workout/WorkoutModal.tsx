"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { Plus, Trash2 } from "lucide-react";

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

const emptyExercise = (): Exercise => ({
  name: "",
  sets: "",
  reps: "",
  weight: "",
});

export function WorkoutModal({ isOpen, onClose }: WorkoutModalProps) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([emptyExercise()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { convexUserId } = useZustand();
  const logWorkout = useMutation(api.workouts.logWorkout);

  const handleExerciseChange = (
    index: number,
    field: keyof Exercise,
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, emptyExercise()]);
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!workoutName.trim()) newErrors.workoutName = "Workout name is required";
    if (exercises.length === 0)
      newErrors.exercises = "Add at least one exercise";
    exercises.forEach((ex, i) => {
      if (!ex.name.trim())
        newErrors[`ex_name_${i}`] = "Exercise name is required";
      if (!ex.sets.trim() || isNaN(Number(ex.sets)) || Number(ex.sets) <= 0)
        newErrors[`ex_sets_${i}`] = "Valid sets required";
      if (!ex.reps.trim()) newErrors[`ex_reps_${i}`] = "Reps required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!convexUserId || !validate()) return;
    setIsSubmitting(true);
    try {
      await logWorkout({
        userId: convexUserId,
        name: workoutName,
        exercises: exercises.map((ex) => ({
          name: ex.name,
          sets: Number(ex.sets),
          reps: ex.reps,
          weight: ex.weight || "Bodyweight",
        })),
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setWorkoutName("");
    setExercises([emptyExercise()]);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Workout</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Workout Name */}
          <div className="grid gap-2">
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              placeholder="e.g., Push Day (Chest & Triceps)"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
            {errors.workoutName && (
              <p className="text-sm text-red-500">{errors.workoutName}</p>
            )}
          </div>

          {/* Exercises */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Exercises</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercise}
                className="border-teal/20 text-teal hover:bg-teal/10 hover:border-teal"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Exercise
              </Button>
            </div>

            {errors.exercises && (
              <p className="text-sm text-red-500">{errors.exercises}</p>
            )}

            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="border border-border/50 rounded-lg p-3 space-y-2 bg-muted/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Exercise {index + 1}
                  </span>
                  {exercises.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(index)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-2">
                  <Input
                    placeholder="Exercise name (e.g., Bench Press)"
                    value={exercise.name}
                    onChange={(e) =>
                      handleExerciseChange(index, "name", e.target.value)
                    }
                  />
                  {errors[`ex_name_${index}`] && (
                    <p className="text-xs text-red-500">
                      {errors[`ex_name_${index}`]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-1">
                    <Label className="text-xs">Sets</Label>
                    <Input
                      type="number"
                      placeholder="3"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) =>
                        handleExerciseChange(index, "sets", e.target.value)
                      }
                    />
                    {errors[`ex_sets_${index}`] && (
                      <p className="text-xs text-red-500">
                        {errors[`ex_sets_${index}`]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Reps</Label>
                    <Input
                      placeholder="8-10"
                      value={exercise.reps}
                      onChange={(e) =>
                        handleExerciseChange(index, "reps", e.target.value)
                      }
                    />
                    {errors[`ex_reps_${index}`] && (
                      <p className="text-xs text-red-500">
                        {errors[`ex_reps_${index}`]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Weight</Label>
                    <Input
                      placeholder="80kg"
                      value={exercise.weight}
                      onChange={(e) =>
                        handleExerciseChange(index, "weight", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-teal hover:bg-teal/90"
          >
            {isSubmitting ? "Saving..." : "Log Workout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
