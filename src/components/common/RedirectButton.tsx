"use client";

import { Button } from "@/src/components/ui/button";
import { Icon, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  title?: string;
  Icon?: LucideIcon;
  IconHeight?: number;
  IconWidth?: number;
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
  Icon,
  IconHeight = 16,
  IconWidth = 16,
  redirectTo,
  className,
  variant = "default",
}: ButtonProps) => {
  const router = useRouter();
  return (
    <Button variant={variant} onClick={() => router.push(redirectTo)} className={className}>
      {Icon && <Icon className={`h-${IconHeight} w-${IconWidth}`} />}
      {title}
    </Button>
  );
};

export default RedirectButton;
