"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { mockMeals } from "@/src/lib/mockData";
import { Clock } from "lucide-react";

export function MealList() {
  return (
    <Card className="h-fit border-teal/20 shadow-lg shadow-teal/5">
      <CardHeader>
        <CardTitle className="text-teal font-bold">Today's Meals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockMeals.map((meal) => (
          <div key={meal.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
            <div className="space-y-1">
              <p className="font-medium leading-none">{meal.name}</p>
              <div className="flex items-center text-xs text-muted-foreground gap-2">
                <Clock className="h-3 w-3" />
                <span>{meal.time}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-teal">{meal.calories} kcal</p>
              <p className="text-xs text-muted-foreground">
                P:{meal.protein} C:{meal.carbs} F:{meal.fats}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
