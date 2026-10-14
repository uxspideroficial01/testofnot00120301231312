import { createLoadFixtures } from "./load-fixtures.ts";
import type {
  PayCapabilities,
  PayOverride,
  PayStaff,
  PayStructure,
  PayTarget,
} from "./model.ts";

/** The feature flag belongs to the organization, not individual staff. */
export const PAY_CAPABILITIES: PayCapabilities = { tieredEnabled: true };

/** Entirely fictional demo records. No customer compensation data is included. */
export const PAY_STRUCTURES: PayStructure[] = [
  {
    id: "demo-foundation",
    name: "Foundation teaching structure",
    description: "Rates vary with accumulated teaching hours.",
  },
  {
    id: "demo-experienced",
    name: "Experienced teaching structure",
    description: "Rates vary with accumulated teaching hours.",
  },
];

const TARGET_TEMPLATES: Omit<PayTarget, "id">[] = [
  {
    kind: "class-service",
    name: "Piano",
    detail: "Private service",
    serviceId: "piano",
  },
  {
    kind: "class-service",
    name: "Music theory",
    detail: "Group class",
    serviceId: "theory",
  },
  {
    kind: "enrollment",
    name: "Sophie Bennett",
    detail: "Piano · Weekly 30-minute plan",
    serviceId: "piano",
  },
  {
    kind: "enrollment",
    name: "Sophie Bennett",
    detail: "Piano · Weekly 60-minute plan",
    serviceId: "piano",
  },
  {
    kind: "class-service",
    name: "Beginner ensemble",
    detail: "Group class",
    serviceId: "ensemble",
  },
  {
    kind: "enrollment",
    name: "Ethan Brooks",
    detail: "Piano · Monthly four-session plan",
    serviceId: "piano",
  },
  {
    kind: "class-service",
    name: "Songwriting",
    detail: "Private service",
    serviceId: "songwriting",
  },
  {
    kind: "enrollment",
    name: "Maya Ellis",
    detail: "Music theory · Autumn term plan",
    serviceId: "theory",
  },
  {
    kind: "class-service",
    name: "Guitar foundations",
    detail: "Group class",
    serviceId: "guitar-foundations",
  },
  {
    kind: "enrollment",
    name: "Oliver Reed",
    detail: "Guitar · Weekly 45-minute plan",
    serviceId: "guitar",
  },
  {
    kind: "class-service",
    name: "Guitar",
    detail: "Private service",
    serviceId: "guitar",
  },
  {
    kind: "enrollment",
    name: "Isla Hart",
    detail: "Guitar · Monthly four-session plan",
    serviceId: "guitar",
  },
  {
    kind: "class-service",
    name: "Voice",
    detail: "Private service",
    serviceId: "voice",
  },
  {
    kind: "enrollment",
    name: "Leo Morgan",
    detail: "Voice · Weekly 30-minute plan",
    serviceId: "voice",
  },
  {
    kind: "class-service",
    name: "Junior choir",
    detail: "Group class",
    serviceId: "choir",
  },
  {
    kind: "enrollment",
    name: "Ava Clarke",
    detail: "Voice · Weekly 60-minute plan",
    serviceId: "voice",
  },
  {
    kind: "class-service",
    name: "Violin",
    detail: "Private service",
    serviceId: "violin",
  },
  {
    kind: "enrollment",
    name: "Noah Hayes",
    detail: "Violin · Autumn term plan",
    serviceId: "violin",
  },
  {
    kind: "class-service",
    name: "String ensemble",
    detail: "Group class",
    serviceId: "strings",
  },
  {
    kind: "enrollment",
    name: "Grace Foster",
    detail: "Violin · Weekly 45-minute plan",
    serviceId: "violin",
  },
  {
    kind: "class-service",
    name: "Percussion",
    detail: "Private service",
    serviceId: "percussion",
  },
  {
    kind: "enrollment",
    name: "Liam Parker",
    detail: "Percussion · Monthly four-session plan",
    serviceId: "percussion",
  },
  {
    kind: "class-service",
    name: "Rhythm workshop",
    detail: "Group class",
    serviceId: "rhythm",
  },
  {
    kind: "enrollment",
    name: "Zoe Wallace",
    detail: "Songwriting · Weekly 60-minute plan",
    serviceId: "songwriting",
  },
];

