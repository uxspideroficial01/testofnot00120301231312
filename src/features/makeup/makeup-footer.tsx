"use client";
import { ArrowRight, Check } from "lucide-react";

import { useMakeupContext } from "./makeup-context";

export function MakeupFooter() {
  const {
    onClose,
    stage,
    goBack,
    slot,
    issuance,
    reviewBooking,
    confirmBooking,
  } = useMakeupContext();
  return (
    <footer className="drawer-footer">
      {stage === "success" ? (
        <>
          <span className="muted">Makeup applied · Original lesson linked</span>
          <button className="btn btn-primary" onClick={onClose}>
            Done
            <Check size={15} />
          </button>
        </>
      ) : (
        <>
          <button className="btn" onClick={goBack}>
            Back
          </button>
          <button
            className="btn btn-primary"
            disabled={!slot}
            onClick={stage === "slots" ? reviewBooking : confirmBooking}
          >
            {stage === "slots"
              ? "Review makeup"
              : issuance
                ? "Confirm makeup"
                : "Issue & schedule"}
            {stage === "slots" ? <ArrowRight size={15} /> : <Check size={15} />}
          </button>
        </>
      )}
    </footer>
  );
}
