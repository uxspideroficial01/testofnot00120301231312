import { useRef, useState } from "react";
import { Plus } from "lucide-react";

type DocumentMetadata = Pick<File, "name" | "size">;

export function Documents({ name }: { name: string }) {
  const [tab, setTab] = useState("Files");
  const [files, setFiles] = useState<DocumentMetadata[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div
        className="pp-line-tabs"
        role="tablist"
        aria-label="Document sections"
      >
        {["Files", "Forms"].map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Files" && (
        <div className="pp-document-actions">
          <input
            type="file"
            hidden
            ref={fileRef}
            multiple
            onChange={(e) => {
              // The demo only displays metadata; it never retains or uploads file contents.
              const metadata = Array.from(e.target.files ?? [], (file) => ({
                name: file.name,
                size: file.size,
              }));
              setFiles((current) => [...current, ...metadata]);
              e.target.value = "";
            }}
          />
          <button
            className="pp-button"
            onClick={() => fileRef.current?.click()}
          >
            <Plus size={16} />
            Add file
          </button>
        </div>
      )}
      <table className="pp-document-table">
        <thead>
          <tr>
            {["Name", "Member", "Size", "Created"].map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tab === "Files" &&
            files.map((file, i) => (
              <tr key={`${file.name}-${i}`}>
                <td>{file.name}</td>
                <td>{name}</td>
                <td>{Math.max(1, Math.round(file.size / 1024))} KB</td>
                <td>Oct 8, 2026</td>
              </tr>
            ))}
        </tbody>
      </table>
      {(!files.length || tab === "Forms") && (
        <div className="pp-empty">No results.</div>
      )}
    </>
  );
}
