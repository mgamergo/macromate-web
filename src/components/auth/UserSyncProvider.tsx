"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * UserSyncProvider syncs the logged-in Clerk user with Convex database.
 * It automatically creates a Convex user record if one doesn't exist.
 */
export function UserSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const createOrGetUser = useMutation(api.users.createOrGetUser);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        await createOrGetUser({
          name: user.fullName || "Unknown",
          email: user.primaryEmailAddress?.emailAddress || "",
          clerkUserId: user.id,
          pictureUrl: user.imageUrl,
        });
      } catch (error) {
        console.error("Failed to sync user with Convex:", error);
      }
    };

    syncUser();
  }, [isLoaded, user, createOrGetUser]);

  return <>{children}</>;
}
