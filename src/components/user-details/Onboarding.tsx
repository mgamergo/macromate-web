"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Loader2, Zap, Flame, Droplets, Activity, Ruler, Weight, Calendar, Users, Percent, Target, Zap as ZapIcon, Info } from "lucide-react";
import { redirect } from "next/navigation";

interface OnboardingFormData {
  // User Details
  height: number;
  weight: number;
  age: number;
  gender: "male" | "female" | "other";
  bodyFatPercentage: number;
  activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
  goal: "lose_weight" | "maintain_weight" | "gain_weight";

  // User Targets
  dailyCaloriesIntake: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFats: number;
  dailyFiber: number;
  dailyCaloriesBurn: number;
  dailyStepCount: number;
  dailyWaterIntake: number;
}

interface OnboardingProps {
  onComplete?: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("personal");
  const [showActivityInfo, setShowActivityInfo] = useState(false);
  const { convexUserId } = useZustand();

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      height: 170,
      weight: 70,
      age: 25,
      gender: "male",
      bodyFatPercentage: 20,
      activityLevel: "moderately_active",
      goal: "maintain_weight",
      dailyCaloriesIntake: 2500,
      dailyProtein: 150,
      dailyCarbs: 250,
      dailyFats: 85,
      dailyFiber: 30,
      dailyCaloriesBurn: 2200,
      dailyStepCount: 10000,
      dailyWaterIntake: 2000,
    },
  });

  const createUserDetails = useMutation(api.stats.logOrUpdateUserStats);
  const createUserTargets = useMutation(api.stats.logOrUpdateTargets);
  const updateOnboardingStatus = useMutation(api.users.markUserOnboarded);
  const isOnboarded = useQuery(api.users.isUserOnboarded, convexUserId ? { userId: convexUserId } : "skip");

  if (isOnboarded) {
    redirect('/');
  }

  const onSubmit = async (data: OnboardingFormData) => {
    if (!convexUserId) {
      console.error("User ID not found");
      return;
    }
    console.log("Onboarding data:", data);

    setIsLoading(true);
    try {
      // Create user details
      await createUserDetails({
        userId: convexUserId,
        
        height: data.height,
        weight: data.weight,
        age: data.age,
        gender: data.gender,
        bodyFatPercentage: data.bodyFatPercentage,
        goal: data.goal,
        activityLevel: data.activityLevel,
      });


      // Create user targets
      await createUserTargets({
        userId: convexUserId,
        dailyCaloriesIntake: data.dailyCaloriesIntake,
        dailyProtein: data.dailyProtein,
        dailyCarbs: data.dailyCarbs,
        dailyFats: data.dailyFats,
        dailyFiber: data.dailyFiber,
        dailyCaloriesBurn: data.dailyCaloriesBurn,
        dailyStepCount: data.dailyStepCount,
        dailyWaterIntake: data.dailyWaterIntake,
      });

      await updateOnboardingStatus({ userId: convexUserId });

      onComplete?.();
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCalories = (weight: number, age: number, gender: string, activityLevel: string, goal: string) => {
    // Mifflin-St Jeor equation for BMR
    let bmr = 10 * weight + 6.25 * form.getValues("height") - 5 * age;
    if (gender === "male") bmr += 5;
    else bmr -= 161;

    // Apply activity multiplier based on activity level
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };
    
    let tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

    // Adjust for goal
    if (goal === "lose_weight") tdee -= 500;
    else if (goal === "gain_weight") tdee += 500;

    return Math.round(tdee);
  };

  const weight = form.watch("weight");
  const age = form.watch("age");
  const gender = form.watch("gender");
  const activityLevel = form.watch("activityLevel");
  const goal = form.watch("goal");

  const calculatedCalories = calculateCalories(weight, age, gender, activityLevel, goal);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-teal/5 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4 px-4 py-2 bg-teal/10 border border-teal/30 rounded-full">
            <span className="text-sm font-semibold text-teal">✨ Setup Your Profile</span>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-teal via-teal to-teal/60 bg-clip-text text-transparent mb-2">
            Welcome to MacroMate
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's set up your profile to get started on your fitness journey
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-teal/30 shadow-xl shadow-teal/15 overflow-hidden">
          <CardHeader className="bg-linear-to-r from-teal/10 via-teal/5 to-transparent py-6 m-3 rounded-md border-b border-teal/20">
            <CardTitle className="text-teal text-2xl">Complete Your Profile</CardTitle>
            <CardDescription className="text-base">
              Provide your personal information and daily targets to personalize your experience
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-teal/5 border border-teal/20">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-teal data-[state=active]:text-white">
                      👤 Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="targets" className="data-[state=active]:bg-teal data-[state=active]:text-white">
                      🎯 Daily Targets
                    </TabsTrigger>
                  </TabsList>

                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Height */}
                      <FormField
                        control={form.control}
                        name="height"
                        rules={{
                          required: "Height is required",
                          min: { value: 50, message: "Height must be at least 50 cm" },
                          max: { value: 250, message: "Height must be less than 250 cm" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Ruler className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Height (cm)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="170"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Your height in centimeters</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Weight */}
                      <FormField
                        control={form.control}
                        name="weight"
                        rules={{
                          required: "Weight is required",
                          min: { value: 20, message: "Weight must be at least 20 kg" },
                          max: { value: 300, message: "Weight must be less than 300 kg" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Weight className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Weight (kg)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="70"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Your current weight in kilograms</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Age */}
                      <FormField
                        control={form.control}
                        name="age"
                        rules={{
                          required: "Age is required",
                          min: { value: 13, message: "Age must be at least 13" },
                          max: { value: 120, message: "Age must be less than 120" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Age (years)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="25"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Your age in years</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Gender */}
                      <FormField
                        control={form.control}
                        name="gender"
                        rules={{ required: "Gender is required" }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Gender</FormLabel>
                            </div>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Body Fat Percentage */}
                      <FormField
                        control={form.control}
                        name="bodyFatPercentage"
                        rules={{
                          required: "Body fat percentage is required",
                          min: { value: 5, message: "Must be at least 5%" },
                          max: { value: 60, message: "Must be less than 60%" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Percent className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Body Fat (%)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="20"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Your estimated body fat percentage</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Activity Level */}
                      <FormField
                        control={form.control}
                        name="activityLevel"
                        rules={{ required: "Activity level is required" }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Activity Level</FormLabel>
                              <Dialog open={showActivityInfo} onOpenChange={setShowActivityInfo}>
                                <DialogTrigger asChild>
                                  <button
                                    type="button"
                                    className="ml-auto p-0 h-auto inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-teal transition-colors"
                                  >
                                    <Info className="w-4 h-4" />
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="text-teal">Activity Level Guide</DialogTitle>
                                    <DialogDescription>
                                      Choose the level that matches your typical weekly exercise routine
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-sm">🛋️ Sedentary</h4>
                                      <p className="text-xs text-muted-foreground">Little to no exercise. Mostly desk work or sedentary lifestyle.</p>
                                      <p className="text-xs text-teal font-medium">Office worker with minimal physical activity</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-sm">🚶 Lightly Active</h4>
                                      <p className="text-xs text-muted-foreground">Light exercise 1-3 days per week.</p>
                                      <p className="text-xs text-teal font-medium">Yoga or leisurely walks a couple times a week</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-sm">🏃 Moderately Active</h4>
                                      <p className="text-xs text-muted-foreground">Moderate exercise 3-5 days per week.</p>
                                      <p className="text-xs text-teal font-medium">Regular gym sessions or sports 3-4 times weekly</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-sm">💪 Very Active</h4>
                                      <p className="text-xs text-muted-foreground">Hard exercise 6-7 days per week.</p>
                                      <p className="text-xs text-teal font-medium">Training 6 days a week with high intensity</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-semibold text-sm">🔥 Extremely Active</h4>
                                      <p className="text-xs text-muted-foreground">Very intense exercise twice per day or physical job.</p>
                                      <p className="text-xs text-teal font-medium">Professional athletes or double training sessions</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select activity level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sedentary">Sedentary</SelectItem>
                                <SelectItem value="lightly_active">Lightly Active</SelectItem>
                                <SelectItem value="moderately_active">Moderately Active</SelectItem>
                                <SelectItem value="very_active">Very Active</SelectItem>
                                <SelectItem value="extremely_active">Extremely Active</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs">Click the info icon to learn about each level</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Fitness Goal */}
                      <FormField
                        control={form.control}
                        name="goal"
                        rules={{ required: "Goal is required" }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Fitness Goal</FormLabel>
                            </div>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lose_weight">Lose Weight</SelectItem>
                                <SelectItem value="maintain_weight">Maintain Weight</SelectItem>
                                <SelectItem value="gain_weight">Gain Weight</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Daily Targets Tab */}
                  <TabsContent value="targets" className="space-y-6 pt-4">
                    {/* Auto-calculated Calories Alert */}
                    <div className="p-5 bg-linear-to-br from-teal/15 via-teal/10 to-teal/5 border border-teal/40 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-teal mb-1">
                            Recommended Daily Calories
                          </p>
                          <p className="text-3xl font-bold bg-linear-to-r from-teal to-teal/70 bg-clip-text text-transparent">{calculatedCalories} kcal</p>
                        </div>
                        <Flame className="w-10 h-10 text-teal/40" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Based on your personal info and fitness goal. Adjust below as needed.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Daily Calories Intake */}
                      <FormField
                        control={form.control}
                        name="dailyCaloriesIntake"
                        rules={{
                          required: "Daily calories intake is required",
                          min: { value: 800, message: "Minimum 800 calories" },
                          max: { value: 5000, message: "Maximum 5000 calories" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Flame className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Daily Calories (kcal)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="2500"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Target daily calorie intake</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Daily Protein */}
                      <FormField
                        control={form.control}
                        name="dailyProtein"
                        rules={{
                          required: "Daily protein is required",
                          min: { value: 10, message: "Minimum 10g" },
                          max: { value: 500, message: "Maximum 500g" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Daily Protein (g)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="150"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Target daily protein intake</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Daily Carbs */}
                      <FormField
                        control={form.control}
                        name="dailyCarbs"
                        rules={{
                          required: "Daily carbs is required",
                          min: { value: 10, message: "Minimum 10g" },
                          max: { value: 500, message: "Maximum 500g" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Daily Carbs (g)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="250"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Target daily carbohydrate intake</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Daily Fats */}
                      <FormField
                        control={form.control}
                        name="dailyFats"
                        rules={{
                          required: "Daily fats is required",
                          min: { value: 10, message: "Minimum 10g" },
                          max: { value: 300, message: "Maximum 300g" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Droplets className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Daily Fats (g)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="85"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Target daily fat intake</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Daily Fiber */}
                      <FormField
                        control={form.control}
                        name="dailyFiber"
                        rules={{
                          required: "Daily fiber is required",
                          min: { value: 5, message: "Minimum 5g" },
                          max: { value: 100, message: "Maximum 100g" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Daily Fiber (g)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="30"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Target daily fiber intake</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Daily Calories Burn */}
                      <FormField
                        control={form.control}
                        name="dailyCaloriesBurn"
                        rules={{
                          required: "Daily calories burn is required",
                          min: { value: 500, message: "Minimum 500 kcal" },
                          max: { value: 5000, message: "Maximum 5000 kcal" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <ZapIcon className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Daily Calories Burn (kcal)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="2200"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Estimated daily energy expenditure</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Daily Step Count */}
                      <FormField
                        control={form.control}
                        name="dailyStepCount"
                        rules={{
                          required: "Daily step count is required",
                          min: { value: 1000, message: "Minimum 1000 steps" },
                          max: { value: 100000, message: "Maximum 100000 steps" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Daily Steps Target</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="10000"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Daily step goal</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Daily Water Intake */}
                      <FormField
                        control={form.control}
                        name="dailyWaterIntake"
                        rules={{
                          required: "Daily water intake is required",
                          min: { value: 500, message: "Minimum 500 ml" },
                          max: { value: 10000, message: "Maximum 10000 ml" },
                        }}
                        render={({ field }) => (
                          <FormItem className="bg-teal/5 p-4 rounded-lg border border-teal/10 transition-all hover:border-teal/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Droplets className="w-4 h-4 text-teal" />
                              <FormLabel className="text-sm font-semibold text-foreground">Daily Water (ml)</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="2000"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="transition-all focus:shadow-md bg-background/50 border-teal/20 focus:border-teal/50"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">Daily water intake goal</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-teal/20">
                  {currentTab === "targets" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("personal")}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  )}
                  {currentTab === "personal" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("targets")}
                    >
                      Next
                    </Button>
                  )}
                  {currentTab === "targets" && (
                    <Button
                      type="submit"
                      className="flex-1 bg-linear-to-r from-teal to-teal/80 hover:from-teal/90 hover:to-teal/70 text-white font-semibold shadow-lg shadow-teal/20 transition-all hover:shadow-xl hover:shadow-teal/30"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        "🎉 Complete Setup"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            ✓ You can update these settings anytime in your profile
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <div className="text-center px-3 py-1 bg-teal/5 border border-teal/20 rounded-full">
              <p className="text-xs font-medium text-teal">🎯 Personalized</p>
            </div>
            <div className="text-center px-3 py-1 bg-teal/5 border border-teal/20 rounded-full">
              <p className="text-xs font-medium text-teal">📊 Data-driven</p>
            </div>
            <div className="text-center px-3 py-1 bg-teal/5 border border-teal/20 rounded-full">
              <p className="text-xs font-medium text-teal">⚡ Smart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
