"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell, GlassWater, FootprintsIcon } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="border-teal/20 shadow-lg shadow-teal/5">
      <CardHeader>
        <CardTitle className="text-teal font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button className="h-24 flex flex-col gap-2 bg-teal/10 hover:bg-teal/20 text-teal border-2 border-teal/20 hover:border-teal transition-all" variant="outline">
          <Plus className="h-6 w-6" />
          <span>Log Meal</span>
        </Button>
        <Button className="h-24 flex flex-col gap-2 bg-teal/10 hover:bg-teal/20 text-teal border-2 border-teal/20 hover:border-teal transition-all" variant="outline">
          <Dumbbell className="h-6 w-6" />
          <span>Log Workout</span>
        </Button>
        <Button className="h-24 flex flex-col gap-2 bg-teal/10 hover:bg-teal/20 text-teal border-2 border-teal/20 hover:border-teal transition-all" variant="outline">
          <GlassWater className="h-6 w-6" />
          <span>Log Water</span>
        </Button>
        <Button className="h-24 flex flex-col gap-2 bg-teal/10 hover:bg-teal/20 text-teal border-2 border-teal/20 hover:border-teal transition-all" variant="outline">
          <FootprintsIcon className="h-6 w-6" />
          <span>Log Steps</span>
        </Button>
      </CardContent>
    </Card>
  );
}
