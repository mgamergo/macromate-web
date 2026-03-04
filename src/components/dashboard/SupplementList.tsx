"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useZustand from "@/src/hooks/use-zustand";
import { Plus, Trash2 } from "lucide-react";
import { SupplementModal } from "./supplements/SupplementModal";
import { Id } from "@/convex/_generated/dataModel";

export function SupplementList() {
  const { convexUserId } = useZustand();
  const [modalOpen, setModalOpen] = useState(false);

  const supplements = useQuery(
    api.supplements.getSupplements,
    convexUserId ? { userId: convexUserId } : "skip"
  ) ?? [];

  const toggleSupplement = useMutation(api.supplements.toggleSupplement);
  const deleteSupplement = useMutation(api.supplements.deleteSupplement);

  const handleToggle = (id: Id<"supplements">, currentValue: boolean) => {
    toggleSupplement({ supplementId: id, taken: !currentValue });
  };

  const handleDelete = (id: Id<"supplements">) => {
    deleteSupplement({ supplementId: id });
  };

  return (
    <>
      <Card className="border-teal/20 shadow-lg shadow-teal/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-teal font-bold">Supplements</CardTitle>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 border-teal/20 text-teal hover:bg-teal/10 hover:border-teal"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {supplements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 gap-2 text-muted-foreground">
              <p className="text-sm text-center">No supplements added yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(true)}
                className="border-teal/20 text-teal hover:bg-teal/10 hover:border-teal"
              >
                Add Supplement
              </Button>
            </div>
          ) : (
            supplements.map((supp) => (
              <div
                key={supp._id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={supp._id}
                    checked={supp.taken}
                    onCheckedChange={() => handleToggle(supp._id, supp.taken)}
                    className="data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                  />
                  <div className="grid gap-0.5 leading-none">
                    <label
                      htmlFor={supp._id}
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {supp.name}
                    </label>
                    <p className="text-xs text-muted-foreground">{supp.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {supp.stock < 30 && (
                    <Badge variant="destructive" className="text-[10px] h-5">
                      Low Stock
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(supp._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <SupplementModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
