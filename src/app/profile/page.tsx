"use client";

import { UserInfoSection } from "@/src/components/profile/UserInfoSection";
import { UserTargetsForm } from "@/src/components/profile/UserTargetsForm";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section: User Info (30% width) */}
          <div className="md:col-span-1">
            <UserInfoSection />
          </div>

          {/* Right Section: User Targets Form (70% width) */}
          <div className="md:col-span-2">
            <UserTargetsForm />
          </div>
        </div>
      </div>
    </div>
  );
}