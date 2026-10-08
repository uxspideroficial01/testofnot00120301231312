/** Download a local draft. This helper never sends content to a server. */
export function downloadText(
  filename: string,
  content: string,
  mimeType = "text/plain;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  link.click();
  // Revoking immediately can interrupt downloads in some browsers.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
