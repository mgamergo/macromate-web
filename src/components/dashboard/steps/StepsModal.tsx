"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface StepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (steps: number) => void;
}

export function StepsModal({ isOpen, onClose, onSubmit }: StepsModalProps) {
  const [stepCount, setStepCount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const steps = parseInt(stepCount, 10);

    if (!stepCount.trim()) {
      setError("Please enter a step count");
      return;
    }

    if (isNaN(steps) || steps <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    onSubmit(steps);
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
