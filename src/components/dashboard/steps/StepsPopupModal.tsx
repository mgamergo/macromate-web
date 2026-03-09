"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Footprints } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";

interface StepsPopupModalProps {
  children?: React.ReactNode;
}

export function StepsPopupModal({ children }: StepsPopupModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [steps, setSteps] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { convexUserId } = useZustand();
  const addSteps = useMutation(api.steps.addSteps);

  const handleSubmit = async () => {
    if (!date || !steps) {
      setError("Please fill in all fields");
      return;
    }
    const stepCount = parseInt(steps);
    if (isNaN(stepCount) || stepCount <= 0) {
      setError("Please enter a valid step count");
      return;
    }
    if (!convexUserId) return;

    setIsSubmitting(true);
    try {
      await addSteps({
        userId: convexUserId,
        steps: stepCount,
      });
      setIsOpen(false);
      setSteps("");
      setError("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="gap-2 border-teal/20 hover:border-teal hover:bg-teal/5 text-teal"
          >
            <Footprints className="h-4 w-4" />
            Log Steps
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <Footprints className="h-6 w-6" />
            Log Steps
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-foreground/80">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal border-input hover:border-teal/50 hover:bg-teal/5 transition-colors",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-teal" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-teal/20" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="steps" className="text-foreground/80">
              Step Count
            </Label>
            <Input
              id="steps"
              type="number"
              placeholder="e.g. 10000"
              value={steps}
              onChange={(e) => {
                setSteps(e.target.value);
                setError("");
              }}
              className="focus-visible:ring-teal border-input hover:border-teal/50 transition-colors"
              min="1"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-teal hover:bg-teal/90 text-teal-foreground font-semibold shadow-md shadow-teal/20"
          >
            {isSubmitting ? "Saving..." : "Save Steps"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
