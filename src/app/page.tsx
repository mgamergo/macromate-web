import { MacroChart } from "@/components/dashboard/MacroChart";
import { WeightChart } from "@/components/dashboard/WeightChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SupplementList } from "@/components/dashboard/SupplementList";
import { MealList } from "@/components/dashboard/MealList";
import { WorkoutLog } from "@/components/dashboard/WorkoutLog";
import { StepCount } from "@/components/dashboard/StepCount";

export default function Home() {
  return (
    <div className="container mx-auto p-4 space-y-6 pb-20">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-teal">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your daily overview.
        </p>
      </div>

      {/* Mobile Layout (Single Column) - Hidden on larger screens if needed, but Grid handles responsiveness well */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column (Quick Actions & Steps) */}
        <div className="md:col-span-3 space-y-6">
          <QuickActions />
          <StepCount />
        </div>

        {/* Center Column (Feed: Weight, Meals, Workout) */}
        <div className="md:col-span-6 space-y-6">
          <div className="h-[350px]">
            <WeightChart />
          </div>
          <MealList />
          <WorkoutLog />
        </div>

        {/* Right Column (Stats: Macros & Supplements) */}
        <div className="md:col-span-3 space-y-6">
          <div className="h-[400px]">
            <MacroChart />
          </div>
          <SupplementList />
        </div>
      </div>
    </div>
  );
}
