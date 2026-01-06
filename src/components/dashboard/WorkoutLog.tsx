"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { mockWorkout } from "@/src/lib/mockData";
import { Dumbbell } from "lucide-react";

export function WorkoutLog() {
  return (
    <Card className="h-fit border-teal/20 shadow-lg shadow-teal/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-teal font-bold">Today's Workout</CardTitle>
        <Dumbbell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-semibold text-lg">{mockWorkout.name}</h3>
        </div>
        <div className="space-y-4">
          {mockWorkout.exercises.map((exercise, index) => (
            <div key={index} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
              <div>
                <p className="font-medium text-sm">{exercise.name}</p>
                <p className="text-xs text-muted-foreground">
                  {exercise.sets} sets x {exercise.reps} reps
                </p>
              </div>
              <div className="text-sm font-bold text-teal">
                {exercise.weight}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
