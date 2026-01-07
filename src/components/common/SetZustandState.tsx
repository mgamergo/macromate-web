"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";

export function SetZustandState() {
  const { userId, isLoaded } = useAuth();

  const { setClerkUserId, setConvexUserId } = useZustand();

  // Query Convex user safely
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    isLoaded && userId ? { clerkUserId: userId } : "skip"
  );

  useEffect(() => {
    if (!isLoaded) return;

    // Clerk ID
    setClerkUserId(userId ?? null);

    // Convex ID
    if (convexUser) {
      setConvexUserId(convexUser._id);
    } else {
      setConvexUserId(null);
    }
  }, [isLoaded, userId, convexUser, setClerkUserId, setConvexUserId]);

  return null; // no UI
}
