import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";

export function PayDialog({
  title,
  onClose,
  children,
  compact = false,
  fallbackFocusId,
  initialFocusRef,
  describedBy,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  compact?: boolean;
  fallbackFocusId?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  describedBy?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    dialog?.showModal();
    initialFocusRef?.current?.focus({ preventScroll: true });
    return () => {
      dialog?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
      else if (fallbackFocusId)
        document
          .getElementById(fallbackFocusId)
          ?.focus({ preventScroll: true });
    };
  }, [fallbackFocusId, initialFocusRef]);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      aria-describedby={describedBy}
      className={`pay-dialog ${compact ? "pay-dialog-compact" : ""}`}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
    >
      <header className="pay-dialog-header">
        <h2>{title}</h2>
        <button
          type="button"
          className="icon-button borderless"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </header>
      {children}
    </dialog>
  );
}