function targetsFor(staffId: string, count = 8): PayTarget[] {
  return TARGET_TEMPLATES.slice(0, count).map((target, index) => ({
    ...target,
    id: `${staffId}-target-${index + 1}`,
  }));
}

const STAFF_PROFILES = [
  {
    id: "emma-wilson",
    name: "Emma Wilson",
    detail: "Piano & music theory",
    cents: 5000,
  },
  {
    id: "noah-miller",
    name: "Noah Miller",
    detail: "Guitar & ensemble",
    cents: 4500,
  },
  {
    id: "olivia-chen",
    name: "Olivia Chen",
    detail: "Voice & choir",
    cents: 5500,
  },
  {
    id: "marcus-reed",
    name: "Marcus Reed",
    detail: "Music programs",
    cents: 6000,
  },
  {
    id: "amelia-brooks",
    name: "Amelia Brooks",
    detail: "Piano & songwriting",
    cents: 0,
  },
  {
    id: "james-patel",
    name: "James Patel",
    detail: "Guitar & music theory",
    cents: 4000,
  },
  {
    id: "charlotte-hayes",
    name: "Charlotte Hayes",
    detail: "Violin & strings",
    cents: 6500,
  },
  {
    id: "benjamin-cole",
    name: "Benjamin Cole",
    detail: "Percussion & rhythm",
    cents: 5000,
  },
  {
    id: "mia-sullivan",
    name: "Mia Sullivan",
    detail: "Voice & songwriting",
    cents: 5500,
  },
  {
    id: "henry-foster",
    name: "Henry Foster",
    detail: "Piano & ensemble",
    cents: 4500,
  },
  {
    id: "evelyn-wright",
    name: "Evelyn Wright",
    detail: "Music theory",
    cents: 5000,
  },
  {
    id: "daniel-kim",
    name: "Daniel Kim",
    detail: "Guitar & percussion",
    cents: 6000,
  },
];

const CURATED_STAFF: PayStaff[] = STAFF_PROFILES.map((profile) => ({
  id: profile.id,
  name: profile.name,
  detail: profile.detail,
  defaultRate:
    profile.id === "evelyn-wright"
      ? {
          method: "tiered",
          structureId: "demo-foundation",
          retainedFlatRate: { method: "hourly", cents: profile.cents },
        }
      : { method: "hourly", cents: profile.cents },
  targets: targetsFor(profile.id, profile.id === "marcus-reed" ? 24 : 8),
}));

function standardOverrides(staffId: string): PayOverride[] {
  return [
    {
      id: `${staffId}-override-1`,
      staffId,
      targetId: `${staffId}-target-1`,
      rate: { method: "hourly", cents: 6000 },
    },
    {
      id: `${staffId}-override-2`,
      staffId,
      targetId: `${staffId}-target-2`,
      rate: { method: "session", cents: 7500 },
    },
    {
      id: `${staffId}-override-3`,
      staffId,
      targetId: `${staffId}-target-3`,
      rate: { method: "session", cents: 4500 },
    },
  ];
}

const loadFixtures = createLoadFixtures(
  TARGET_TEMPLATES,
  150 - CURATED_STAFF.length,
);

export const PAY_STAFF: PayStaff[] = [...CURATED_STAFF, ...loadFixtures.staff];

export const PAY_OVERRIDES: PayOverride[] = [
  ...loadFixtures.overrides,
  ...standardOverrides("emma-wilson"),
  ...standardOverrides("olivia-chen"),
  ...standardOverrides("james-patel"),
  ...Array.from({ length: 23 }, (_, index): PayOverride => ({
    id: `marcus-reed-override-${index + 1}`,
    staffId: "marcus-reed",
    targetId: `marcus-reed-target-${index + 1}`,
    rate:
      index === 2
        ? {
            method: "tiered",
            structureId: "demo-experienced",
            retainedFlatRate: { method: "hourly", cents: 6000 },
          }
        : {
            method: index % 3 === 0 ? "session" : "hourly",
            cents: 4000 + index * 250,
          },
  })),
  {
    id: "charlotte-hayes-override-1",
    staffId: "charlotte-hayes",
    targetId: "charlotte-hayes-target-3",
    rate: {
      method: "tiered",
      structureId: "demo-foundation",
      retainedFlatRate: { method: "hourly", cents: 6500 },
    },
  },
];
