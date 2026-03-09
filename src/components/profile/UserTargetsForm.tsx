"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { toast } from "sonner";
import { Spinner } from "@/src/components/ui/spinner";

const formSchema = z.object({
  bodyFatPercentage: z.number().min(0).max(100),
  goal: z.enum(["lose_weight", "maintain_weight", "gain_weight"]),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  dailyCaloriesIntake: z.number().min(0),
  dailyProtein: z.number().min(0),
  dailyCarbs: z.number().min(0),
  dailyFats: z.number().min(0),
  dailyFiber: z.number().min(0),
  dailyCaloriesBurn: z.number().min(0),
  dailyStepCount: z.number().min(0),
  dailyWaterIntake: z.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

const goalOptions = [
  { value: "lose_weight", label: "Lose Weight" },
  { value: "maintain_weight", label: "Maintain Weight" },
  { value: "gain_weight", label: "Gain Weight" },
];

const activityLevelOptions = [
  { value: "sedentary", label: "Sedentary" },
  { value: "lightly_active", label: "Lightly Active" },
  { value: "moderately_active", label: "Moderately Active" },
  { value: "very_active", label: "Very Active" },
  { value: "extremely_active", label: "Extremely Active" },
];

export function UserTargetsForm() {
  const { convexUserId } = useZustand();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userStats = useQuery(
    api.stats.getUserStats,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  const userTargets = useQuery(
    api.stats.getUserTargets,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  const updateStatsMutation = useMutation(api.stats.logOrUpdateUserStats);
  const updateTargetsMutation = useMutation(api.stats.logOrUpdateTargets);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bodyFatPercentage: 0,
      goal: "maintain_weight",
      activityLevel: "lightly_active",
      dailyCaloriesIntake: 2500,
      dailyProtein: 150,
      dailyCarbs: 300,
      dailyFats: 80,
      dailyFiber: 30,
      dailyCaloriesBurn: 500,
      dailyStepCount: 10000,
      dailyWaterIntake: 2000,
    },
  });

  // Update form with loaded data
  useEffect(() => {
    if (userStats) {
      form.reset({
        bodyFatPercentage: userStats.bodyFatPercentage ?? 0,
        goal: userStats.goal ?? "maintain_weight",
        activityLevel: userStats.activityLevel ?? "lightly_active",
        dailyCaloriesIntake: userTargets?.dailyCaloriesIntake ?? 2500,
        dailyProtein: userTargets?.dailyProtein ?? 150,
        dailyCarbs: userTargets?.dailyCarbs ?? 300,
        dailyFats: userTargets?.dailyFats ?? 80,
        dailyFiber: userTargets?.dailyFiber ?? 30,
        dailyCaloriesBurn: userTargets?.dailyCaloriesBurn ?? 500,
        dailyStepCount: userTargets?.dailyStepCount ?? 10000,
        dailyWaterIntake: userTargets?.dailyWaterIntake ?? 2000,
      }, { keepDirtyValues: false });
    }
  }, [userStats, userTargets, form]);

  const onSubmit = async (values: FormValues) => {
    if (!convexUserId) {
      toast.error("User not found. Please sign in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Saving your profile...");

      // Update stats
      await updateStatsMutation({
        userId: convexUserId,
        bodyFatPercentage: values.bodyFatPercentage,
        goal: values.goal as "lose_weight" | "maintain_weight" | "gain_weight",
        activityLevel: values.activityLevel as
          | "sedentary"
          | "lightly_active"
          | "moderately_active"
          | "very_active"
          | "extremely_active",
        gender: userStats?.gender ?? "other",
        height: userStats?.height,
        weight: userStats?.weight,
        age: userStats?.age,
      });

      // Update targets
      await updateTargetsMutation({
        userId: convexUserId,
        dailyCaloriesIntake: values.dailyCaloriesIntake,
        dailyProtein: values.dailyProtein,
        dailyCarbs: values.dailyCarbs,
        dailyFats: values.dailyFats,
        dailyFiber: values.dailyFiber,
        dailyCaloriesBurn: values.dailyCaloriesBurn,
        dailyStepCount: values.dailyStepCount,
        dailyWaterIntake: values.dailyWaterIntake,
      });

      toast.dismiss(loadingToast);
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!convexUserId) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Health & Fitness Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Body Composition & Activity */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Body Composition</h3>

              <FormField
                control={form.control}
                name="bodyFatPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Fat %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        step="0.1"
                        min="0"
                        max="100"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="border-border/50 focus:border-teal/50 transition-colors"
                      />
                    </FormControl>
                    <FormDescription>Your current body fat percentage</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Goal</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-border/50 focus:border-teal/50 transition-colors">
                          <SelectValue placeholder="Select a goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {goalOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>What is your primary fitness goal?</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="border-border/50 focus:border-teal/50 transition-colors">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activityLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>How active are you on a daily basis?</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Separator */}
            <Separator className="bg-border/50" />

            {/* Section 2: Daily Targets */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Daily Targets</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dailyCaloriesIntake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calorie Intake (kcal)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2500"
                          step="10"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-border/50 focus:border-teal/50 transition-colors"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyCaloriesBurn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calorie Burn (kcal)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          step="10"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-border/50 focus:border-teal/50 transition-colors"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyProtein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="150"
                          step="1"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-border/50 focus:border-teal/50 transition-colors"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyCarbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbs (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="300"
                          step="1"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-border/50 focus:border-teal/50 transition-colors"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyFats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fats (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="80"
                          step="1"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-border/50 focus:border-teal/50 transition-colors"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyFiber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiber (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="30"
                          step="1"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-border/50 focus:border-teal/50 transition-colors"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyStepCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Steps</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10000"
                          step="100"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-border/50 focus:border-teal/50 transition-colors"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyWaterIntake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Intake (ml)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2000"
                          step="50"
                          min="0"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          className="border-border/50 focus:border-teal/50 transition-colors"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal hover:bg-teal/90 text-white font-semibold shadow-lg shadow-teal/20 transition-all hover:shadow-xl hover:shadow-teal/30"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
