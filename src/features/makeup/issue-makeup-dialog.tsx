"use client";
import { Overlay } from "@/components/ui";

import { useMakeupContext } from "./makeup-context";

export function IssueMakeupDialog() {
  const {
    cancelIssuance,
    makeupName,
    renameMakeup,
    issueError,
    submitIssuance,
  } = useMakeupContext();
  return (
    <Overlay title="Issue Makeup" onClose={cancelIssuance} modal>
      <form
        className="makeup-issue-form"
        onSubmit={(event) => {
          event.preventDefault();
          submitIssuance();
        }}
      >
        <label htmlFor="makeup-name">Makeup name</label>
        <input
          id="makeup-name"
          value={makeupName}
          required
          onChange={(event) => renameMakeup(event.target.value)}
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
