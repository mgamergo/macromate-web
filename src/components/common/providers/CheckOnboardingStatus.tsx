'use-client'

import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { useQuery } from "convex/react";
import { redirect } from "next/navigation";
import React from "react";

const CheckOnboardingStatus = () => {
  const { convexUserId } = useZustand();

  const isOnboarded = useQuery(
    api.users.isUserOnboarded,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  if (isOnboarded === false) {
    redirect("/on-boarding");
  }

  return null;
};

export default CheckOnboardingStatus;
