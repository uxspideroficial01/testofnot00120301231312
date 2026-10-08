"use client";
import { createContext, useContext } from "react";
import type { useMakeupFlow } from "./use-makeup-flow";
export type MakeupFlow = ReturnType<typeof useMakeupFlow>;
export const MakeupContext = createContext<MakeupFlow | null>(null);
export function useMakeupContext() {
  const flow = useContext(MakeupContext);
  if (!flow) throw new Error("Makeup components require the flow provider.");
  return flow;
}
