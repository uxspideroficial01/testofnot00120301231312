import { useState } from "react";
import { Link2, Plus } from "lucide-react";
import { Button } from "../secondary-shared/controls";

export function Email() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [drafts, setDrafts] = useState<
    { to: string; subject: string; body: string }[]
  >([]);
  const [format, setFormat] = useState<string[]>([]);
  return (
    <div className="sv-email">
      <aside className="sv-email-list">
        <div>
          <Button
            primary
            onClick={() => {
              setTo("");
              setSubject("");
              setBody("");
            }}
          >
            <Plus size={16} />
            New email
          </Button>
        </div>
        {drafts.map((d, i) => (
          <button
            className="sv-draft"
            key={i}
            onClick={() => {
              setTo(d.to);
              setSubject(d.subject);
              setBody(d.body);
            }}
          >
            <strong>{d.subject || "Untitled"}</strong>
            <small>{d.to}</small>
            <span className="sv-muted">Draft</span>
          </button>
        ))}
      </aside>
      <section className="sv-composer">
        <header>New email</header>
        <div className="sv-compose-fields">
          <label>
            From
            <input value="ux.spider@example.com" readOnly />
          </label>
          <label>
            To
            <input
              placeholder="Enter an email address"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <label>
            Subject
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </label>
          <div className="sv-rich-editor">
            <div className="sv-format">
              {["B", "I", "U", "H₂", "☷", "≡"].map((f) => (
                <button
                  key={f}
                  className={format.includes(f) ? "active" : ""}
                  onClick={() =>
                    setFormat(
                      format.includes(f)
                        ? format.filter((x) => x !== f)
                        : [...format, f],
                    )
                  }
                >
                  {f}
                </button>
              ))}
              <Link2 size={17} />
            </div>
            <textarea
              aria-label="Email body"
              style={{
                fontWeight: format.includes("B") ? 600 : 400,
                fontStyle: format.includes("I") ? "italic" : "normal",
                textDecoration: format.includes("U") ? "underline" : "none",
              }}
              placeholder="Welcome {{ first_name }}! We're so excited to welcome the {{ last_name }} family into our program."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <footer>
            <select
              aria-label="Insert template"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  setBody(
                    "Hello {{ first_name }},\n\nWelcome to our program! We look forward to seeing you at your next lesson.\n\nBest,\nThe team",
                  );
                  setSubject("Welcome to our program");
                }
              }}
            >
              <option value="">Insert template</option>
              <option>Welcome email</option>
            </select>
            <button
              className="sv-button"
              onClick={() => {
                setDrafts([...drafts, { to, subject, body }]);
                setTo("");
                setSubject("");
                setBody("");
              }}
              disabled={!body && !subject}
            >
              Save draft
            </button>
            <button
              className="sv-button sv-primary"
              disabled
              title="Sending is unavailable in this local prototype"
            >
              Send
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}
