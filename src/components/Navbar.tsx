"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex justify-end items-center p-4 gap-4 h-16 border-b bg-background">
      <SignedOut>
        <ThemeToggle />
        <Link href="/auth">
          <Button variant="link" className="cursor-pointer text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            Get Started -{">"}
          </Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <ThemeToggle />
        <UserButton />
      </SignedIn>
    </header>
  );
};
