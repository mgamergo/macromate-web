import { ClerkProvider } from "@clerk/nextjs"
import React from "react"
import { ThemeProvider } from "@/contexts/ThemeContext"

const Providers = ({children} : {children: React.ReactNode}) => {
  return (
    <ClerkProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default Providers