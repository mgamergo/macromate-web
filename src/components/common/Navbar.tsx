"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ThemeToggle } from "@/src/components/common/ThemeToggle";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 gap-4 h-16 border-b bg-backgroundw">
      <div className="flex flex-row items-center gap-3">
        <h1 className="text-3xl font-bold"><span className="text-teal">M</span>acromate</h1>
      </div>
      <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
};
