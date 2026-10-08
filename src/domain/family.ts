export interface Family {
  id: string;
  name: string;
  guardian: { name: string; email: string };
  members: { id: string; name: string; service: string; tone: string }[];
}

export function matchesFamily(family: Family, query: string): boolean {
  const words = normalizeFamilySearch(query).split(" ");
  const haystack = normalizeFamilySearch(
    [
      family.name,
      family.guardian.name,
      family.guardian.email,
      ...family.members.map((member) => member.name),
    ].join(" "),
  );
  return words.every((word) => haystack.includes(word));
}

/** Shared matching and sorting normalization for Latin-script demo names. */
export function normalizeFamilySearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}
