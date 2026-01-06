"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { mockSteps } from "@/src/lib/mockData";
import { Footprints } from "lucide-react";
import { StepsPopupModal } from "@/src/components/common/StepsPopupModal";

export function StepCount() {
  const percentage = Math.min(100, (mockSteps.current / mockSteps.goal) * 100);

  return (
    <StepsPopupModal>
      <Card className="border-teal/20 shadow-lg shadow-teal/5 cursor-pointer hover:border-teal/50 transition-all group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-teal font-bold group-hover:text-teal/80 transition-colors">Steps</CardTitle>
          <Footprints className="h-4 w-4 text-muted-foreground group-hover:text-teal transition-colors" />
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
    </StepsPopupModal>
  );
}
