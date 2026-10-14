import { useLayoutEffect, useRef } from "react";
import type { PayOverride } from "./model";

type Position = { anchor: HTMLElement; scroller: HTMLElement; top: number };

/** Keep the current editing context visible even when live sorting moves its staff. */
export function useDeletePosition(overrides: readonly PayOverride[]) {
  const pending = useRef<Position | null>(null);

  useLayoutEffect(() => {
    const position = pending.current;
    pending.current = null;
    if (!position?.anchor.isConnected) return;
    const delta = position.anchor.getBoundingClientRect().top - position.top;
    position.scroller.scrollTop += delta;
  }, [overrides]);

  function capture(overrideId: string, staffId: string) {
    const row = document.getElementById(`override-row-${overrideId}`);
    const scroller = row?.closest<HTMLElement>(".pay-scroll");
    if (!row || !scroller) return;
    const next = row.nextElementSibling;
    const previous = row.previousElementSibling;
    const add = document.getElementById(`add-override-${staffId}`);
    const anchor = next ?? previous ?? add?.closest(".pay-staff-summary");
    if (!(anchor instanceof HTMLElement)) return;
    pending.current = {
      anchor,
      scroller,
      // A next row takes the deleted row's place. A previous row stays put.
      top: (next ? row : anchor).getBoundingClientRect().top,
    };
  }

  return {
    capture,
    cancel: () => {
      pending.current = null;
    },
  };
}
