'use client'

import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { useQuery } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

const CheckOnboardingStatus = () => {
  const { convexUserId } = useZustand();
  const { isLoaded: isClerkLoaded, userId: clerkUserId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isOnboardingPage = pathname === "/on-boarding";

  const isOnboarded = useQuery(
    api.users.isUserOnboarded,
    // Skip the query if no user yet, or if we're already on the onboarding page
    convexUserId && !isOnboardingPage ? { userId: convexUserId } : "skip"
  );

  useEffect(() => {
    if (isOnboarded === false) {
      router.push("/on-boarding");
    }
  }, [isOnboarded, router]);

  // Already on the onboarding page — let it render normally, no overlay needed
  if (isOnboardingPage) {
    return null;
  }

  // Clerk hasn't finished initializing yet — don't show anything
  if (!isClerkLoaded) {
    return null;
  }

  // Clerk is loaded but there's no logged-in user — nothing to check
  if (!clerkUserId) {
    return null;
  }

  // Clerk is loaded and user is signed in, but Convex query is still pending
  // or a redirect to onboarding is about to fire — show spinner
  if (isOnboarded === undefined || isOnboarded === false) {
    return (
      <div
        className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4 bg-background"
        aria-label="Loading"
      >
        <Loader2 className="h-12 w-12 animate-spin text-teal" />
        <p className="text-muted-foreground animate-pulse font-medium text-sm">
          {isOnboarded === false ? "Redirecting..." : "Loading your profile..."}
        </p>
      </div>
    );
  }

  return null;
};

export default CheckOnboardingStatus;
