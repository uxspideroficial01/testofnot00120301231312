import { conversationNames } from "./fixtures";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { SearchBox } from "../secondary-shared/controls";

export function Inbox() {
  const [person, setPerson] = useState(conversationNames[0]);
  const [query, setQuery] = useState("");
  const [unread, setUnread] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="sv-inbox">
      <aside className="sv-inbox-list">
        <SearchBox
          placeholder="Search name or phone"
          value={query}
          onChange={setQuery}
        />
        <div className="sv-tabs">
          <button
            className={!unread ? "active" : ""}
            onClick={() => setUnread(false)}
          >
            All
          </button>
          <button
            className={unread ? "active" : ""}
            onClick={() => setUnread(true)}
          >
            Unread
          </button>
        </div>
        <h4>EARLIER</h4>
        {!unread &&
          conversationNames
            .filter((n) => n.toLowerCase().includes(query.toLowerCase()))
            .map((n, i) => (
              <button
                key={n}
                className={`sv-conversation ${person === n ? "active" : ""}`}
                onClick={() => {
                  setPerson(n);
                  setTranscript(false);
                }}
              >
                <span className="sv-inbox-avatar">
                  {n
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <span>
                  <strong>{n}</strong>
                  <small>(347) 555-010{i}</small>
                  <p>
                    {i === 0
                      ? "Voicemail: interested in guitar lessons"
                      : "Called about available lessons"}
                  </p>
                </span>
                <small>28d ago</small>
              </button>
            ))}
      </aside>
      <section className="sv-chat">
        <span className="sv-smart-lead">
          <Sparkles size={13} />
          Created as a smart lead
        </span>
        <small className="sv-chat-date">Sep 9 at 7:47 PM</small>
        <article className="sv-voicemail">
          <strong>Voicemail · 7:47 PM</strong>
          <p className="sv-muted">No recording</p>
          <i>
            {person} is asking about beginner lessons. Free most evenings and
            weekends. Asked for a callback with availability and pricing.
          </i>
          <button
            className="sv-link"
            onClick={() => setTranscript(!transcript)}
          >
            {transcript ? "Hide transcript" : "View transcript"}
          </button>
          {transcript && (
            <p>
              Hi, I’m looking for information about lessons. Could someone call
              me back with your availability? Thank you.
            </p>
          )}
        </article>
        <div className="sv-message">
          <textarea
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1600}
          />
          <span>{message.length} / 1600</span>
          <button
            className="sv-button sv-primary"
            disabled
            title="Sending is unavailable in this local prototype"
          >
            Send
          </button>
        </div>
      </section>
      <aside className="sv-contact sv-inbox-contact">
        <h3>{person}</h3>
        <p className="sv-muted">Guardian</p>
        <h4>CONTACT</h4>
        <dl>
          <dt>Email</dt>
          <dd>Add email...</dd>
          <dt>Phone</dt>
          <dd className="sv-link">(347) 555-0103</dd>
          {[
            "Address line 1",
            "Address line 2",
            "City",
            "State",
            "Postal code",
            "Country",
          ].map((f) => (
            <span className="sv-dl-row" key={f}>
              <dt>{f}</dt>
              <dd>Add {f.toLowerCase()}...</dd>
            </span>
          ))}
        </dl>
        <h4>ACCOUNT</h4>
        <dl>
          <dt>Role</dt>
          <dd>Guardian</dd>
          <dt>Ledger owner</dt>
          <dd>Yes (receives invoices)</dd>
          <dt>Auto-Pay</dt>
          <dd>Plan Default</dd>
        </dl>
      </aside>
    </div>
  );
}
