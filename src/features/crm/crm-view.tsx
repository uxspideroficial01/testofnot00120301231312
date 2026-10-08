import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Clock3,
  Filter,
  Mail,
  Plus,
  Search,
  Sparkles,
  Settings,
  SquareKanban,
  Table2,
  CircleCheck,
  CircleOff,
  LoaderCircle,
} from "lucide-react";
import { Button, SearchBox, Panel } from "../secondary-shared/controls";
import { recordedLeadBoards } from "./fixtures";
import { EMPTY_LEAD_RECORD, type LeadCard, type LeadRecord } from "./types";
import { LeadDetail } from "./lead-detail";
export function CRM() {
  const [board, setBoard] = useState("Leads");
  const [detail, setDetail] = useState<LeadCard | null>(null);
  const [table, setTable] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [stage, setStage] = useState("New");
  const [filterOpen, setFilterOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState("All stages");
  const [reverse, setReverse] = useState(false);
  const [addLead, setAddLead] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [addedLeads, setAddedLeads] = useState<Record<string, LeadCard[]>>({});
  const [records, setRecords] = useState<Record<string, LeadRecord>>({});
  const groups = recordedLeadBoards[board].map((group) => ({
    ...group,
    cards: [
      ...group.cards,
      ...(group.name === "New" ? (addedLeads[board] ?? []) : []),
    ],
  }));
  const filteredCards = (cards: LeadCard[]) => {
    const found = cards.filter((card) =>
      `${card.name} ${card.subtitle ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
    return reverse ? found.toReversed() : found;
  };
  const openLead = (card: LeadCard, group: string) => {
    setDetail(card);
    setStage(group);
  };
  return (
    <div className="sv-page sv-crm-page">
      <header className="sv-crm-topbar">
        <select
          aria-label="Board"
          value={board}
          onChange={(event) => {
            setBoard(event.target.value);
            setStageFilter("All stages");
          }}
        >
          <option>Leads</option>
          <option>member</option>
        </select>
        <div className="sv-tabs">
          <button
            className={!table ? "active" : ""}
            onClick={() => setTable(false)}
          >
            <SquareKanban size={15} />
            Kanban
          </button>
          <button
            className={table ? "active" : ""}
            onClick={() => setTable(true)}
          >
            <Table2 size={15} />
            Table
          </button>
        </div>
        <div className="sv-spacer" />
        <Button primary onClick={() => setAddLead(true)}>
          <Plus size={15} />
          Add new lead card
        </Button>
        <Button onClick={() => setFilterOpen(!filterOpen)}>
          <Settings size={17} />
        </Button>
      </header>
      <div className="sv-toolbar sv-right sv-crm-controls">
        {searchOpen ? (
          <SearchBox value={query} onChange={setQuery} />
        ) : (
          <button
            className="sv-icon"
            aria-label="Search leads"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={18} />
          </button>
        )}
        <Button onClick={() => setReverse(!reverse)}>
          {reverse ? <ArrowUp size={16} /> : <ArrowDown size={16} />}Sort by:
          Date created
        </Button>
        <div className="sv-crm-filter-wrap">
          <Button onClick={() => setFilterOpen(!filterOpen)}>
            <Filter size={16} />
            Filter
          </Button>
          {filterOpen && (
            <div className="sv-crm-filter-menu">
              <label>
                Stage
                <select
                  value={stageFilter}
                  onChange={(event) => setStageFilter(event.target.value)}
                >
                  <option>All stages</option>
                  {groups.map((group) => (
                    <option key={group.name}>{group.name}</option>
                  ))}
                </select>
              </label>
              <Button onClick={() => setFilterOpen(false)}>Apply</Button>
            </div>
          )}
        </div>
      </div>
      {table ? (
        <div className="sv-table-scroll">
          <table className="sv-table">
            <thead>
              <tr>
                {[
                  "Name",
                  "Stage",
                  "Owner",
                  "Last activity",
                  "Last interaction",
                ].map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups
                .filter(
                  (group) =>
                    stageFilter === "All stages" || group.name === stageFilter,
                )
                .flatMap((group) =>
                  filteredCards(group.cards).map((card) => (
                    <tr key={card.id}>
                      <td>
                        <button
                          className="sv-link"
                          onClick={() => openLead(card, group.name)}
                        >
                          {card.name}
                        </button>
                      </td>
                      <td>{group.name}</td>
                      <td>
                        {card.owner === "GM"
                          ? "Greyson Moroney (Instructor)"
                          : card.owner}
                      </td>
                      <td>Aug 12, 2026</td>
                      <td>Aug 11, 2026</td>
                    </tr>
                  )),
                )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="sv-board">
          {groups
            .filter(
              (group) =>
                stageFilter === "All stages" || group.name === stageFilter,
            )
            .map((group, groupIndex) => (
              <section
                className={`sv-column ${group.name === "Smart Leads" ? "sv-smart" : ""}`}
                key={group.name}
              >
                <div
                  className="sv-column-line"
                  style={{ background: group.color }}
                />
                <h3>
                  {group.name === "Smart Leads" ? (
                    <Sparkles size={17} />
                  ) : group.name === "Enrolled" ? (
                    <CircleCheck size={17} />
                  ) : group.name === "Lost" ? (
                    <CircleOff size={17} />
                  ) : (
                    <LoaderCircle size={17} />
                  )}
                  <span>{group.name}</span>
                  <small>{group.count ?? group.cards.length}</small>
                  {groupIndex > 0 && (
                    <button
                      className="sv-icon"
                      aria-label={`Add lead to ${group.name}`}
                      onClick={() => {
                        setStage(group.name);
                        setAddLead(true);
                      }}
                    >
                      <Plus size={15} />
                    </button>
                  )}
                </h3>
                {filteredCards(group.cards).map((card) => (
                  <button
                    className={`sv-lead ${card.tags?.length ? "sv-lead-with-tags" : ""}`}
                    key={card.id}
                    onClick={() => openLead(card, group.name)}
                  >
                    <div>
                      {card.name}
                      <span className="sv-mini-avatar">{card.owner}</span>
                    </div>
                    {card.subtitle && <p>{card.subtitle}</p>}
                    {card.tags && (
                      <div className="sv-tags">
                        {card.tags.map((tag, tagIndex) => (
                          <span
                            key={tag}
                            className={`sv-tag sv-crm-tag-${tagIndex % 8} ${tag === "Self Enrollment" ? "sv-self-enrollment" : ""} ${tag.startsWith("41:") || tag === "Scholarship: No" ? "sv-tag-purple" : ""}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <footer>
                      {card.interaction ? (
                        <>
                          <ArrowDown
                            size={10}
                            className="sv-interaction-arrow"
                          />
                          <Mail size={11} />
                          {card.interaction}
                        </>
                      ) : (
                        "—"
                      )}
                      <span>
                        <Clock3 size={11} />
                        {card.age}
                      </span>
                    </footer>
                  </button>
                ))}
              </section>
            ))}
        </div>
      )}
      {addLead && (
        <Panel title="Add new lead card" close={() => setAddLead(false)}>
          <form
            className="sv-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!leadName.trim()) return;
              setAddedLeads({
                ...addedLeads,
                [board]: [
                  ...(addedLeads[board] ?? []),
                  {
                    id: `lead-${crypto.randomUUID()}`,
                    name: leadName.trim(),
                    owner: "US",
                    age: "0d",
                    interaction: "You · Today",
                  },
                ],
              });
              setLeadName("");
              setAddLead(false);
            }}
          >
            <label>
              Name
              <input
                required
                value={leadName}
                onChange={(event) => setLeadName(event.target.value)}
              />
            </label>
            <button className="sv-button sv-primary">Add lead card</button>
          </form>
        </Panel>
      )}
      {detail && (
        <LeadDetail
          key={detail.id}
          detail={detail}
          board={board}
          initialStage={stage}
          groups={groups}
          record={records[`${board}:${detail.id}`] ?? EMPTY_LEAD_RECORD}
          onUpdate={(patch) =>
            setRecords((current) => {
              const key = `${board}:${detail.id}`;
              return {
                ...current,
                [key]: { ...(current[key] ?? EMPTY_LEAD_RECORD), ...patch },
              };
            })
          }
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}
