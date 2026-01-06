"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Calendar } from "@/src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Footprints } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface StepsPopupModalProps {
  children?: React.ReactNode;
}

export function StepsPopupModal({ children }: StepsPopupModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [steps, setSteps] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!date || !steps) return;
    
    // TODO: Submit to database
    console.log("Submitting steps:", { 
      date: date.toISOString(), 
      steps: parseInt(steps) 
    });
    
    setIsOpen(false);
    setSteps("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2 border-teal/20 hover:border-teal hover:bg-teal/5 text-teal">
            <Footprints className="h-4 w-4" />
            Log Steps
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-teal/20 shadow-lg shadow-teal/5 bg-card">
        <DialogHeader>
          <DialogTitle className="text-teal flex items-center gap-2 text-xl">
            <Footprints className="h-6 w-6" />
            Log Steps
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-foreground/80">Date</Label>
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
            <Label htmlFor="steps" className="text-foreground/80">Step Count</Label>
            <Input
              id="steps"
              type="number"
              placeholder="e.g. 10000"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="focus-visible:ring-teal border-input hover:border-teal/50 transition-colors"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            className="w-full bg-teal hover:bg-teal/90 text-teal-foreground font-semibold shadow-md shadow-teal/20"
          >
            Save Steps
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
