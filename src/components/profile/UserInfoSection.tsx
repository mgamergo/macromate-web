"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { LogOut } from "lucide-react";

export function UserInfoSection() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Card className="h-fit border-teal/20 shadow-lg shadow-teal/5 sticky top-4">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-6">
          {/* User Avatar */}
          <Avatar className="w-24 h-24 border-4 border-teal/30">
            <AvatarImage 
              src={user.imageUrl} 
              alt={user.firstName || "User"} 
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-teal/20">
              {(user.firstName || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="text-center w-full">
            <h2 className="text-xl font-bold text-foreground truncate">
              {user.firstName || "User"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 wrap-break-word">
              {user.primaryEmailAddress?.emailAddress || "No email"}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border" />

          {/* Sign Out Button */}
          <SignOutButton>
            <Button
              variant="outline"
              className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </CardContent>
    </Card>
  );
}
