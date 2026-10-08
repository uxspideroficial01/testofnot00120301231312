import { useState, type ReactNode } from "react";
import {
  Bot,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Clock3,
  LifeBuoy,
  RotateCcw,
} from "lucide-react";
import { NAVIGATION_GROUPS } from "./navigation";

type Props = {
  view: string;
  navigate: (view: string) => void;
  setNotice: (notice: string) => void;
  onReset: () => void;
  children: ReactNode;
};
export function WorkspaceShell({
  view,
  navigate,
  setNotice,
  onReset,
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [orgMenu, setOrgMenu] = useState(false);
  return (
    <div className={`workspace ${collapsed ? "nav-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="org-header">
          <button className="org-switch" onClick={() => setOrgMenu(!orgMenu)}>
            <span className="noto-logo" aria-hidden="true" />
            <span className="nav-label">
              0 Noto Test <ChevronsUpDown size={12} />
            </span>
          </button>
          <button
            className="icon-button collapse"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <ChevronsLeft size={16} />
            )}
          </button>
        </div>
        {orgMenu && (
          <div className="org-popover">
            <strong>Organizations</strong>
            <button onClick={() => setOrgMenu(false)}>
              <span className="noto-logo" aria-hidden="true" />0 Noto Test{" "}
              <span className="muted">Selected</span>
            </button>
          </div>
        )}
        <nav className="main-nav" aria-label="Main navigation">
          {NAVIGATION_GROUPS.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map(({ name, icon: Icon }) => (
                <div key={name}>
                  <button
                    title={collapsed ? name : undefined}
                    className={`nav-item ${view === name || (name === "Marketing" && view === "Email Templates") ? "active" : ""}`}
                    onClick={() =>
                      name === "Marketing"
                        ? setMarketing(!marketing)
                        : navigate(name)
                    }
                  >
                    <Icon size={17} />
                    <span className="nav-label">{name}</span>
                    {name === "Calendar" && (
                      <span className="nav-meta">
                        <Clock3 size={11} /> EDT
                      </span>
                    )}
                    {name === "Sessions" && (
                      <span className="count-badge">7</span>
                    )}
                    {name === "Marketing" && (
                      <ChevronDown
                        size={14}
                        className={`nav-chevron ${marketing ? "rotate" : ""}`}
                      />
                    )}
                  </button>
                  {name === "Marketing" && marketing && (
                    <div className="nav-subitems">
                      {[
                        "Email Templates",
                        "Campaigns",
                        "Triggers",
                        "Segments",
                        "Reviews",
                        "Brand Kit",
                      ].map((item) => (
                        <button
                          key={item}
                          className={view === item ? "active" : ""}
                          onClick={() => navigate(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <button
          className="ai-assistant nav-item"
          onClick={() =>
            setNotice("Noto AI is unavailable in this local workspace.")
          }
        >
          <Bot size={16} />
          <span className="nav-label">Ask Noto AI</span>
        </button>
        <button
          className="support nav-item"
          onClick={() =>
            setNotice("Support is unavailable in this local workspace.")
          }
        >
          <LifeBuoy size={18} />
          <span className="nav-label">Support</span>
        </button>
        <div className="profile">
          <span className="avatar" aria-hidden="true">
            US
          </span>
          <div className="nav-label">
            UX Spider<small>Admin</small>
          </div>
          <button
            className="icon-button nav-label"
            title="Reset workspace"
            aria-label="Reset workspace"
            onClick={onReset}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </aside>
      {children}
    </div>
  );
}
