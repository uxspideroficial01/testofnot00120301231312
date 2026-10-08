import { Mail, MapPin, Phone, Plus } from "lucide-react";
import type { ProfileKind } from "../types";
import { ProfileMenu, Field, EditableValue } from "./profile-controls";
import { DEMO_PROFILE_CONTACT } from "../demo-fixtures";

export function ProfileDetails({
  kind,
  name,
  onAction,
}: {
  kind: ProfileKind;
  name: string;
  onAction: (action: string) => void;
}) {
  const staff = kind === "staff";
  const memberActions = [
    "Edit",
    "Grant portal access (no email)",
    "Send portal invite email",
    "Invite to portal with temp. password",
    "Merge with duplicate member",
    `Impersonate ${name}`,
    "Archive member",
  ];
  return (
    <aside
      className="pp-details"
      aria-label={`${staff ? "Staff" : "Member"} details`}
    >
      <div className="pp-details-title">
        <div>
          <strong>{name}</strong>
          {!staff && <p>Guardian (Ledger Owner)</p>}
        </div>
        {staff && <span className="pp-presence" />}
        <ProfileMenu
          label="Profile actions"
          items={(staff
            ? [
                "Edit",
                "Send portal invite email",
                `Impersonate ${name}`,
                "Archive staff",
              ]
            : memberActions
          ).map((label) => ({ label, action: () => onAction(label) }))}
        />
      </div>
      <section>
        <h3>Contact</h3>
        <Field label="Email">
          <EditableValue
            placeholder="Add email..."
            initial={staff ? DEMO_PROFILE_CONTACT.staffEmail : ""}
            icon={!staff && <Mail size={15} />}
          />
        </Field>
        {staff && (
          <Field label="Portal access">
            <span className="pp-registered">Registered</span>
          </Field>
        )}
        <Field label="Phone">
          <EditableValue
            placeholder="Add phone..."
            icon={<Phone size={15} />}
          />
        </Field>
        {staff ? (
          <>
            <Field label="Address">
              <EditableValue placeholder="Add address..." />
            </Field>
            <Field label="Meeting Link">
              <EditableValue placeholder="Add meeting link..." />
            </Field>
            <Field label="Timezone">Organization default</Field>
          </>
        ) : (
          <>
            <Field label="Address line 1">
              <span className="pp-address">
                <MapPin size={15} />
                {DEMO_PROFILE_CONTACT.memberAddress}
              </span>
            </Field>
            {[
              ["Address line 2", "Add apt, suite..."],
              ["City", "Add city..."],
              ["State", "Add state..."],
              ["Postal code", "Add postal code..."],
              ["Country", "Add country..."],
            ].map(([label, placeholder]) => (
              <Field key={label} label={label}>
                <EditableValue placeholder={placeholder} />
              </Field>
            ))}
            <Field label="Alternate email">
              <EditableValue
                placeholder="Add alternate email..."
                icon={<Mail size={15} />}
              />
            </Field>
            <Field label="Alternate phone">
              <EditableValue
                placeholder="Add alternate phone..."
                icon={<Phone size={15} />}
              />
            </Field>
          </>
        )}
      </section>
      {staff ? (
        <section>
          <h3>Role &amp; Pay</h3>
          <Field label="Staff Role">Restricted Admin</Field>
          <Field label="Permissions">
            <div className="pp-pills">
              {[
                "Billing",
                "Billing dashboard",
                "Payroll",
                "Add and edit staff",
                "Text & voice",
                "Email",
              ].map((text) => (
                <span key={text}>{text}</span>
              ))}
            </div>
          </Field>
          <Field label="Default Pay Rate">$50.00</Field>
          <Field label="Tiered Pay">Inspirica Referred Tiered</Field>
          <Field label="Eligible Services">
            <div className="pp-pills">
              <span>Algebra 1:1 with Greyson</span>
              <span>Cory&apos;s Private solidcore Class</span>
            </div>
          </Field>
        </section>
      ) : (
        <>
          <section>
            <h3>Account</h3>
            <Field label="Role">Guardian</Field>
            <Field label="Ledger owner">Yes (receives invoices)</Field>
            <Field label="Auto-Pay">
              <span className="pp-neutral">Plan Default</span>
            </Field>
            <Field label="Family">
              <button
                className="pp-editable"
                onClick={() => onAction("Add family member")}
              >
                <Plus size={13} />
                Add family member
              </button>
            </Field>
          </section>
          <section>
            <h3>Details</h3>
            <Field label="Labels">
              <div className="pp-tags">
                <span>alive</span>
                <span>cold outreach</span>
              </div>
            </Field>
            <Field label="Birth date">
              {DEMO_PROFILE_CONTACT.birthDate}
              <p className="pp-muted">(1 year old)</p>
            </Field>
            <Field label="Timezone">
              Organization default
              <small className="pp-muted">11:00 AM local time</small>
            </Field>
            <Field label="Active notifications">
              <div className="pp-notifications">
                {[
                  "ACH payment initiated",
                  "Credit card payment initiated",
                  "Itemized invoice",
                  "Refund issued",
                  "Event reminder",
                  "Event reminder (Text)",
                  "Rescheduled event",
                  "Welcome message",
                ].map((text) => (
                  <span key={text}>{text}</span>
                ))}
              </div>
            </Field>
            <Field label="Referred by">
              <EditableValue placeholder="Add referrals..." />
            </Field>
            <Field label="Info">
              <textarea
                className="pp-info-input"
                aria-label="Member info"
                defaultValue={DEMO_PROFILE_CONTACT.memberInfo}
              />
            </Field>
          </section>
          <section>
            <h3>Custom fields</h3>
            {[
              "Other custom fields...",
              "School",
              "School",
              "School Name",
              "Student Pronoun",
              "Test Type",
              "Unsubscribed",
              "Scholarship",
              "Soprano Saxophone Lesson",
              "Saxophone Experience",
              "Agreement signed",
              "Study Space - ACT Score",
              "Skill Level",
              "Skill Level",
              "High Score",
            ].map((label, i) => (
              <Field key={`${label}-${i}`} label={label}>
                {["Unsubscribed", "Scholarship", "Agreement signed"].includes(
                  label,
                ) ? (
                  <input type="checkbox" aria-label={label} />
                ) : (
                  <EditableValue
                    placeholder={`Add ${label.toLowerCase()}...`}
                  />
                )}
              </Field>
            ))}
          </section>
        </>
      )}
    </aside>
  );
}
