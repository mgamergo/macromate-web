"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { Meal } from "../MealList";

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealData?: Meal
}

export interface MealFormData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
}

type InternalMealForm = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
};

export function MealModal({ isOpen, onClose, mealData }: MealModalProps) {
  const [formData, setFormData] = useState<InternalMealForm>({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    type: "lunch",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { convexUserId } = useZustand();
  const logMealMutation = useMutation(api.meals.logMeal);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Meal name is required";
    }
    // Require numeric fields to be present and valid numbers
    if (!formData.calories.trim()) {
      newErrors.calories = "Calories is required";
    } else {
      const caloriesNum = parseInt(formData.calories, 10);
      if (isNaN(caloriesNum) || caloriesNum < 0) {
        newErrors.calories = "Calories must be a non-negative number";
      }
    }

    if (!formData.protein.trim()) {
      newErrors.protein = "Protein is required";
    } else {
      const proteinNum = parseInt(formData.protein, 10);
      if (isNaN(proteinNum) || proteinNum < 0) {
        newErrors.protein = "Protein must be a non-negative number";
      }
    }

    if (!formData.carbs.trim()) {
      newErrors.carbs = "Carbs is required";
    } else {
      const carbsNum = parseInt(formData.carbs, 10);
      if (isNaN(carbsNum) || carbsNum < 0) {
        newErrors.carbs = "Carbs must be a non-negative number";
      }
    }

    if (!formData.fats.trim()) {
      newErrors.fats = "Fats is required";
    } else {
      const fatsNum = parseInt(formData.fats, 10);
      if (isNaN(fatsNum) || fatsNum < 0) {
        newErrors.fats = "Fats must be a non-negative number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (!convexUserId) return null;
      // convert string fields to numbers (empty => 0)
      const payload = {
        userId: convexUserId,
        name: formData.name,
        calories: formData.calories.trim() ? parseInt(formData.calories, 10) : 0,
        protein: formData.protein.trim() ? parseInt(formData.protein, 10) : 0,
        carbs: formData.carbs.trim() ? parseInt(formData.carbs, 10) : 0,
        fats: formData.fats.trim() ? parseInt(formData.fats, 10) : 0,
        type: formData.type,
      };

      await logMealMutation(payload);

      resetForm();
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      type: "lunch",
    });
    setErrors({});
  };

  const handleInputChange = (
    field: keyof InternalMealForm,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  
  const setInitialMealData = () => {
    if (mealData) {
      setFormData({
        name: mealData.name,
        calories: mealData.calories.toString(),
        protein: mealData.protein.toString(),
        carbs: mealData.carbs.toString(),
        fats: mealData.fats.toString(),
        type: mealData.type,
      })
    }
  }

  useEffect(() => {
    setInitialMealData()
  }, [mealData])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Meal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Meal Name */}
          <div className="grid gap-2">
            <Label htmlFor="meal-name">Meal Name</Label>
            <Input
              id="meal-name"
              placeholder="e.g., Grilled Chicken with Rice"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Meal Type */}
          <div className="grid gap-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger id="meal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calories */}
          <div className="grid gap-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              placeholder="0"
              value={formData.calories}
              onChange={(e) => handleInputChange("calories", e.target.value)}
              min="0"
            />
            {errors.calories && (
              <p className="text-sm text-red-500">{errors.calories}</p>
            )}
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Protein */}
            <div className="grid gap-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="0"
                value={formData.protein}
                onChange={(e) => handleInputChange("protein", e.target.value)}
                min="0"
              />
              {errors.protein && (
                <p className="text-sm text-red-500">{errors.protein}</p>
              )}
            </div>

            {/* Carbs */}
            <div className="grid gap-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                placeholder="0"
                value={formData.carbs}
                onChange={(e) => handleInputChange("carbs", e.target.value)}
                min="0"
              />
              {errors.carbs && (
                <p className="text-sm text-red-500">{errors.carbs}</p>
              )}
            </div>

            {/* Fats */}
            <div className="grid gap-2">
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                placeholder="0"
                value={formData.fats}
                onChange={(e) => handleInputChange("fats", e.target.value)}
                min="0"
              />
              {errors.fats && (
                <p className="text-sm text-red-500">{errors.fats}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-teal hover:bg-teal/90">
            Log Meal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
