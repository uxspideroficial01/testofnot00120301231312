"use client";
import { Overlay } from "@/components/ui";
import { IssueMakeupDialog } from "./issue-makeup-dialog";
import { MakeupContext } from "./makeup-context";
import { MakeupFooter } from "./makeup-footer";
import { MakeupHeader } from "./makeup-header";
import { MakeupOrigin } from "./makeup-origin";
import { MakeupReview } from "./makeup-review";
import { MakeupSuccess } from "./makeup-success";
import { MakeupTimePicker } from "./makeup-time-picker";
import { SessionDetails } from "./session-details";
import { useMakeupFlow } from "./use-makeup-flow";
export function SessionPanel(props: Parameters<typeof useMakeupFlow>[0]) {
  const flow = useMakeupFlow(props);
  const { stage, title, contentRef, error, issuing } = flow;
  return (
    <MakeupContext.Provider value={flow}>
      <Overlay
        className={stage === "review" ? "makeup-review" : ""}
        onClose={props.onClose}
        title={stage === "detail" ? title : "Schedule makeup"}
      >
        <MakeupHeader />
        <div className="drawer-scroll" ref={contentRef}>
          {stage === "detail" ? (
            <SessionDetails />
          ) : stage === "success" ? (
            <MakeupSuccess />
          ) : (
            <>
              <MakeupOrigin />
              {stage === "slots" ? <MakeupTimePicker /> : <MakeupReview />}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
        {stage !== "detail" && <MakeupFooter />}
        {issuing && <IssueMakeupDialog />}
      </Overlay>
    </MakeupContext.Provider>
  );
}
