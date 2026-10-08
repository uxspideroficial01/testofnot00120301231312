import { Info, Plus, Settings, Trash2 } from "lucide-react";
import { Overlay } from "@/components/ui";
import { WEEKDAYS } from "../demo-fixtures";
import { useProfileAvailability } from "../hooks/use-profile-availability";

export function Availability() {
  const {
    hours,
    saved,
    setSaved,
    addKind,
    setAddKind,
    date,
    setDate,
    exceptions,
    setExceptions,
    settings,
    setSettings,
    change,
  } = useProfileAvailability();
  return (
    <section className="pp-availability">
      <h2>Availability</h2>
      <div className="pp-availability-columns">
        <div>
          <h3>Regular hours</h3>
          <div className="pp-hours-notice">
            <Info size={16} />
            <p>
              <strong>Any hours you set are bookable online too.</strong>
              <br />
              “Regular hours affect self-scheduling availability” is on, so they
              open time on your scheduling links and the member portal. Pick{" "}
              <em>Online</em> only for time you don&apos;t want booked in
              person.
            </p>
            <button
              className="pp-plain"
              aria-label="Availability settings"
              onClick={() => setSettings(!settings)}
            >
              <Settings size={16} />
            </button>
          </div>
          {settings && (
            <label className="pp-setting">
              <input type="checkbox" defaultChecked />
              Regular hours affect self-scheduling availability
            </label>
          )}
          {WEEKDAYS.map((day) => (
            <div
              className={`pp-day-hours ${hours[day].length ? "enabled" : ""}`}
              key={day}
            >
              <label>
                <input
                  className="pp-toggle"
                  type="checkbox"
                  aria-label={`${day} availability`}
                  checked={hours[day].length > 0}
                  onChange={(e) =>
                    change(
                      day,
                      e.target.checked
                        ? [{ start: "09:00", end: "20:00", location: "Online" }]
                        : [],
                    )
                  }
                />
                <span>{day}</span>
              </label>
              {hours[day].length > 0 && (
                <div className="pp-time-ranges">
                  {hours[day].map((range, index) => (
                    <div className="pp-time-range" key={index}>
                      <div className="pp-time-pair">
                        <input
                          type="time"
                          aria-label={`${day} start time ${index + 1}`}
                          value={range.start}
                          onInput={(e) =>
                            change(
                              day,
                              hours[day].map((item, i) =>
                                i === index
                                  ? { ...item, start: e.currentTarget.value }
                                  : item,
                              ),
                            )
                          }
                        />
                        <span>to</span>
                        <input
                          type="time"
                          aria-label={`${day} end time ${index + 1}`}
                          value={range.end}
                          onInput={(e) =>
                            change(
                              day,
                              hours[day].map((item, i) =>
                                i === index
                                  ? { ...item, end: e.currentTarget.value }
                                  : item,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="pp-location-select">
                        <select
                          aria-label={`${day} location ${index + 1}`}
                          value={range.location}
                          onChange={(e) =>
                            change(
                              day,
                              hours[day].map((item, i) =>
                                i === index
                                  ? { ...item, location: e.target.value }
                                  : item,
                              ),
                            )
                          }
                        >
                          <option>Online</option>
                          <option>All locations</option>
                          <option>Location for Testing</option>
                        </select>
                        <button
                          className="pp-plain"
                          aria-label={`Remove ${day} hours ${index + 1}`}
                          onClick={() =>
                            change(
                              day,
                              hours[day].filter((_, i) => index !== i),
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="pp-button pp-dashed"
                    onClick={() =>
                      change(day, [
                        ...hours[day],
                        { start: "09:00", end: "20:00", location: "Online" },
                      ])
                    }
                  >
                    <Plus size={15} />
                    Add hours
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="pp-save-hours">
            <button
              className="pp-button pp-primary"
              onClick={() => setSaved(true)}
            >
              {saved ? "Changes saved" : "Save Changes"}
            </button>
          </div>
        </div>
        <div>
          {["Date specific hours", "Unavailable hours"].map((type) => (
            <div className="pp-exception" key={type}>
              <div>
                <h3>{type}</h3>
                <button className="pp-button" onClick={() => setAddKind(type)}>
                  <Plus size={15} />
                  Add
                </button>
              </div>
              {exceptions
                .filter((item) => item.type === type)
                .map((item, i) => (
                  <div className="pp-exception-row" key={`${item.date}-${i}`}>
                    <span>{item.date}</span>
                    <button
                      className="pp-plain"
                      aria-label={`Remove ${item.date}`}
                      onClick={() =>
                        setExceptions((current) =>
                          current.filter((exception) => exception !== item),
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      {addKind && (
        <Overlay modal title={addKind} onClose={() => setAddKind(null)}>
          <div className="pp-local-dialog">
            <h2>{addKind}</h2>
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            {addKind === "Date specific hours" && (
              <div className="pp-time-pair">
                <input
                  type="time"
                  aria-label="Start time"
                  defaultValue="09:00"
                />
                <span>to</span>
                <input type="time" aria-label="End time" defaultValue="20:00" />
              </div>
            )}
            <button
              className="pp-button pp-primary"
              onClick={() => {
                setExceptions((current) => [
                  ...current,
                  { type: addKind, date },
                ]);
                setAddKind(null);
                setSaved(false);
              }}
            >
              Add
            </button>
          </div>
        </Overlay>
      )}
    </section>
  );
}
