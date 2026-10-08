import { CheckCircle2, CircleX, CircleMinus } from "lucide-react";
import type { OfficialStudent } from "@/domain/official";
export function StatusIcon({ status }: { status: OfficialStudent["status"] }) {
  return status === "Present" ? (
    <CheckCircle2 size={16} className="official-present" />
  ) : status === "No show" ||
    status === "Cancelled" ||
    status === "Late cancelled" ? (
    <CircleX size={16} className="official-absent" />
  ) : (
    <CircleMinus size={16} className="official-pending" />
  );
}
