import { MacroChart } from "@/src/components/dashboard/MacroChart";
import { WeightChart } from "@/src/components/dashboard/WeightChart";
import { QuickActions } from "@/src/components/dashboard/QuickActions";
import { SupplementList } from "@/src/components/dashboard/SupplementList";
import { MealList } from "@/src/components/dashboard/MealList";
import { WorkoutLog } from "@/src/components/dashboard/WorkoutLog";
import { StepCount } from "@/src/components/dashboard/StepCount";
import { WaterProgress } from "@/src/components/dashboard/water/WaterProgress";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {greeting}, <span className="text-teal">{user?.firstName}</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s your daily health overview
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left Column */}
        <div className="md:col-span-3 space-y-5 order-1">
          <QuickActions />
          <StepCount />
          <WaterProgress />
        </div>

        {/* Center Column */}
        <div className="md:col-span-6 space-y-5 order-3 md:order-2">
          <MealList />
          <WorkoutLog />
          <div className="h-[350px]">
            <WeightChart />
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-3 space-y-5 order-2 md:order-3">
          <div className="h-fit">
            <MacroChart />
          </div>
          <SupplementList />
        </div>
      </div>
    </div>
  );
}
