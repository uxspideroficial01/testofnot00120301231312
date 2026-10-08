import { templateNames } from "./fixtures";
import { useState } from "react";
import { Panel } from "../secondary-shared/controls";

export function Templates() {
  const [tab, setTab] = useState("Your Email Templates");
  const [detail, setDetail] = useState("");
  return (
    <div className="sv-templates">
      <div className="sv-tabs">
        {["Your Email Templates", "Recommended Email Templates"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "active" : ""}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="sv-template-grid">
        {(tab === "Your Email Templates"
          ? templateNames
          : templateNames.slice(4)
        ).map((n, i) => (
          <button
            className="sv-template-card"
            onClick={() => setDetail(n)}
            key={n}
          >
            <div className={`sv-template-preview sv-template-${i % 4}`}>
              <b>noto</b>
              <small>Product · Resources · Blog · See pricing</small>
              <div>
                <h3>
                  {n === "Testing For" ? "Testing for something great" : n}
                </h3>
                <p>Welcome to a new season of learning.</p>
                <p>
                  We’re excited to share what’s new and help you make the most
                  of every lesson.
                </p>
                <span>Learn more</span>
              </div>
            </div>
            <footer>{n}</footer>
          </button>
        ))}
      </div>
      {detail && (
        <Panel title={detail} close={() => setDetail("")}>
          <div className="sv-template-full">
            <b>noto</b>
            <h2>{detail}</h2>
            <p>Hi {"{{ first_name }}"},</p>
            <p>
              Welcome to a new season of learning. We’re excited to see you at
              your next lesson.
            </p>
            <p>The Noto team</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
