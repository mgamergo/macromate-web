export const mockMacros = [
  { name: "Protein", value: 140, goal: 180, color: "var(--chart-1)" },
  { name: "Carbs", value: 200, goal: 250, color: "var(--chart-2)" },
  { name: "Fats", value: 55, goal: 70, color: "var(--chart-3)" },
  { name: "Fiber", value: 30, goal: 35, color: "var(--chart-4)" },
];

export const mockWeightData = [
  { date: "Mon", weight: 75.5 },
  { date: "Tue", weight: 75.2 },
  { date: "Wed", weight: 75.8 },
  { date: "Thu", weight: 75.4 },
  { date: "Fri", weight: 75.1 },
  { date: "Sat", weight: 74.9 },
  { date: "Sun", weight: 74.8 },
];

export const mockMeals = [
  {
    id: 1,
    name: "Oats & Whey",
    calories: 450,
    protein: 35,
    carbs: 50,
    fats: 8,
    time: "08:00 AM",
  },
  {
    id: 2,
    name: "Chicken & Rice",
    calories: 600,
    protein: 45,
    carbs: 70,
    fats: 12,
    time: "01:00 PM",
  },
  {
    id: 3,
    name: "Greek Yogurt Bowl",
    calories: 300,
    protein: 25,
    carbs: 30,
    fats: 5,
    time: "04:30 PM",
  },
];

export const mockWorkout = {
  name: "Push Day (Chest & Triceps)",
  exercises: [
    { name: "Bench Press", sets: 3, reps: "8-10", weight: "80kg" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "30kg" },
    { name: "Tricep Pushdowns", sets: 4, reps: "12-15", weight: "25kg" },
    { name: "Lateral Raises", sets: 4, reps: "15-20", weight: "12kg" },
  ],
};

export const mockSupplements = [
  { name: "Creatine", dosage: "5g", taken: true, stock: 80 },
  { name: "Whey Protein", dosage: "1 Scoop", taken: true, stock: 40 },
  { name: "Multivitamin", dosage: "1 Pill", taken: false, stock: 20 },
  { name: "Omega-3", dosage: "2 Pills", taken: false, stock: 60 },
];

export const mockSteps = {
  current: 8432,
  goal: 10000,
};
