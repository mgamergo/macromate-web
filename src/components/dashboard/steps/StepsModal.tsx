"use client";

import { use, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import useZustand from "@/src/hooks/use-zustand";

interface StepsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StepsModal({ isOpen, onClose }: StepsModalProps) {
  // State for step count input and error message
  const [stepCount, setStepCount] = useState("");
  const [error, setError] = useState("");

  //Get user details from Clerk
  const { userId, isLoaded } = useAuth();

  // Get the convex user Id based on clerk ID
  const {convexUserId} = useZustand();

  // Get the mutation to POST the steps data
  const addSteps = useMutation(api.steps.addSteps);

  // Null checks for clerk and convex 
  if (!isLoaded || !userId) return null;
  if (!convexUserId) return null;

  const handleSubmit = async () => {
    if (!isLoaded || !userId) return null;

    const steps = parseInt(stepCount, 10);

    // Input Validations
    if (!stepCount.trim()) {
      setError("Please enter a step count");
      return;
    }
    if (isNaN(steps) || steps <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    // Log steps to convex
    await addSteps({
      userId: convexUserId,
      steps,
    });

    setStepCount("");
    setError("");
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStepCount("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Steps</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="step-count">Step Count</Label>
            <Input
              id="step-count"
              type="number"
              placeholder="Enter number of steps"
              value={stepCount}
              onChange={(e) => {
                setStepCount(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              min="0"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-teal hover:bg-teal/90">
            Log Steps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
