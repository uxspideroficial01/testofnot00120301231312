import { useEffect, useState } from "react";
import type { OfficialStudent } from "@/domain/official";
import type { OfficialSessionPanelProps, SessionModal } from "./types";
export function useSessionPanel({
  session,
  onClose,
  onArchive,
  onUpdate,
  onOpenMember,
  onOpenInstructor,
}: OfficialSessionPanelProps) {
  const [menu, setMenu] = useState<string | null>(null);
  const [modal, setModal] = useState<SessionModal>(null);
  const [removing, setRemoving] = useState<OfficialStudent | null>(null);
  const [note, setNote] = useState<
    "privateNotes" | "sharedNotes" | "enrollmentNotes" | null
  >(null);
  const [studentNote, setStudentNote] = useState<string | null>(null);
  const [activity, setActivity] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [emailDraft, setEmailDraft] = useState({
    subject: session.title,
    body: "",
  });
  const [toast, setToast] = useState<{ title: string; body: string } | null>(
    null,
  );
  const group = session.group ?? !session.title.includes("Oneiromancy");
  useEffect(() => {
    if (!menu) return;
    const dismiss = (event: MouseEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest(".official-menu-anchor")
      )
        setMenu(null);
    };
    document.addEventListener("click", dismiss);
    return () => document.removeEventListener("click", dismiss);
  }, [menu]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  function record(message: string) {
    setEvents((previous) => [message, ...previous]);
  }
  function changeStatus(id: string, status: OfficialStudent["status"]) {
    onUpdate({
      ...session,
      students: session.students.map((student) =>
        student.id === id ? { ...student, status } : student,
      ),
    });
    setMenu(null);
    record(`Attendance changed to ${status.toLowerCase()}.`);
  }
  function showModal(next: SessionModal) {
    setMenu(null);
    setModal(next);
  }
  function closeModal() {
    setModal(null);
  }
  return {
    session,
    onClose,
    onArchive,
    onUpdate,
    onOpenMember,
    onOpenInstructor,
    menu,
    setMenu,
    modal,
    removing,
    setRemoving,
    note,
    setNote,
    studentNote,
    setStudentNote,
    activity,
    setActivity,
    events,
    emailDraft,
    setEmailDraft,
    toast,
    setToast,
    group,
    record,
    changeStatus,
    showModal,
    closeModal,
  };
}
export type SessionPanelController = ReturnType<typeof useSessionPanel>;
