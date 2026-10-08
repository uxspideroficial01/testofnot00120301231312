"use client";
import { Overlay } from "@/components/ui";
import { issueMakeup } from "@/domain/makeup";

import { useMakeupContext } from "./makeup-context";

export function IssueMakeupDialog() {
  const {
    session,
    booking,
    onBooking,
    setIssuing,
    makeupName,
    setMakeupName,
    issueError,
    setIssueError,
  } = useMakeupContext();
  return (
    <Overlay title="Issue Makeup" onClose={() => setIssuing(false)} modal>
      <form
        className="makeup-issue-form"
        onSubmit={(event) => {
          event.preventDefault();
          const result = issueMakeup(booking, session.id, makeupName);
          if (!result.ok) {
            setIssueError(result.reason);
            return;
          }
          onBooking(result.state);
          setIssuing(false);
        }}
      >
        <label htmlFor="makeup-name">Makeup name</label>
        <input
          id="makeup-name"
          value={makeupName}
          required
          onChange={(event) => setMakeupName(event.target.value)}
          onFocus={(event) => event.target.select()}
          autoFocus
        />
        {issueError && (
          <p className="form-error" role="alert">
            {issueError}
          </p>
        )}
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </Overlay>
  );
}
