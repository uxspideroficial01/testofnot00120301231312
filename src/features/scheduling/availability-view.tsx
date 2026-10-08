import { availabilityStaff } from "./fixtures";
import { useState } from "react";
import { CalendarDays, Info } from "lucide-react";
import { Button, Footer, Panel } from "../secondary-shared/controls";
import type { OpenPerson } from "../secondary-shared/types";

export function Availability({ onOpenPerson }: { onOpenPerson?: OpenPerson }) {
  const [selectedTime, setSelectedTime] = useState<{
    name: string;
    time: string;
  } | null>(null);
  const [days, setDays] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [selectedStaff, setSelectedStaff] = useState("All staff");
  const visible = availabilityStaff.filter(
    (n) => selectedStaff === "All staff" || n === selectedStaff,
  );
  return (
    <div className="sv-availability">
      <aside className="sv-availability-filters">
        <label>
          Date range
          <button className="sv-button">
            <CalendarDays size={17} />
            Oct 08, 2026 - Nov 08, 2026
          </button>
        </label>
        <label>
          Time of day (EDT)
          <div className="sv-time-pair">
            <select aria-label="Start time">
              <option>9:00 AM</option>
              <option>12:00 PM</option>
            </select>
            <span>-</span>
            <select aria-label="End time">
              <option>9:00 PM</option>
              <option>5:00 PM</option>
            </select>
          </div>
        </label>
        <label>Days of week</label>
        <div className="sv-days">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <button
              className={days.includes(d) ? "active" : ""}
              key={d}
              onClick={() =>
                setDays(
                  days.includes(d) ? days.filter((x) => x !== d) : [...days, d],
                )
              }
            >
              {d}
            </button>
          ))}
        </div>
        <button className="sv-clear" onClick={() => setDays([])}>
          Clear all
        </button>
        <label>
          Minimum duration
          <select defaultValue="60 min">
            <option>30 min</option>
            <option>45 min</option>
            <option>60 min</option>
          </select>
        </label>
        <hr />
        <label>
          Service <Info size={13} />
          <select>
            <option>All services</option>
            <option>Private Piano Lesson</option>
            <option>Guitar Lesson</option>
          </select>
        </label>
        <label>
          Staff
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            <option>All staff</option>
            {[...new Set(availabilityStaff)].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Location
          <select>
            <option>All locations</option>
            <option>Online</option>
            <option>Main studio</option>
          </select>
        </label>
      </aside>
      <section className="sv-page">
        <div className="sv-table-scroll">
          <table className="sv-table sv-availability-table">
            <thead>
              <tr>
                {["Staff", "Date", "Time", "Location", "Recurring"].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.length > 0 &&
                visible.map((n, i) => (
                  <tr key={`${n}-${i}`}>
                    <td>
                      <button
                        className="sv-link"
                        onClick={() =>
                          onOpenPerson
                            ? onOpenPerson("staff", n)
                            : setSelectedTime({
                                name: n,
                                time:
                                  i === 1
                                    ? "9:00 AM - 11:30 AM"
                                    : "9:00 AM - 5:00 PM",
                              })
                        }
                      >
                        {n}
                      </button>
                    </td>
                    <td>Thu, Oct 8, 2026</td>
                    <td>
                      {i === 1
                        ? "9:00 AM - 11:30 AM"
                        : i === 2
                          ? "9:00 AM - 8:00 PM"
                          : n === "Nairo Quintana"
                            ? "9:00 AM - 9:00 PM"
                            : "9:00 AM - 5:00 PM"}
                    </td>
                    <td>{i === 8 ? "Castillo de Sant Ferran" : "Online"}</td>
                    <td>5+ weeks</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {days.length === 0 && <div className="sv-empty">No results.</div>}
        </div>
        <Footer count={days.length ? visible.length : 0} />
      </section>
      {selectedTime && (
        <Panel title="Availability" close={() => setSelectedTime(null)}>
          <div className="sv-form sv-contact">
            <h3>{selectedTime.name}</h3>
            <dl>
              <dt>Date</dt>
              <dd>Thu, Oct 8, 2026</dd>
              <dt>Time</dt>
              <dd>{selectedTime.time} EDT</dd>
              <dt>Location</dt>
              <dd>Online</dd>
              <dt>Recurring</dt>
              <dd>5+ weeks</dd>
            </dl>
            <Button onClick={() => setSelectedTime(null)}>Done</Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
