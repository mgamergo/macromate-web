"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Plus, Dumbbell, GlassWater, FootprintsIcon, Sparkles } from "lucide-react";
import { StepsModal } from "@/src/components/dashboard/steps/StepsModal";
import { MealModal } from "@/src/components/dashboard/meals/MealModal";
import { WorkoutModal } from "@/src/components/dashboard/workout/WorkoutModal";
import { WaterModal } from "@/src/components/dashboard/water/WaterModal";
import { AIMealModal } from "@/src/components/dashboard/meals/AIMealModal";

export function QuickActions() {
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [aiMealModalOpen, setAiMealModalOpen] = useState(false);

  return (
    <>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setAiMealModalOpen(true)}
            className="col-span-2 h-14 flex gap-2 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-lg shadow-violet-500/25 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">AI Meal Calculator</span>
          </Button>
          <Button
            onClick={() => setMealModalOpen(true)}
            className="h-20 flex flex-col gap-1.5 bg-teal/8 hover:bg-teal/15 text-teal border border-teal/20 hover:border-teal/40 transition-all duration-200 cursor-pointer"
            variant="outline"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs font-medium">Log Meal</span>
          </Button>
          <Button
            onClick={() => setWorkoutModalOpen(true)}
            className="h-20 flex flex-col gap-1.5 bg-blue-500/8 hover:bg-blue-500/15 text-blue-500 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 cursor-pointer"
            variant="outline"
          >
            <Dumbbell className="h-5 w-5" />
            <span className="text-xs font-medium">Log Workout</span>
          </Button>
          <Button
            onClick={() => setWaterModalOpen(true)}
            className="h-20 flex flex-col gap-1.5 bg-cyan-500/8 hover:bg-cyan-500/15 text-cyan-500 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer"
            variant="outline"
          >
            <GlassWater className="h-5 w-5" />
            <span className="text-xs font-medium">Log Water</span>
          </Button>
          <Button
            onClick={() => setStepsModalOpen(true)}
            className="h-20 flex flex-col gap-1.5 bg-amber-500/8 hover:bg-amber-500/15 text-amber-500 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-200 cursor-pointer"
            variant="outline"
          >
            <FootprintsIcon className="h-5 w-5" />
            <span className="text-xs font-medium">Log Steps</span>
          </Button>
        </CardContent>
      </Card>
      <MealModal
        isOpen={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        isEditMode={false}
      />
      <StepsModal
        isOpen={stepsModalOpen}
        onClose={() => setStepsModalOpen(false)}
      />
      <WorkoutModal
        isOpen={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
      />
      <WaterModal
        isOpen={waterModalOpen}
        onClose={() => setWaterModalOpen(false)}
      />
      <AIMealModal
        isOpen={aiMealModalOpen}
        onClose={() => setAiMealModalOpen(false)}
      />
    </>
  );
}
