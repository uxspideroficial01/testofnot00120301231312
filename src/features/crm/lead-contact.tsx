import {
  ChevronDown,
  Mail,
  Phone,
  Plus,
  MapPin,
  UserCircle,
} from "lucide-react";
import { crmCustomFields } from "./fixtures";
export function LeadContact({
  onComposeEmail,
  contactFields,
  setContactFields,
}: {
  onComposeEmail: () => void;
  contactFields: Record<string, string>;
  setContactFields: (fields: Record<string, string>) => void;
}) {
  const editable = (label: string, placeholder: string, key = label) => (
    <label className="sv-crm-field" key={key}>
      <span>{label}</span>
      <input
        aria-label={label}
        placeholder={placeholder}
        value={contactFields[key] ?? ""}
        onChange={(event) =>
          setContactFields({ ...contactFields, [key]: event.target.value })
        }
      />
    </label>
  );
  return (
    <aside className="sv-crm-contact-scroll" aria-label="Lead contact fields">
      <section>
        <h4>
          <ChevronDown size={11} />
          CONTACT
        </h4>
        {editable("Display Name", "Add display name...")}
        <div className="sv-crm-field">
          <span>Phone</span>
          <span className="sv-crm-contact-value">
            <Phone size={16} />
            <a href="tel:+12125550142">(212) 555-0142</a>
          </span>
        </div>
        <div className="sv-crm-field">
          <span>Email</span>
          <span className="sv-crm-contact-value">
            <Mail size={16} />
            <button className="sv-link" onClick={() => onComposeEmail()}>
              parent@example.com
            </button>
          </span>
        </div>
        <div className="sv-crm-field">
          <span>Address</span>
          <span className="sv-crm-contact-value">
            <MapPin size={16} />
            <input aria-label="Address" placeholder="Add address..." />
          </span>
        </div>
      </section>
      <section>
        <h4>
          <ChevronDown size={11} />
          STUDENT
        </h4>
        <div className="sv-crm-field">
          <span>Name</span>
          <span className="sv-crm-contact-value">
            <UserCircle size={16} />
            <input
              aria-label="Student name"
              placeholder="Add student name..."
            />
          </span>
        </div>
        <div className="sv-crm-field">
          <span>Email</span>
          <span className="sv-crm-contact-value">
            <Mail size={16} />
            <input
              aria-label="Student email"
              placeholder="Add student email..."
            />
          </span>
        </div>
        <div className="sv-crm-field">
          <span>Phone</span>
          <span className="sv-crm-contact-value">
            <Phone size={16} />
            <input
              aria-label="Student phone"
              placeholder="Add student phone..."
            />
          </span>
        </div>
        {editable("Birth date", "Add birth date...")}
        {editable("Info", "Add student info...")}
        <div className="sv-crm-field">
          <span>Labels</span>
          <span>
            <span className="sv-tag sv-self-enrollment">Self Enrollment</span>
          </span>
        </div>
      </section>
      <section>
        <h4>
          <ChevronDown size={11} />
          CUSTOM FIELDS
          <button
            className="sv-icon"
            onClick={() =>
              setContactFields({
                ...contactFields,
                "New custom field": "",
              })
            }
          >
            <Plus size={12} />
            Add custom field
          </button>
        </h4>
        {crmCustomFields.map((label, index) =>
          label === "Enrolled" ? (
            <label className="sv-crm-field sv-crm-custom-field" key={index}>
              <span>Enrolled</span>
              <input type="checkbox" />
            </label>
          ) : (
            editable(
              label,
              `Add ${label.toLowerCase().replaceAll("...", "")}...`,
              `${label}-${index}`,
            )
          ),
        )}
        {"New custom field" in contactFields &&
          editable("New custom field", "Add value...")}
      </section>
    </aside>
  );
}
