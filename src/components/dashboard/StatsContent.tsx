"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { subDays, format, startOfDay, endOfDay } from "date-fns";
import { Footprints, Flame, Scale, Dumbbell } from "lucide-react";

function buildLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      label: format(d, "EEE"),
      from: startOfDay(d).getTime(),
      to: endOfDay(d).getTime(),
    };
  });
}

export function StatsContent() {
  const { convexUserId } = useZustand();

  const days = buildLast7Days();
  const from = days[0].from;
  const to = days[6].to;

  const meals = useQuery(
    api.meals.getMealsByDates,
    convexUserId ? { userId: convexUserId, from, to } : "skip"
  ) ?? [];

  const steps = useQuery(
    api.steps.getStepsByDay,
    convexUserId ? { userId: convexUserId, from, to } : "skip"
  ) ?? [];

  const weightLogs = useQuery(
    api.weightLogs.getWeightHistory,
    convexUserId ? { userId: convexUserId, from, to } : "skip"
  ) ?? [];

  const workouts = useQuery(
    api.workouts.getWorkoutsByDay,
    convexUserId ? { userId: convexUserId, from, to } : "skip"
  ) ?? [];

  const userTargets = useQuery(
    api.stats.getUserTargets,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  // Build per-day data points
  const chartData = days.map(({ label, from: dayFrom, to: dayTo }) => {
    const dayMeals = meals.filter(
      (m) => m._creationTime >= dayFrom && m._creationTime <= dayTo
    );
    const daySteps = steps.filter(
      (s) => s.createdAt >= dayFrom && s.createdAt <= dayTo
    );
    const dayWeight = weightLogs
      .filter((w) => w.createdAt >= dayFrom && w.createdAt <= dayTo)
      .pop();
    const dayWorkouts = workouts.filter(
      (w) => w.createdAt >= dayFrom && w.createdAt <= dayTo
    );

    const calories = dayMeals.reduce((s, m) => s + m.calories, 0);
    const protein = dayMeals.reduce((s, m) => s + m.protein, 0);
    const carbs = dayMeals.reduce((s, m) => s + m.carbs, 0);
    const fats = dayMeals.reduce((s, m) => s + m.fats, 0);
    const totalSteps = daySteps.reduce((s, e) => s + e.stepCount, 0);

    return {
      day: label,
      calories,
      protein,
      carbs,
      fats,
      steps: totalSteps,
      weight: dayWeight?.weight ?? null,
      workouts: dayWorkouts.length,
    };
  });

  const goalCalories = userTargets?.dailyCaloriesIntake ?? 2500;
  const goalSteps = userTargets?.dailyStepCount ?? 10000;
  const goalProtein = userTargets?.dailyProtein ?? 150;

  // Stat cards
  const totalCalories = chartData.reduce((s, d) => s + d.calories, 0);
  const avgCalories = Math.round(totalCalories / 7);
  const totalSteps7d = chartData.reduce((s, d) => s + d.steps, 0);
  const avgSteps = Math.round(totalSteps7d / 7);
  const totalWorkouts = chartData.reduce((s, d) => s + d.workouts, 0);
  const latestWeight = [...weightLogs].reverse().find((w) => w.weight)?.weight;

  const statCards = [
    {
      label: "Avg Calories",
      value: `${avgCalories} kcal`,
      sub: `Goal: ${goalCalories}`,
      Icon: Flame,
      color: "text-orange-400",
    },
    {
      label: "Avg Steps",
      value: avgSteps.toLocaleString(),
      sub: `Goal: ${goalSteps.toLocaleString()}`,
      Icon: Footprints,
      color: "text-teal",
    },
    {
      label: "Latest Weight",
      value: latestWeight ? `${latestWeight} kg` : "—",
      sub: "Last recorded",
      Icon: Scale,
      color: "text-purple-400",
    },
    {
      label: "Workouts",
      value: totalWorkouts.toString(),
      sub: "Past 7 days",
      Icon: Dumbbell,
      color: "text-blue-400",
    },
  ];

  if (!convexUserId) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, Icon, color }) => (
          <Card key={label} className="border-teal/20 shadow-lg shadow-teal/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{label}</span>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calorie Chart */}
      <Card className="border-teal/20 shadow-lg shadow-teal/5">
        <CardHeader>
          <CardTitle className="text-teal font-bold">
            7-Day Calorie Intake
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
                itemStyle={{ color: "var(--foreground)" }}
              />
              <Bar
                dataKey="calories"
                name="Calories"
                fill="var(--teal)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Macros Chart */}
      <Card className="border-teal/20 shadow-lg shadow-teal/5">
        <CardHeader>
          <CardTitle className="text-teal font-bold">
            7-Day Macro Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
                itemStyle={{ color: "var(--foreground)" }}
              />
              <Legend />
              <Bar
                dataKey="protein"
                name="Protein (g)"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
                stackId="macro"
              />
              <Bar
                dataKey="carbs"
                name="Carbs (g)"
                fill="var(--chart-2)"
                stackId="macro"
              />
              <Bar
                dataKey="fats"
                name="Fats (g)"
                fill="var(--chart-3)"
                radius={[0, 0, 4, 4]}
                stackId="macro"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Steps Chart */}
      <Card className="border-teal/20 shadow-lg shadow-teal/5">
        <CardHeader>
          <CardTitle className="text-teal font-bold">7-Day Step Count</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
                itemStyle={{ color: "var(--foreground)" }}
              />
              <Bar
                dataKey="steps"
                name="Steps"
                fill="var(--chart-4)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weight Trend */}
      {weightLogs.length > 0 && (
        <Card className="border-teal/20 shadow-lg shadow-teal/5">
          <CardHeader>
            <CardTitle className="text-teal font-bold">
              Weight Trend (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.filter((d) => d.weight !== null)}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  formatter={(v: number) => [`${v} kg`, "Weight"]}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="var(--teal)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--teal)",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "var(--background)",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
