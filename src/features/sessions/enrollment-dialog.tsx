import { ChevronsUpDown, Info, Search, X } from "lucide-react";

import { Dialog } from "./session-dialog";
import type { SessionPanelController } from "./use-session-panel";
import { useState } from "react";
import { memberNames } from "./fixtures";
import { getEnrollmentError } from "./enrollment";
export function EnrollmentDialog({
  controller,
}: {
  controller: SessionPanelController;
}) {
  const { modal, closeModal, session, onUpdate, record, setToast } = controller;
  const [memberSearch, setMemberSearch] = useState("");
  const [member, setMember] = useState("");
  const [memberPicker, setMemberPicker] = useState(false);
  const [enrollment, setEnrollment] = useState("");
  const [emailStudent, setEmailStudent] = useState(false);
  const [emailStaff, setEmailStaff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  function addAttendee() {
    const error = getEnrollmentError(session, member, enrollment);
    if (error) {
      setError(error);
      return;
    }
    setError(null);
    onUpdate({
      ...session,
      students: [
        ...session.students,
        {
          id: crypto.randomUUID(),
          name: member,
          status: "Pending",
          adHoc: enrollment === "single",
          enrollment,
        },
      ],
    });
    record(`${member} added to the class roster.`);
    setToast({
      title: "Student added",
      body: `${member} added to this session.${emailStudent || emailStaff ? " Email preferences saved locally; no email was sent." : ""}`,
    });
    setMember("");
    setMemberSearch("");
    setEnrollment("");
    closeModal();
  }
  return (
    <>
      {modal === "enrollment" && (
        <Dialog
          variant="enrollment"
          label="Create Enrollment"
          onClose={closeModal}
        >
          <button
            className="official-close"
            aria-label="Close enrollment"
            onClick={closeModal}
          >
            <X size={16} />
          </button>
          <h2>Create Enrollment</h2>
          <p className="official-modal-subtitle">
            Add a member to just this session or all upcoming sessions
          </p>
          <label className="official-field-label">Member</label>
          <div className="official-member-picker">
            <button
              className="official-select"
              aria-label="Search for a member"
              aria-expanded={memberPicker}
              onClick={() => setMemberPicker(!memberPicker)}
            >
              {member || "Search for a member"}
              <ChevronsUpDown size={14} />
            </button>
            {memberPicker && (
              <div className="official-member-results">
                <label>
                  <Search size={16} />
                  <input
                    autoFocus
                    aria-label="Search Member (min 3 chars)"
                    placeholder="Search Member (min 3 chars)"
                    value={memberSearch}
                    onChange={(event) => setMemberSearch(event.target.value)}
                  />
                </label>
                <div>
                  {memberSearch.length >= 3 &&
                    memberNames
                      .filter(
                        (name) =>
                          name
                            .toLowerCase()
                            .includes(memberSearch.toLowerCase()) &&
                          !session.students.some(
                            (student) => student.name === name,
                          ),
                      )
                      .map((name) => (
                        <button
                          key={name}
                          onClick={() => {
                            setMember(name);
                            setMemberPicker(false);
                          }}
                        >
                          {name}
                        </button>
                      ))}
                  {memberSearch.length >= 3 &&
                    !memberNames.some(
                      (name) =>
                        name
                          .toLowerCase()
                          .includes(memberSearch.toLowerCase()) &&
                        !session.students.some(
                          (student) => student.name === name,
                        ),
                    ) && <small>No members found</small>}
                </div>
              </div>
            )}
          </div>
          <label
            className="official-field-label"
            htmlFor="official-enrollment-option"
          >
            Enrollment option <Info size={15} />
          </label>
          <select
            id="official-enrollment-option"
            className="official-select"
            value={enrollment}
            onChange={(event) => setEnrollment(event.target.value)}
          >
            <option value="">Select enrollment</option>
            <option value="single">This session only</option>
            <option value="following">This and all upcoming sessions</option>
          </select>
          <label className="official-email-option">
            <input
              type="checkbox"
              checked={emailStudent}
              onChange={(event) => setEmailStudent(event.target.checked)}
            />
            Send confirmation email to student and guardians
          </label>
          <label className="official-email-option">
            <input
              type="checkbox"
              checked={emailStaff}
              onChange={(event) => setEmailStaff(event.target.checked)}
            />
            Send confirmation email to staff
          </label>
          {error && (
            <p role="alert" className="official-danger-text">
              {error}
            </p>
          )}
          <footer>
            <button
              className="official-button official-primary"
              disabled={!member || !enrollment}
              onClick={addAttendee}
            >
              Add attendee
            </button>
          </footer>
        </Dialog>
      )}
    </>
  );
}
