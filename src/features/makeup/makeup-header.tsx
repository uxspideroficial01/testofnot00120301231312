"use client";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

import { useMakeupContext } from "./makeup-context";

export function MakeupHeader() {
  const { stage, setStage, activity, setActivity, headingRef, title } =
    useMakeupContext();
  return (
    <header className="session-heading">
      {stage === "detail" ? (
        <>
          <span className="service-dot" />
          <h2>{title}</h2>
          <button
            className="icon-button borderless"
            aria-label="Session actions"
            onClick={() => setActivity(!activity)}
          >
            <MoreHorizontal size={18} />
          </button>
        </>
      ) : (
        <>
          <button
            className="icon-button borderless"
            aria-label="Go back"
            onClick={() => setStage(stage === "review" ? "slots" : "detail")}
          >
            <ArrowLeft size={18} />
          </button>
          <h2 ref={headingRef} tabIndex={-1}>
            {stage === "success" ? "Makeup scheduled" : "Schedule makeup"}
          </h2>
          {stage !== "success" && (
            <span className="step-count">
              {stage === "slots" ? "1" : "2"} of 2
            </span>
          )}
        </>
      )}
    </header>
  );
}
