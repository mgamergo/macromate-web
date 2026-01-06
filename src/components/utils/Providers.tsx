"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider>{children}</ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default Providers;
