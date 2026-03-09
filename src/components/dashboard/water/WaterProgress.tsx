"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Droplets } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { getStartAndEndOfDay } from "@/src/lib/utils";

export function WaterProgress() {
  const { convexUserId } = useZustand();
  const { startOfToday, endOfToday } = getStartAndEndOfDay(new Date());

  const waterLogs = useQuery(
    api.waterLogs.getWaterLogsByDay,
    convexUserId
      ? { userId: convexUserId, from: startOfToday, to: endOfToday }
      : "skip",
  ) ?? [];

  const userTargets = useQuery(
    api.stats.getUserTargets,
    convexUserId ? { userId: convexUserId } : "skip",
  );

  const totalWater = waterLogs.reduce((acc, log) => acc + log.amount, 0);
  const goal = userTargets?.dailyWaterIntake ?? 3000;
  const percentage = Math.min(100, (totalWater / goal) * 100);
  const glasses = Math.floor(totalWater / 250);

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">Water Intake</CardTitle>
        <Droplets className="h-4 w-4 text-cyan-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-cyan-500">
            {totalWater >= 1000
              ? `${(totalWater / 1000).toFixed(1)}L`
              : `${totalWater}ml`}
          </span>
          <span className="text-xs text-muted-foreground">
            / {goal >= 1000 ? `${(goal / 1000).toFixed(1)}L` : `${goal}ml`}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {glasses} glasses today
        </p>
        <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
