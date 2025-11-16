"use client"

import { ClerkProvider } from "@clerk/nextjs"
import React from "react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const Providers = ({children} : {children: React.ReactNode}) => {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default Providers