# Noto administrative workflow prototype

A reference-based reconstruction of an administrative scheduling workspace, with a proposed family-aware makeup workflow. Built for a Design Engineer interview using React, Next.js, TypeScript and Node.js.

This is an independent demonstration. It is not the Noto application, is not connected to a Noto account, and is not ready to operate a school or process customer data.

## Run locally

Use Node.js 22.23.1, pinned in `.nvmrc`.

```sh
nvm use
npm ci
npm run dev
```

Open [the workspace](http://127.0.0.1:3006). Both development and production scripts bind to the local loopback address.

For a production-mode preview:

```sh
npm run build
npm run start
```

No database, environment variables, API keys or external services are required. PostgreSQL, authentication, authorization, payments and message delivery are **not integrated**. Changes live in React state and reset on reload; some feature-local drafts also reset when leaving that feature.

## Try the proposed workflow

Open [Sessions for the Martins family](http://127.0.0.1:3006/?view=Sessions&family=Martins), or choose **Filter → Family** from Sessions. Search for **Maria Martins** or **Clara**, select the matching family and choose **Apply filter**.

1. Open **Clara Martins - Piano**, the cancelled lesson.
2. Choose **Schedule makeup**.
3. Review available times alongside the siblings' lessons.
4. Review the proposed booking and confirm.
5. Inspect the original lesson and its linked makeup. The original remains cancelled and the siblings' lessons remain unchanged.

The flow reuses an existing issuance or issues and applies one during confirmation. A successful retry resolves to the existing booking. A failed confirmation does not create a partial issuance or booking. **Issue Makeup** is also available separately.

The operator is an administrator helping a family. This is not a parent portal.

## Family filtering at scale

The family picker uses the existing filter menu, alongside Staff, Room, Location, Status, Service, Attendees and Review Status. Its directory contains 125 synthetic families, including repeated surnames, to exercise realistic search and selection.

- Search matches family names, guardian names and emails, and student names, ignoring case, accents and extra spaces.
- Results are ordered consistently and paginated in groups of eight. Guardian details and children distinguish households with the same surname.
- Selection is a draft until **Apply filter**. Escape or clicking outside discards an unapplied change. The selected family stays visible while searching or paging.
- Applying a family filters by student IDs. A chip identifies the active family; its name reopens the picker and its close button removes the filter. The family ID is preserved in the URL.
- Other filters combine with the family filter. For example, **Status → Cancelled** narrows the family’s sessions to lessons needing attention.

Each additional family has its own scheduled demonstration lessons. The Martins family remains the complete missed-lesson/makeup scenario. Search and pagination run in memory; production-scale server queries and PostgreSQL persistence are not implemented.

## Observed behavior and proposed behavior

| Area                                                                     | Basis and scope                                                                                                              |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Workspace shell, Calendar and Sessions                                   | Reconstructed from supplied screenshots and screen recordings.                                                               |
| Session drawer, attendance, roster enrollment/removal, archive and notes | Local reproductions of observed interactions. Some unseen continuation forms are demonstration behavior.                     |
| Member/staff profiles, availability and CRM                              | Recorded screen structure with local editing, synthetic contact values and reference-derived display content.                |
| Standalone **Issue Makeup**                                              | The recording shows issuance from a cancelled attendee; the original session remains cancelled.                              |
| Family search, sibling agenda and combined issuance/booking              | Proposed administrative improvements. The recording does not establish the official redemption flow or eligibility policies. |

Availability and conflicts are evaluated against the seeded demonstration data. There is no live calendar synchronization, recurrence engine, organization policy service or multi-user booking system.

Supporting views include Scheduling Links, Forms, Tasks, Email, Text & Voice, Email Templates, Members and Staff. Their purpose is to make the demonstration navigable, not to imply a complete implementation of the underlying products. Email and SMS sending are disabled. Confirmation downloads and email drafts remain local. The Documents view stores selected file names and sizes in memory; it does not upload or read their contents.

## Code and verification

Feature components, state hooks, fixtures and styles are colocated under `src/features`. Pure booking rules live under `src/domain`; the synthetic family scenario is under `src/demo`. Small compatibility modules in `src/components` keep the application entry points stable.

Read [ARCHITECTURE.md](ARCHITECTURE.md) for state ownership, dependency boundaries and booking invariants. Read [SECURITY.md](SECURITY.md) for the demonstration's security model and limitations.

```sh
npm run check
npm run build
```

`check` runs lint, formatting, type checking and tests. The production build is a separate gate. To run them individually:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Tests cover booking/issuance invariants, session and roster validation, and CSV formula escaping. These checks do not prove visual parity or production security. Visual comparison requires running the UI; the original desktop reference viewport is **1437 × 734 CSS pixels**.

## Reference assets

The visual reconstruction uses supplied product recordings. Branding and some display names remain reference-derived; contact emails and phone numbers use demonstration values. This repository does not contain the source recordings. Geist Sans is bundled under the [SIL Open Font License](public/fonts/OFL.txt).

Reference-derived branding is included for demonstration and does not imply endorsement. No license to Noto's product or brand assets is granted by this repository. Do not add real student records, credentials, private documents or recordings to public commits.
