"use client";
import { Avatar } from "@/components/ui";
import { ArrowUpRight } from "lucide-react";

import { timeLabel } from "@/shared/lib/date-time";
import { useMakeupContext } from "./makeup-context";
function RotateArrow() {
  return <ArrowUpRight size={12} />;
}

export function MakeupOrigin() {
  const { session } = useMakeupContext();
  return (
    <section className="makeup-origin">
      <Avatar name={session.studentName} tone="purple" />
      <div>
        <strong>{session.studentName}</strong>
        <span>{session.service} · 30 minutes</span>
      </div>
      <span className="badge badge-amber">Makeup</span>
      <div className="origin-caption">
        <RotateArrow />
        {session.attendance ?? "Missed"} lesson ·{" "}
        {new Date(session.date + "T12:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}{" "}
        · {timeLabel(session.start)}
      </div>
    </section>
  );
}
