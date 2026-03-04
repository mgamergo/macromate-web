import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StatsContent } from "@/src/components/dashboard/StatsContent";

const StatsPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="container mx-auto p-4 space-y-6 pb-20">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-teal">Stats</h1>
        <p className="text-muted-foreground">
          Your 7-day health & fitness overview
        </p>
      </div>
      <StatsContent />
    </div>
  );
};

export default StatsPage;