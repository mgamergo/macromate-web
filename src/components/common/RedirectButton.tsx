"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

interface ButtonProps {
  titile: string;
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
  titile,
  redirectTo,
  className,
  variant = "default",
}: ButtonProps) => {
  return (
    <Button variant={variant} onClick={() => redirect(redirectTo)} className={className}>
      {titile}
    </Button>
  );
};

export default RedirectButton;
