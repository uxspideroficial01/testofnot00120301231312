import { useState } from "react";
import { ArrowUp, Check, Filter, Plus, X } from "lucide-react";
import { Button, SearchBox, Footer, Panel } from "../secondary-shared/controls";
import { initialTasks } from "./fixtures";
export function Tasks() {
  const [tab, setTab] = useState("My tasks");
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [done, setDone] = useState<string[]>([]);
  const [newTask, setNewTask] = useState(false);
  const [description, setDescription] = useState("");
  const [allStatuses, setAllStatuses] = useState(false);
  const visible =
    tab === "All tasks"
      ? tasks.filter(
          (t) =>
            t.toLowerCase().includes(query.toLowerCase()) &&
            (allStatuses || !done.includes(t)),
        )
      : tasks.filter(
          (t) =>
            !initialTasks.includes(t) &&
            t.toLowerCase().includes(query.toLowerCase()),
        );
  return (
    <div
      className={`sv-page sv-tasks-page ${visible.length === 0 ? "sv-tasks-empty" : ""}`}
    >
      <header className="sv-tasks-topbar">
        <h1>Tasks</h1>
        <div className="sv-spacer" />
        <SearchBox
          placeholder="Search tasks"
          value={query}
          onChange={setQuery}
        />
        <Button primary onClick={() => setNewTask(true)}>
          <Plus size={16} />
          Create Task
        </Button>
      </header>
      <div className="sv-toolbar">
        <div className="sv-tabs">
          {["My tasks", "All tasks", "Created by me"].map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
              <small>
                {t === "All tasks"
                  ? 41 + tasks.length - initialTasks.length
                  : tasks.length - initialTasks.length}
              </small>
            </button>
          ))}
        </div>
        <div className="sv-spacer" />
        <button
          className="sv-filter-chip"
          onClick={() => setAllStatuses(!allStatuses)}
        >
          Task Status: {allStatuses ? "All" : "To Do"}
          <X size={13} />
        </button>
        <button
          className="sv-icon sv-clear-task-filter"
          onClick={() => setAllStatuses(true)}
        >
          Clear all
        </button>
        <Button onClick={() => setAllStatuses(!allStatuses)}>
          <Filter size={16} />
          Filter
        </Button>
        <Button onClick={() => setTasks([...tasks].reverse())}>
          <ArrowUp size={16} />
          Sort by: Due on
        </Button>
      </div>
      <div className="sv-table-scroll">
        <table className="sv-table sv-tasks">
          <thead>
            <tr>
              {[
                "",
                "Description",
                "Due on",
                "Assignee",
                "Regarding",
                "Created By",
                "Created At",
              ].map((x, i) => (
                <th key={i}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length > 0 && (
              <tr className="sv-overdue">
                <td colSpan={2}>
                  Overdue <span>{visible.length} tasks</span>
                </td>
                <td colSpan={5} />
              </tr>
            )}
            {visible.map((task, i) => (
              <tr key={task}>
                <td>
                  <button
                    className="sv-task-check"
                    aria-label={`Mark ${task} ${done.includes(task) ? "incomplete" : "complete"}`}
                    onClick={() =>
                      setDone(
                        done.includes(task)
                          ? done.filter((t) => t !== task)
                          : [...done, task],
                      )
                    }
                  >
                    {done.includes(task) && <Check size={15} />}
                  </button>
                </td>
                <td className={done.includes(task) ? "sv-complete" : ""}>
                  {task}
                </td>
                <td className="sv-red">
                  {
                    [
                      "Dec 23, 2024",
                      "Oct 7, 2025",
                      "Dec 12, 2025",
                      "Dec 22, 2025",
                      "Sep 9, 2026",
                    ][i % 5]
                  }
                </td>
                <td>
                  <span className="sv-assignee">
                    <span className="sv-mini-avatar">
                      {i % 2 ? "HA" : "SA"}
                    </span>
                    {i % 2 ? "Hassan Ahmed" : "Steve Wang Admin"}
                  </span>
                </td>
                <td>
                  {i > 8
                    ? "Maria Martins"
                    : ["Cersei Lannis...", "", "Mohit Dalal", "Amanda Nca..."][
                        i % 4
                      ]}
                </td>
                <td className="sv-muted">{i % 2 ? "Hassan" : "Steve Wang"}</td>
                <td className="sv-muted">Oct 7, 2026</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && <div className="sv-empty">No results.</div>}
      </div>
      <Footer count={visible.length} />
      {newTask && (
        <Panel title="Create Task" close={() => setNewTask(false)}>
          <form
            className="sv-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!description.trim()) return;
              setTasks([...tasks, description.trim()]);
              setTab("My tasks");
              setDescription("");
              setNewTask(false);
            }}
          >
            <label>
              Description
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label>
              Due on
              <input type="date" defaultValue="2026-10-09" />
            </label>
            <label>
              Assignee
              <select>
                <option>UX Spider</option>
                <option>Steve Wang Admin</option>
              </select>
            </label>
            <div className="sv-form-actions">
              <Button onClick={() => setNewTask(false)}>Cancel</Button>
              <button className="sv-button sv-primary" type="submit">
                Create task
              </button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  );
}
