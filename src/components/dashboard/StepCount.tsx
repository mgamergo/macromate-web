"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Footprints } from "lucide-react";
import { StepsPopupModal } from "@/src/components/dashboard/steps/StepsPopupModal";
import { useQuery } from "convex/react";
import { getStartAndEndOfDay } from "@/src/lib/utils";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";

export function StepCount() {
  const { startOfToday, endOfToday } = getStartAndEndOfDay(new Date());
  const { convexUserId } = useZustand();

  const getSteps = useQuery(
    api.steps.getStepsByDay,
    convexUserId
      ? {
          userId: convexUserId,
          from: startOfToday,
          to: endOfToday,
        }
      : "skip"
  );

  const userTargets = useQuery(
    api.stats.getUserTargets,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  const todaysSteps = getSteps
    ? getSteps.reduce((acc, entry) => acc + entry.stepCount, 0)
    : 0;
  const goal = userTargets?.dailyStepCount ?? 10000;
  const percentage = Math.min(100, (todaysSteps / goal) * 100);

  return (
    <StepsPopupModal>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20 cursor-pointer hover:border-teal/30 transition-all duration-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold group-hover:text-teal transition-colors duration-200">
            Steps
          </CardTitle>
          <Footprints className="h-4 w-4 text-amber-500 group-hover:text-teal transition-colors duration-200" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todaysSteps.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            / {goal.toLocaleString()} goal
          </p>
          <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </StepsPopupModal>
  );
}
