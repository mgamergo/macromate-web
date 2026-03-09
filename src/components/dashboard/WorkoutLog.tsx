"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { getStartAndEndOfDay } from "@/src/lib/utils";
import { Dumbbell, Trash2 } from "lucide-react";
import { WorkoutModal } from "./workout/WorkoutModal";

export function WorkoutLog() {
  const { convexUserId } = useZustand();
  const { startOfToday, endOfToday } = getStartAndEndOfDay(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  const workouts = useQuery(
    api.workouts.getWorkoutsByDay,
    convexUserId
      ? { userId: convexUserId, from: startOfToday, to: endOfToday }
      : "skip"
  ) ?? [];

  const deleteWorkout = useMutation(api.workouts.deleteWorkout);

  const todaysWorkout = workouts[0] ?? null;

  return (
    <>
      <Card className="h-fit border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold">Today&apos;s Workout</CardTitle>
          <Dumbbell className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {!todaysWorkout ? (
            <div className="flex flex-col items-center justify-center py-6 gap-3 text-muted-foreground">
              <Dumbbell className="h-10 w-10 opacity-30" />
              <p className="text-sm">No workout logged today</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(true)}
                className="border-teal/20 text-teal hover:bg-teal/10 hover:border-teal"
              >
                Log Workout
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{todaysWorkout.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteWorkout({ workoutId: todaysWorkout._id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {todaysWorkout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.sets} sets x {exercise.reps} reps
                      </p>
                    </div>
                    <div className="text-sm font-bold text-blue-500">
                      {exercise.weight}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <WorkoutModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
