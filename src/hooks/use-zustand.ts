import { create } from "zustand";
import { Id } from "@/convex/_generated/dataModel";

interface ZustandState {
  clerkUserId: string | null;
  setClerkUserId: (id: string | null) => void;

  convexUserId: Id<"users"> | null;
  setConvexUserId: (id: Id<"users"> | null) => void;
}


const useZustand = create<ZustandState>((set) => ({
  clerkUserId: null,
  setClerkUserId: (id) => set({ clerkUserId: id }),

  convexUserId: null,
  setConvexUserId: (id) => set({ convexUserId: id }),
}));

export default useZustand;
