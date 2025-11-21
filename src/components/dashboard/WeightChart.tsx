"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockWeightData } from "@/lib/mockData";

export function WeightChart() {
  return (
    <Card className="h-full border-teal/20 shadow-lg shadow-teal/5">
      <CardHeader>
        <CardTitle className="text-teal font-bold">Weight Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockWeightData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
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
              domain={['dataMin - 1', 'dataMax + 1']} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="var(--teal)"
              strokeWidth={3}
              dot={{ fill: "var(--teal)", strokeWidth: 2, r: 4, stroke: "var(--background)" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
