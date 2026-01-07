"use client";

import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import useZustand from "@/src/hooks/use-zustand";
import { Clock } from "lucide-react";
import { formatTime } from "@/src/lib/utils";

import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { getStartAndEndOfDay } from "@/src/lib/utils";

export interface Meal {
  _id: Id<"meals">;
  _creationTime: number;

  userId: Id<"users">;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  createdAt: number;
}

export function MealList() {
  const { convexUserId } = useZustand();

  const { startOfToday, endOfToday } = getStartAndEndOfDay(new Date());

  const meals =
    useQuery(
      api.meals.getMealsByDates,
      convexUserId
        ? {
            userId: convexUserId,
            from: startOfToday,
            to: endOfToday,
          }
        : "skip"
    ) ?? [];

  if (!convexUserId) return null;

  return (
    <Card className="h-fit border-teal/20 shadow-lg shadow-teal/5">
      <CardHeader>
        <CardTitle className="text-teal font-bold">Today's Meals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {meals.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No meals yet
          </div>
        ) : (
          meals.map((meal) => (
            <div
              key={meal._id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className="space-y-1">
                <p className="font-medium leading-none">{meal.name}</p>
                <div className="flex items-center text-xs text-muted-foreground gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(meal._creationTime)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-teal">{meal.calories} kcal</p>
                <p className="text-xs text-muted-foreground">
                  P:{meal.protein} C:{meal.carbs} F:{meal.fats}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
