import { Authentication } from "@/src/components/auth/Authentication";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }
  return (
    <div className="relative h-full">
      <Authentication />
    </div>
  );
}
