"use client";
import { Avatar, Overlay, SearchField } from "@/components/ui";
import { DEMO_FAMILIES } from "@/demo/families";
import { type Session } from "@/domain/makeup";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";

export function ScheduleModal({
  onClose,
  sessions,
  onSelect,
}: {
  onClose: () => void;
  sessions: Session[];
  onSelect: (session: Session) => void;
}) {
  const [member, setMember] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [service, setService] = useState("");
  const [enrollment, setEnrollment] = useState("New enrollment");
  return (
    <Overlay title="Schedule session" onClose={onClose} modal>
      <h2 className="modal-title">Schedule session</h2>
      <div className="modal-fields">
        <label>Member</label>
        <div className="member-select">
          <button className="field-button" onClick={() => setOpen(!open)}>
            {member ? member.studentName : "Search for a member"}
            <ChevronsUpDown size={15} />
          </button>
          {open && (
            <div className="member-options">
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder="Search Member (min 3 chars)"
              />
              <div className="member-results">
                {query.length >= 3 &&
                  sessions
                    .filter(
                      (s) =>
                        s.studentName
                          .toLowerCase()
                          .includes(query.toLowerCase()) && !s.makeupFor,
                    )
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setMember(s);
                          setService(s.service);
                          setEnrollment("Existing enrollment");
                          setOpen(false);
                        }}
                      >
                        <Avatar name={s.studentName} />
                        <span>
                          {s.studentName}
                          <small>
                            {DEMO_FAMILIES.find((family) =>
                              family.members.some(
                                (member) => member.id === s.studentId,
                              ),
                            )?.name ?? "Member"}{" "}
                            · {s.service}
                          </small>
                        </span>
                      </button>
                    ))}
              </div>
              <button className="create-member" disabled>
                <Plus size={15} />
                Create new member
              </button>
            </div>
          )}
        </div>
        <label htmlFor="enrollment">Enrollment option</label>
        <select
          id="enrollment"
          value={enrollment}
          onChange={(e) => setEnrollment(e.target.value)}
        >
          <option>New enrollment</option>
          {member && <option>Existing enrollment</option>}
        </select>
        <label htmlFor="service">Service</label>
        <select
          id="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">Select a service</option>
          <option>Piano</option>
          <option>Guitar</option>
          <option>Voice</option>
        </select>
      </div>
      <button
        className="btn btn-primary modal-next"
        disabled={!member || !service}
        onClick={() => member && onSelect(member)}
      >
        Next
      </button>
    </Overlay>
  );
}
