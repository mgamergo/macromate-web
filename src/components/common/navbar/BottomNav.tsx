"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState } from "react";
import { AIMealModal } from "@/src/components/dashboard/meals/AIMealModal";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Home" },
  { href: "/stats", icon: BarChart3, label: "Stats" },
  { href: "__ai__", icon: Sparkles, label: "AI Meal", isSpecial: true },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Don't show on auth pages
  if (pathname === "/auth" || pathname.startsWith("/sso-callback")) {
    return null;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/90 backdrop-blur-xl border-t border-border/50 pb-safe">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              if (item.isSpecial) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setAiModalOpen(true)}
                    className="flex flex-col items-center justify-center gap-0.5 w-16 -mt-5 cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30 active:scale-95 transition-transform duration-150">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-medium text-violet-500 mt-0.5">
                      {item.label}
                    </span>
                  </button>
                );
              }

              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors duration-200 active:scale-95",
                    isActive
                      ? "text-teal"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive && "drop-shadow-[0_0_4px_var(--teal)]",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] transition-all duration-200",
                      isActive ? "font-semibold" : "font-medium",
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 w-8 h-0.5 rounded-full bg-teal" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <AIMealModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </>
  );
}
