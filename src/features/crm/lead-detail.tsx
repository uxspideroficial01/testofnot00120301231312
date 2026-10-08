import { useState } from "react";
import { Info, Table2, LoaderCircle } from "lucide-react";
import { Panel } from "../secondary-shared/controls";
import type { LeadCard, LeadGroup, Composer, LeadRecord } from "./types";
import { LeadContact } from "./lead-contact";
import { LeadActivity } from "./lead-activity";
export function LeadDetail({
  detail,
  board,
  initialStage,
  groups,
  onClose,
  record,
  onUpdate,
}: {
  detail: LeadCard;
  board: string;
  initialStage: string;
  groups: LeadGroup[];
  onClose: () => void;
  record: LeadRecord;
  onUpdate: (patch: Partial<LeadRecord>) => void;
}) {
  const [stage, setStage] = useState(initialStage);
  const [composer, setComposer] = useState<Composer>(null);
  return (
    <Panel
      title={detail.name}
      className="sv-recorded-crm-panel"
      close={onClose}
    >
      <div className="sv-crm-meta">
        <div>
          <small>Board</small>
          <span>
            <Table2 size={14} />
            {board}
          </span>
        </div>
        <div>
          <small>Stage</small>
          <span>
            <LoaderCircle size={16} />
            <select
              aria-label="Lead stage"
              value={stage}
              onChange={(event) => setStage(event.target.value)}
            >
              {groups.map((group) => (
                <option key={group.name}>{group.name}</option>
              ))}
            </select>
          </span>
        </div>
        <div>
          <small>Owner</small>
          <span>
            <span className="sv-mini-avatar">GM</span>Greyson Moroney
            (Instructor)
          </span>
        </div>
        <div>
          <small>Last activity</small>Aug 12, 2026
        </div>
        <div>
          <small>
            Last interaction <Info size={11} />
          </small>
          Aug 11, 2026
        </div>
      </div>
      <div className="sv-crm-detail">
        <LeadContact
          contactFields={record.fields}
          setContactFields={(fields) => onUpdate({ fields })}
          onComposeEmail={() => setComposer("email")}
        />
        <LeadActivity
          record={record}
          onUpdate={onUpdate}
          composer={composer}
          setComposer={setComposer}
        />
      </div>
    </Panel>
  );
}
