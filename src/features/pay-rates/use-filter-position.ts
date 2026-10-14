import { useLayoutEffect, useRef, type RefObject } from "react";

/** Keep the anchored menu inside both the scroll area and the visible viewport. */
export function useFilterPosition(
  open: boolean,
  category: string | null,
  anchorRef: RefObject<HTMLDivElement | null>,
) {
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!open || !anchor || !menu) return;
    const scrollArea = anchor.closest(".pay-scroll");
    const viewport = window.visualViewport;

    function position() {
      if (!anchor || !menu) return;
      const trigger = anchor.getBoundingClientRect();
      const clip = scrollArea?.getBoundingClientRect();
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const left = Math.max(viewportLeft, clip?.left ?? 0) + 8;
      const right =
        Math.min(
          viewportLeft + (viewport?.width ?? window.innerWidth),
          clip?.right ?? window.innerWidth,
        ) - 8;
      const top = Math.max(viewportTop, clip?.top ?? 0) + 8;
      const bottom =
        Math.min(
          viewportTop + (viewport?.height ?? window.innerHeight),
          clip?.bottom ?? window.innerHeight,
        ) - 8;
      const width = Math.max(0, Math.min(264, right - left));
      const height = Math.max(0, Math.min(category ? 360 : 144, bottom - top));
      const compact = (anchor.closest(".pay-page")?.clientWidth ?? 0) <= 760;
      const desiredLeft = compact ? trigger.left : trigger.right - width;
      const x = Math.max(left, Math.min(desiredLeft, right - width));
      const below = trigger.bottom + 5;
      const above = trigger.top - 5 - height;
      const y =
        below + height <= bottom
          ? below
          : above >= top
            ? above
            : Math.max(top, Math.min(below, bottom - height));

      Object.assign(menu.style, {
        left: `${x - trigger.left}px`,
        right: "auto",
        top: `${y - trigger.top}px`,
        width: `${width}px`,
        maxHeight: `${height}px`,
      });
    }

    position();
    // Focusing an input must not pan the page toward an unpositioned menu.
    menu.querySelector("input")?.focus({ preventScroll: true });
    const observer = new ResizeObserver(position);
    observer.observe(anchor);
    if (scrollArea) observer.observe(scrollArea);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    viewport?.addEventListener("resize", position);
    viewport?.addEventListener("scroll", position);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      viewport?.removeEventListener("resize", position);
      viewport?.removeEventListener("scroll", position);
    };
  }, [open, category, anchorRef]);

  return menuRef;
}
