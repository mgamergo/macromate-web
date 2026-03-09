"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeToggle } from "@/src/components/common/ThemeToggle";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { BarChart3, ArrowRight } from "lucide-react";
import UserProfileButton from "./UserProfileButton";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const desktopLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/stats", label: "Stats" },
  { href: "/profile", label: "Profile" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl supports-backdrop-filter:bg-card/60">
      <div className="flex justify-between items-center px-4 md:px-6 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-teal to-emerald-500 shadow-md shadow-teal/20 group-hover:shadow-teal/40 transition-shadow duration-200">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-teal">Macro</span>
            <span className="text-foreground">mate</span>
          </h1>
        </Link>

        {/* Desktop nav links */}
        <SignedIn>
          <nav className="hidden md:flex items-center gap-1">
            {desktopLinks.map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-teal/10 text-teal"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </SignedIn>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedOut>
            <Link href="/auth">
              <Button
                size="sm"
                className="bg-teal hover:bg-teal/90 text-teal-foreground font-medium cursor-pointer gap-1"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserProfileButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
