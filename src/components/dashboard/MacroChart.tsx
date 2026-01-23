"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { mockMacros, mockMeals } from "@/src/lib/mockData";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { getStartAndEndOfDay } from "@/src/lib/utils";

type Meal = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export function MacroChart() {
  const totalCalories = mockMeals.reduce((acc, meal) => acc + meal.calories, 0);
  const goalCalories = 2500;
  const { convexUserId } = useZustand();
  const { startOfToday, endOfToday } = getStartAndEndOfDay(new Date());

  const meals = useQuery(
    api.meals.getMealsByDates,
    convexUserId ?{
      userId: convexUserId,
      from: startOfToday,
      to: endOfToday,
    } : "skip"
  ) ?? [];

  const totals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs+= meal.carbs;
      acc.fats += meal.fats;
      return acc;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    } as Meal
  );

  const data = [
    { name: "Protein", value: mockMacros[0].value, color: "var(--chart-1)" },
    { name: "Carbs", value: mockMacros[1].value, color: "var(--chart-2)" },
    { name: "Fats", value: mockMacros[2].value, color: "var(--chart-3)" },
    { name: "Fiber", value: mockMacros[3]?.value ?? 0, color: "var(--chart-4)" },
    { name: "Remaining", value: Math.max(0, goalCalories - totalCalories), color: "var(--muted)" },
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
          <span className="text-3xl font-bold text-foreground">{totalCalories}</span>
          <span className="text-xs text-muted-foreground">/ {goalCalories} kcal</span>
        </div>
      </CardContent>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 justify-around p-4 text-sm">
        {mockMacros.map((macro) => (
          <div key={macro.name} className="flex flex-col items-center">
            <span className="font-medium text-muted-foreground">{macro.name}</span>
            <span className="font-bold text-foreground">
              {macro.value}/{macro.goal}g
            </span>
            <div className="w-full h-1 bg-muted mt-1 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${Math.min(100, (macro.value / macro.goal) * 100)}%`,
                  backgroundColor: macro.color 
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
