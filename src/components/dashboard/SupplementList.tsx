"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { mockSupplements } from "@/src/lib/mockData";
import { Badge } from "@/src/components/ui/badge";

export function SupplementList() {
  return (
    <Card className="border-teal/20 shadow-lg shadow-teal/5">
      <CardHeader>
        <CardTitle className="text-teal font-bold">Supplements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockSupplements.map((supp) => (
          <div key={supp.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <Checkbox id={supp.name} checked={supp.taken} className="data-[state=checked]:bg-teal data-[state=checked]:border-teal" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={supp.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {supp.name}
                </label>
                <p className="text-xs text-muted-foreground">
                  {supp.dosage}
                </p>
              </div>
            </div>
            {supp.stock < 30 && (
              <Badge variant="destructive" className="text-[10px] h-5">
                Low Stock
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
