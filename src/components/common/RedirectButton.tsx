"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

interface ButtonProps {
  title: string;
  redirectTo: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const RedirectButton = ({
  title,
  redirectTo,
  className,
  variant = "default",
}: ButtonProps) => {
  return (
    <Button variant={variant} onClick={() => redirect(redirectTo)} className={className}>
      {title}
    </Button>
  );
};

export default RedirectButton;
