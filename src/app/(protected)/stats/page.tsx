import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StatsContent } from "@/src/components/dashboard/StatsContent";

const StatsPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl pb-20 md:pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Your <span className="text-teal">Stats</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your health &amp; fitness over time
        </p>
      </div>
      <StatsContent />
    </div>
  );
};

export default StatsPage;