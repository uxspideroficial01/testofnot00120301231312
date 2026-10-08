/** Explicit relationships in the recording-derived fixture set.
 * Missing references stay unavailable; names and titles never guess a session.
 */
type ProfileSessionReferences = {
  enrollments: Readonly<Record<string, readonly string[]>>;
  attendance: Readonly<Record<string, readonly string[]>>;
  upcoming: readonly string[];
  past: readonly string[];
};

export const DEMO_PROFILE_DATE = "2026-10-08";

const oneiromancyIds = Array.from(
  { length: 31 },
  (_, index) => `recorded-${index + 2}`,
);

const PROFILE_SESSION_REFERENCES: Readonly<
  Record<string, ProfileSessionReferences>
> = {
  "member:Garcia Lopez-Paul": {
    enrollments: { "member-oneiromancy-primary": oneiromancyIds },
    attendance: { "member-oneiromancy": oneiromancyIds },
    upcoming: oneiromancyIds,
    past: [],
  },
  "staff:AJ Ding": {
    enrollments: {},
    attendance: {},
    upcoming: [],
    past: [
      "practice-sat",
      "steve-junior",
      "viral-assessment",
      "alchemy-calendar",
    ],
  },
  "staff:Garcia Lopez-Paul": {
    enrollments: {},
    attendance: {},
    upcoming: oneiromancyIds,
    past: [],
  },
};

const EMPTY_REFERENCES: ProfileSessionReferences = {
  enrollments: {},
  attendance: {},
  upcoming: [],
  past: [],
};

export function getDemoProfileSessionReferences(
  kind: "member" | "staff",
  name: string,
) {
  return PROFILE_SESSION_REFERENCES[`${kind}:${name}`] ?? EMPTY_REFERENCES;
}
