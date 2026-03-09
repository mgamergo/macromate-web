"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
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
import {
  subDays,
  subMonths,
  format,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  differenceInDays,
} from "date-fns";
import { Footprints, Flame, Scale, Dumbbell, Calendar } from "lucide-react";

type TimeRange = "week" | "month" | "custom";

function buildDayBuckets(startDate: Date, endDate: Date) {
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const totalDays = allDays.length;

  // For ranges > 31 days, bucket into weeks to keep charts readable
  if (totalDays > 31) {
    const bucketSize = Math.ceil(totalDays / 15); // ~15 bars max
    const buckets: { label: string; from: number; to: number }[] = [];
    for (let i = 0; i < allDays.length; i += bucketSize) {
      const slice = allDays.slice(i, i + bucketSize);
      const first = slice[0];
      const last = slice[slice.length - 1];
      buckets.push({
        label:
          slice.length > 1
            ? `${format(first, "MMM d")}-${format(last, "d")}`
            : format(first, "MMM d"),
        from: startOfDay(first).getTime(),
        to: endOfDay(last).getTime(),
      });
    }
    return buckets;
  }

  // For ranges ≤ 7 days, use day names; otherwise use "MMM d"
  return allDays.map((d) => ({
    label: totalDays <= 7 ? format(d, "EEE") : format(d, "MMM d"),
    from: startOfDay(d).getTime(),
    to: endOfDay(d).getTime(),
  }));
}

export function StatsContent() {
  const { convexUserId } = useZustand();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [customFrom, setCustomFrom] = useState(() =>
    format(subDays(new Date(), 13), "yyyy-MM-dd"),
  );
  const [customTo, setCustomTo] = useState(() =>
    format(new Date(), "yyyy-MM-dd"),
  );

  const { days, from, to, numDays, rangeLabel } = useMemo(() => {
    let startDate: Date;
    let endDate: Date;
    let label: string;

    switch (timeRange) {
      case "week":
        startDate = subDays(new Date(), 6);
        endDate = new Date();
        label = "7-Day";
        break;
      case "month":
        startDate = subMonths(new Date(), 1);
        endDate = new Date();
        label = "30-Day";
        break;
      case "custom": {
        startDate = new Date(customFrom);
        endDate = new Date(customTo);
        // Clamp: don't allow future or inverted ranges
        if (endDate < startDate) {
          const tmp = startDate;
          startDate = endDate;
          endDate = tmp;
        }
        const diff = differenceInDays(endDate, startDate) + 1;
        label = `${diff}-Day`;
        break;
      }
    }

    const buckets = buildDayBuckets(startDate, endDate);
    return {
      days: buckets,
      from: startOfDay(startDate).getTime(),
      to: endOfDay(endDate).getTime(),
      numDays: differenceInDays(endDate, startDate) + 1,
      rangeLabel: label,
    };
  }, [timeRange, customFrom, customTo]);

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

  // Stat cards
  const totalCalories = chartData.reduce((s, d) => s + d.calories, 0);
  const avgCalories = Math.round(totalCalories / numDays);
  const totalStepsAll = chartData.reduce((s, d) => s + d.steps, 0);
  const avgSteps = Math.round(totalStepsAll / numDays);
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
      sub: `Past ${numDays} days`,
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
      {/* Timeline Selector */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal" />
              <span className="text-sm font-semibold">Time Range</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["week", "month", "custom"] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={
                    timeRange === range
                      ? "bg-teal hover:bg-teal/90 text-white"
                      : "border-border/50 hover:border-teal/40"
                  }
                >
                  {range === "week"
                    ? "Week"
                    : range === "month"
                      ? "Month"
                      : "Custom"}
                </Button>
              ))}
            </div>
            {timeRange === "custom" && (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-auto border-border/50 focus:border-teal/50 text-sm"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-auto border-border/50 focus:border-teal/50 text-sm"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stat Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, Icon, color }) => (
          <Card key={label} className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
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
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {rangeLabel} Calorie Intake
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
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {rangeLabel} Macro Breakdown
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
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{rangeLabel} Step Count</CardTitle>
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
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Weight Trend ({rangeLabel})
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
