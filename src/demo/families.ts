import type { Family } from "../domain/family.ts";

/** Synthetic data for the proposed administrative workflow. */
export const DEMO_FAMILY: Family = {
  id: "martins",
  name: "Martins family",
  guardian: { name: "Maria Martins", email: "maria.martins@example.com" },
  members: [
    {
      id: "clara-martins",
      name: "Clara Martins",
      service: "Piano",
      tone: "purple",
    },
    {
      id: "lucas-martins",
      name: "Lucas Martins",
      service: "Guitar",
      tone: "blue",
    },
    {
      id: "sofia-martins",
      name: "Sofia Martins",
      service: "Voice",
      tone: "pink",
    },
  ],
};

// Fictional households intentionally include repeated and similar surnames.
// All emails use the reserved example.com domain; no customer records are used.
const SIMILAR_FAMILIES: Family[] = [
  {
    id: "martins-olivia",
    name: "Martins family",
    guardian: { name: "Olivia Martins", email: "olivia.martins@example.com" },
    members: [
      {
        id: "theo-martins",
        name: "Theo Martins",
        service: "Violin",
        tone: "blue",
      },
      {
        id: "lily-martins",
        name: "Lily Martins",
        service: "Voice",
        tone: "pink",
      },
    ],
  },
  {
    id: "martin-james",
    name: "Martin family",
    guardian: { name: "James Martin", email: "james.martin@example.com" },
    members: [
      {
        id: "ella-martin",
        name: "Ella Martin",
        service: "Piano",
        tone: "purple",
      },
      { id: "max-martin", name: "Max Martin", service: "Guitar", tone: "blue" },
    ],
  },
  {
    id: "martinez-ana",
    name: "Martínez family",
    guardian: { name: "Ana Martínez", email: "ana.martinez@example.com" },
    members: [
      {
        id: "ines-martinez",
        name: "Inés Martínez",
        service: "Voice",
        tone: "pink",
      },
      {
        id: "mateo-martinez",
        name: "Mateo Martínez",
        service: "Piano",
        tone: "purple",
      },
    ],
  },
  {
    id: "alvarez-jose",
    name: "Álvarez family",
    guardian: { name: "José Álvarez", email: "jose.alvarez@example.com" },
    members: [
      {
        id: "lucia-alvarez",
        name: "Lucía Álvarez",
        service: "Guitar",
        tone: "blue",
      },
      {
        id: "diego-alvarez",
        name: "Diego Álvarez",
        service: "Voice",
        tone: "pink",
      },
    ],
  },
];

const SURNAMES = [
  "Bennett",
  "Chen",
  "Davis",
  "Fernández",
  "Harris",
  "Johnson",
  "Kim",
  "Patel",
  "Rivera",
  "Williams",
];
const GUARDIAN_NAMES = [
  "Alex",
  "Avery",
  "Cameron",
  "Casey",
  "Drew",
  "Emerson",
  "Harper",
  "Jordan",
  "Morgan",
  "Parker",
  "Quinn",
  "Taylor",
];
const CHILD_NAMES = [
  "Amelia",
  "Benjamin",
  "Chloe",
  "Dylan",
  "Elena",
  "Felix",
  "Grace",
  "Henry",
  "Iris",
  "Julian",
  "Kai",
  "Lila",
  "Milo",
  "Nora",
  "Owen",
  "Ruby",
];
const LESSON_PRESETS = [
  { service: "Piano", tone: "purple" },
  { service: "Guitar", tone: "blue" },
  { service: "Voice", tone: "pink" },
] as const;

const GENERATED_FAMILIES: Family[] = SURNAMES.flatMap((surname, surnameIndex) =>
  GUARDIAN_NAMES.map((guardianName, guardianIndex) => {
    const index = surnameIndex * GUARDIAN_NAMES.length + guardianIndex;
    const number = String(index + 1).padStart(3, "0");
    const id = `synthetic-family-${number}`;
    return {
      id,
      name: `${surname} family`,
      guardian: {
        name: `${guardianName} ${surname}`,
        email: `household.${number}@example.com`,
      },
      members: LESSON_PRESETS.slice(0, 2 + (index % 2)).map(
        (lesson, childIndex) => ({
          id: `${id}-child-${childIndex + 1}`,
          name: `${CHILD_NAMES[(index * 3 + childIndex) % CHILD_NAMES.length]} ${surname}`,
          ...lesson,
        }),
      ),
    };
  }),
);

export const DEMO_FAMILIES: Family[] = [
  DEMO_FAMILY,
  ...SIMILAR_FAMILIES,
  ...GENERATED_FAMILIES,
];
