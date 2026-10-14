import { DEMO_FAMILIES, DEMO_FAMILY } from "@/demo/families";

const VIEWS = new Set([
  "Calendar",
  "Sessions",
  "Availability Finder",
  "Scheduling Links",
  "CRM",
  "Forms",
  "Tasks",
  "Email",
  "Text & Voice",
  "Marketing",
  "Email Templates",
  "Campaigns",
  "Triggers",
  "Members",
  "Staff",
  "Services",
  "Group Classes",
  "Payroll",
]);

/** URL input selects a demo screen; it never grants access to a record. */
export function parseWorkspaceParams(
  params: Record<string, string | string[] | undefined>,
) {
  const view =
    typeof params.view === "string" && VIEWS.has(params.view)
      ? params.view
      : "Calendar";
  const person = typeof params.person === "string" ? params.person.trim() : "";
  const familyId = resolveFamilyId(params.family);
  return {
    initialView: view,
    initialFamily: familyId === DEMO_FAMILY.id,
    initialFamilyId: familyId,
    initialPerson:
      (view === "Members" || view === "Staff") &&
      person.length <= 120 &&
      !Array.from(person).some(
        (character) =>
          character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
      )
        ? person || undefined
        : undefined,
  };
}

/** Accept only stable IDs from the local directory and the original shared demo URL. */
export function resolveFamilyId(value: unknown): string | null {
  if (value === "Martins") return DEMO_FAMILY.id;
  if (typeof value !== "string") return null;
  return DEMO_FAMILIES.some((family) => family.id === value) ? value : null;
}
