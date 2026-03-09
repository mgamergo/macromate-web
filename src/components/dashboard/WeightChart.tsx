"use client";

import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { Plus } from "lucide-react";
import { format, subDays } from "date-fns";

export function WeightChart() {
  const { convexUserId } = useZustand();
  const [logOpen, setLogOpen] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryArgs = useMemo(() => {
    if (!convexUserId) return "skip";

    const now = Date.now();
    const thirtyDaysAgo = subDays(new Date(), 30).getTime();

    return {
      userId: convexUserId,
      from: thirtyDaysAgo,
      to: now,
    };
  }, [convexUserId]);

  const weightHistory =
    useQuery(api.weightLogs.getWeightHistory, queryArgs) ?? [];

  const logWeight = useMutation(api.weightLogs.logWeight);

  const chartData = weightHistory.map((entry) => ({
    date: format(new Date(entry.createdAt), "MMM dd"),
    weight: entry.weight,
  }));

  const handleLogWeight = async () => {
    const w = Number(weightInput);
    if (!weightInput || isNaN(w) || w <= 0) {
      setError("Please enter a valid weight");
      return;
    }
    if (!convexUserId) return;
    setIsSubmitting(true);
    try {
      await logWeight({ userId: convexUserId, weight: w });
      setWeightInput("");
      setLogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold">Weight Trend</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLogOpen(true)}
            className="border-teal/20 text-teal hover:bg-teal/10 hover:border-teal h-7 px-2"
          >
            <Plus className="h-3 w-3 mr-1" /> Log
          </Button>
        </CardHeader>
        <CardContent className="h-[250px]">
          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
              <p className="text-sm">No weight data yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLogOpen(true)}
                className="border-teal/20 text-teal hover:bg-teal/10"
              >
                Log your first weight
              </Button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={["dataMin - 1", "dataMax + 1"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  formatter={(value: number) => [`${value} kg`, "Weight"]}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--teal)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--teal)",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "var(--background)",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Log Weight Dialog */}
      <Dialog open={logOpen} onOpenChange={(open) => { setLogOpen(open); if (!open) { setWeightInput(""); setError(""); } }}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Log Weight</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="weight-input">Weight (kg)</Label>
              <Input
                id="weight-input"
                type="number"
                placeholder="e.g., 75.5"
                step="0.1"
                min="0"
                value={weightInput}
                onChange={(e) => {
                  setWeightInput(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogWeight()}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setLogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleLogWeight}
              disabled={isSubmitting}
              className="bg-teal hover:bg-teal/90"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
