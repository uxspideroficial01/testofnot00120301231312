import type { SessionPanelController } from "./use-session-panel";
import { NoteEditor } from "./note-editor";
export function NotesDialog({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const {
    note,
    studentNote,
    session,
    setNote,
    setStudentNote,
    onUpdate,
    record,
  } = controller;
  return (
    <>
      {(note || studentNote) && (
        <NoteEditor
          title={
            note === "privateNotes"
              ? "Private notes"
              : note === "sharedNotes"
                ? "Shared notes"
                : note === "enrollmentNotes"
                  ? "Enrollment notes"
                  : "Student note"
          }
          initial={
            note
              ? (session[note] ?? "")
              : (session.students.find((student) => student.id === studentNote)
                  ?.note ?? "")
          }
          onClose={() => {
            setNote(null);
            setStudentNote(null);
          }}
          onSave={(value) => {
            onUpdate(
              note
                ? { ...session, [note]: value }
                : {
                    ...session,
                    students: session.students.map((student) =>
                      student.id === studentNote
                        ? { ...student, note: value }
                        : student,
                    ),
                  },
            );
            record("Notes updated.");
            setNote(null);
            setStudentNote(null);
          }}
        />
      )}
    </>
  );
}
