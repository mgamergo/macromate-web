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

interface SupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupplementModal({ isOpen, onClose }: SupplementModalProps) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [stock, setStock] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { convexUserId } = useZustand();
  const addSupplement = useMutation(api.supplements.addSupplement);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!dosage.trim()) newErrors.dosage = "Dosage is required";
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0)
      newErrors.stock = "Valid stock amount required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!convexUserId || !validate()) return;
    setIsSubmitting(true);
    try {
      await addSupplement({
        userId: convexUserId,
        name,
        dosage,
        stock: Number(stock),
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDosage("");
    setStock("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Supplement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="supp-name">Supplement Name</Label>
            <Input
              id="supp-name"
              placeholder="e.g., Creatine"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="supp-dosage">Dosage</Label>
            <Input
              id="supp-dosage"
              placeholder="e.g., 5g or 1 Pill"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
            {errors.dosage && (
              <p className="text-sm text-red-500">{errors.dosage}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="supp-stock">Stock (days remaining)</Label>
            <Input
              id="supp-stock"
              type="number"
              placeholder="e.g., 60"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            {errors.stock && (
              <p className="text-sm text-red-500">{errors.stock}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-teal hover:bg-teal/90"
          >
            {isSubmitting ? "Adding..." : "Add Supplement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
