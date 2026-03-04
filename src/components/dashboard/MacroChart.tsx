"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { getStartAndEndOfDay } from "@/src/lib/utils";

export function MacroChart() {
  const { convexUserId } = useZustand();
  const { startOfToday, endOfToday } = getStartAndEndOfDay(new Date());

  const meals = useQuery(
    api.meals.getMealsByDates,
    convexUserId
      ? {
          userId: convexUserId,
          from: startOfToday,
          to: endOfToday,
        }
      : "skip"
  ) ?? [];

  const userTargets = useQuery(
    api.stats.getUserTargets,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  const totals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fats += meal.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const goalCalories = userTargets?.dailyCaloriesIntake ?? 2500;
  const goalProtein = userTargets?.dailyProtein ?? 150;
  const goalCarbs = userTargets?.dailyCarbs ?? 300;
  const goalFats = userTargets?.dailyFats ?? 80;
  const goalFiber = userTargets?.dailyFiber ?? 30;

  const macros = [
    { name: "Protein", value: totals.protein, goal: goalProtein, color: "var(--chart-1)" },
    { name: "Carbs", value: totals.carbs, goal: goalCarbs, color: "var(--chart-2)" },
    { name: "Fats", value: totals.fats, goal: goalFats, color: "var(--chart-3)" },
    { name: "Fiber", value: 0, goal: goalFiber, color: "var(--chart-4)" },
  ];

  const data = [
    { name: "Protein", value: totals.protein, color: "var(--chart-1)" },
    { name: "Carbs", value: totals.carbs, color: "var(--chart-2)" },
    { name: "Fats", value: totals.fats, color: "var(--chart-3)" },
    { name: "Remaining", value: Math.max(0, goalCalories - totals.calories), color: "var(--muted)" },
  ];

  return (
    <Card className="h-fit border-teal/20 shadow-lg shadow-teal/5">
      <CardHeader>
        <CardTitle className="text-teal font-bold">Daily Macros</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-foreground">{totals.calories}</span>
          <span className="text-xs text-muted-foreground">/ {goalCalories} kcal</span>
        </div>
      </CardContent>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 justify-around p-4 text-sm">
        {macros.map((macro) => (
          <div key={macro.name} className="flex flex-col items-center">
            <span className="font-medium text-muted-foreground">{macro.name}</span>
            <span className="font-bold text-foreground">
              {macro.value}/{macro.goal}g
            </span>
            <div className="w-full h-1 bg-muted mt-1 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, macro.goal > 0 ? (macro.value / macro.goal) * 100 : 0)}%`,
                  backgroundColor: macro.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
