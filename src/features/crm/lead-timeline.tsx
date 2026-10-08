import { useState } from "react";
import { Mail, Eye } from "lucide-react";

export function LeadTimeline() {
  const [expandedSubmission, setExpandedSubmission] = useState(false);
  return (
    <div className="sv-crm-timeline">
      {[
        "ended",
        "started",
        "ended",
        "started",
        "moved",
        "ended",
        "started",
      ].map((action, index) => (
        <div className="sv-crm-event" key={index}>
          {action === "moved" ? (
            <i />
          ) : (
            <span className="sv-crm-event-icon">
              <Eye size={11} />
            </span>
          )}
          <p>
            <strong>Greyson Moroney</strong>{" "}
            {action === "moved" ? (
              <>
                moved lead to <b>New</b>
              </>
            ) : (
              `${action} an impersonation session`
            )}
          </p>
          <time>{index < 5 ? "Aug 12" : "Aug 11"}</time>
        </div>
      ))}
      <div className="sv-crm-event">
        <i />
        <p>
          <strong>ParentFirst ParentLast - Greyson Individual Tutoring</strong>{" "}
          was created along with 7 other sessions by{" "}
          <strong>Greyson Moroney</strong>
        </p>
        <time>Aug 11</time>
      </div>
      <div className="sv-crm-event">
        <i />
        <p>
          <strong>ParentFirst ParentLast</strong> attended{" "}
          <strong>ParentFirst ParentLast - Greyson Individual Tutoring</strong>
        </p>
        <time>Aug 11</time>
      </div>
      <article className="sv-crm-note">
        <header>
          System Entry · admin only<small>Aug 11</small>
        </header>
        <p>Form submitted: Pickleball Self-Enroll</p>
        <blockquote className={expandedSubmission ? "expanded" : ""}>
          [image]
          <br />
          ...
          <br />
          <button
            className="sv-link"
            onClick={() => setExpandedSubmission(!expandedSubmission)}
          >
            {expandedSubmission ? "Show less" : "Show more"}
          </button>
        </blockquote>
      </article>
      <div className="sv-crm-event">
        <i />
        <p>
          <strong>Greyson Moroney</strong> moved lead to <b>New</b>
        </p>
        <time>Aug 11</time>
      </div>
      <article className="sv-crm-note">
        <header>
          System Entry · admin only<small>Aug 11</small>
        </header>
        <p>Lead from Greyson Pickleball Lessons</p>
        <p>[This note was automatically generated from a form submission]</p>
      </article>
      <div className="sv-crm-event">
        <i />
        <p>
          Credit card for <strong>ParentFirst ParentLast</strong> was added
        </p>
        <time>Aug 11</time>
      </div>
      <div className="sv-crm-event">
        <span className="sv-crm-event-icon blue">
          <Mail size={11} />
        </span>
        <p>
          <strong>ParentFirst ParentLast</strong> enrolled into{" "}
          <strong>Greyson Pickleball Lessons</strong>
        </p>
        <time>Aug 11</time>
      </div>
      {["System Entry", "Greyson Moroney (Instructor)"].map((author) => (
        <article className="sv-crm-note" key={author}>
          <header>
            {author} · admin only<small>Aug 11</small>
          </header>
          <p>Form submitted: Pickleball Self-Enroll</p>
        </article>
      ))}
      <div className="sv-crm-event">
        <i />
        <p>
          System Entry assigned <strong>Greyson Moroney (Instructor)</strong> as
          owner
        </p>
        <time>Aug 11</time>
      </div>
      <div className="sv-crm-event">
        <i />
        <p>System Entry created the lead</p>
        <time>Aug 11</time>
      </div>
    </div>
  );
}
