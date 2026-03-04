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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { GlassWater } from "lucide-react";

interface WaterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ADD = [250, 500, 750, 1000];

export function WaterModal({ isOpen, onClose }: WaterModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { convexUserId } = useZustand();
  const logWater = useMutation(api.waterLogs.logWater);

  const handleSubmit = async (ml?: number) => {
    if (!convexUserId) return;
    const value = ml ?? Number(amount);
    if (!value || value <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setIsSubmitting(true);
    try {
      await logWater({ userId: convexUserId, amount: value });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GlassWater className="h-5 w-5 text-teal" />
            Log Water Intake
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Quick Add Buttons */}
          <div className="grid gap-2">
            <Label>Quick Add</Label>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_ADD.map((ml) => (
                <Button
                  key={ml}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit(ml)}
                  disabled={isSubmitting}
                  className="border-teal/20 text-teal hover:bg-teal/10 hover:border-teal text-xs"
                >
                  {ml}ml
                </Button>
              ))}
            </div>
          </div>
          {/* Custom Amount */}
          <div className="grid gap-2">
            <Label htmlFor="water-amount">Custom Amount (ml)</Label>
            <Input
              id="water-amount"
              type="number"
              placeholder="Enter amount in ml"
              min="1"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="bg-teal hover:bg-teal/90"
          >
            {isSubmitting ? "Logging..." : "Log Water"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
