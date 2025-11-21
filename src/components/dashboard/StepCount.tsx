"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSteps } from "@/lib/mockData";
import { Footprints } from "lucide-react";

export function StepCount() {
  const percentage = Math.min(100, (mockSteps.current / mockSteps.goal) * 100);

  return (
    <Card className="border-teal/20 shadow-lg shadow-teal/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-teal font-bold">Steps</CardTitle>
        <Footprints className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{mockSteps.current.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          / {mockSteps.goal.toLocaleString()} goal
        </p>
        <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
