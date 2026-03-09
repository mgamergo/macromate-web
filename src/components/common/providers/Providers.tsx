"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { UserSyncProvider } from "@/src/components/auth/UserSyncProvider";
import { SetZustandState } from "../SetZustandState";
import CheckOnboardingStatus from "./CheckOnboardingStatus";
import { Toaster } from "sonner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Service worker registration failed, non-critical
      });
    }
  }, []);
  return null;
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider>
          <UserSyncProvider>
            <SetZustandState />
            <CheckOnboardingStatus />
            <ServiceWorkerRegistration />
            {children}
            <Toaster 
              position="top-right" 
              richColors 
              closeButton 
              theme="system"
            />
          </UserSyncProvider>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default Providers;
