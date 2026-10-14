# Noto administrative workflow prototype

A reference-based reconstruction of an administrative scheduling workspace, with a proposed family-aware makeup workflow. Built for a Design Engineer interview using React, Next.js, TypeScript and Node.js.

The workspace also includes a proposed redesign of **Pay rates**, covering the existing page and add/edit override flows.

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

## Deploy to Netlify

[Open the hosted demonstration](https://noto-workflow-uxspider.netlify.app/?view=Sessions&family=martins).

`netlify.toml` declares the Next.js build and output directory. Netlify automatically supplies its Next.js adapter; this application requires that runtime rather than a static-file upload because it renders dynamic routes and sets a per-request Content Security Policy nonce.

After authenticating the official Netlify CLI, deploy to your chosen project:

```sh
npx netlify-cli deploy --prod --site <project-name-or-id>
```

The CLI builds and uploads the application. `.netlify/` is ignored by Git. Manual deployments do not update automatically after a GitHub push; run the deployment command again to publish changes. No environment variables are needed for this demonstration.

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

## Pay rates design trial

Open [Pay rates locally](http://127.0.0.1:3006/?view=Payroll), or choose **Payroll** in the existing sidebar. This local redesign is not automatically included in the hosted deployment linked above.

The page keeps the default rate and **Add override** visible for every instructor. Expand a row to inspect **Class/Service** and **Enrollment** overrides. The form identifies staff and target, separates calculation methods, and summarizes the proposed assignment before saving. A successful add or edit closes the form, expands the instructor’s row and shows a confirmation on the page. To add another override, reopen Add override; validation errors keep the draft open. Cancel discards only the current draft. Deletion retains a named confirmation.

Click **Staff**, **Default rate**, or **Overrides** in the column headings to sort ascending, then click again to reverse. Sorting applies to the searched/filtered roster and preserves expanded rows. Equal amounts/counts use name order; tiered default rates remain last in both directions because they have no single comparable price. Override counts reflect the current demo edits.

Missing required selections receive focus without clearing the draft. Empty states distinguish staff without linked targets, targets that already have overrides, and searches with no matches. Editing compares the saved rate with the proposed rate, including changes between hourly, per-session and tiered methods. Deleting preserves nearby visual context and keyboard focus even when the instructor moves within the sorted list.

**Filter** opens an anchored, searchable menu with **Staff** and **Services**. Choose a category, search its options, and select a value to apply it and close the menu. Both filters can be combined. Escape, an outside click, or clicking Filter again closes the menu; each category can be cleared individually, or use **Clear filters** to reset both. Arrow keys navigate the options, and Enter selects the focused option.

Try these scenarios:

1. **No overrides:** add a Class/Service override for Noah Miller without expanding his row. Choose Piano and an hourly rate, then save.
2. **Similar enrollments:** add an Enrollment override for Emma Wilson. Choose Sophie Bennett's **Weekly 60-minute plan**, set **Flat per session**, and save. The existing 30-minute plan remains separate.
3. **Edit:** expand Emma and edit Piano. Switch to Flat per session, change the amount, inspect the summary and save. Other overrides retain their values.
4. **Many overrides and tiered pay:** expand Marcus Reed's 23 overrides. Edit Sophie Bennett's 30-minute enrollment, replace its existing structure, then reopen and choose Hourly rate. The retained $60.00 value is restored; removing the tiered association does not delete the override.

With **Tiered pay** selected and enabled for the organization, the searchable **Pay structure** picker retains **Create new pay structure**. This opens a local reproduction of the existing creation form recorded on October 13: Name, Description, Referral Hourly Rate, rate tiers, Add tier, and Save pay structure. Saving creates a structure in workspace memory and closes only the child dialog. It does not select the new structure or save the override: select it and save the override separately, as in the recording. Cancel and Escape discard only the unsaved structure draft. A saved structure remains available across staff and after canceling an override until reload/reset. No request is sent to Noto.

Tier-editor safeguards are demo assumptions, not verified Noto calculation rules: at least one tier, the first starting at zero, strictly increasing non-negative start hours with up to two decimal places, and non-negative currency values. Disabled end-hour fields display the next start boundary; the last remains empty. The demo stores start boundaries and integer cents only. Referral Hourly Rate is retained as entered, without inventing its meaning or applying it to payroll. Multiple-tier boundary behavior requires product confirmation; the recording demonstrated one tier.

All compensation records are synthetic. The demo contains 150 instructors: the original 12 walkthrough records plus 138 deterministic load fixtures, covering zero, one, three, six, twelve and 23 overrides. Search for **Zara Ross** to reach the last record, or use Staff and Services filters. Browser checks cover searching, filtering, and expanding/collapsing the complete roster; these are functional checks, not a production performance benchmark or a usability study. `PAY_CAPABILITIES` is an organization-level fixture with tiered pay enabled so existing-structure selection can be demonstrated. The form also supports hiding that option when disabled and retaining a legacy assignment. That disabled-flag policy is a documented prototype assumption, not a confirmed production rule.

Amounts are stored as integer cents. One override per staff/target, two decimal places and acceptance of zero are prototype validation choices requiring confirmation. The demo does **not** calculate payroll, resolve overlapping overrides, apply changes to prior payroll, or persist records beyond the current session. The default rate is shown read-only here; the staff-profile compensation editor is outside this trial implementation. Existing payroll tabs outside Pay rates are visibly disabled.

The Pay rates browser scenarios verify the 150-staff roster, whole-row expansion and keyboard access, creation, plan identity, editing without affecting adjacent records, tiered-to-fixed restoration, cancellation, picker keyboard behavior, and deletion focus. These checks validate the implemented demonstration, not Noto's backend rules or administrator usability.

Supporting views include Scheduling Links, Forms, Tasks, Email, Text & Voice, Email Templates, Members and Staff. Their purpose is to make the demonstration navigable, not to imply a complete implementation of the underlying products. Email and SMS sending are disabled. Confirmation downloads and email drafts remain local. The Documents view stores selected file names and sizes in memory; it does not upload or read their contents.

## Code and verification

Feature components, state hooks and styles are colocated under `src/features`. Pure booking rules and data contracts live under `src/domain`; cross-feature demonstration data lives under `src/demo`. Feature entry points are imported directly. `src/components` holds shared controls and supporting-view composition.

Read [ARCHITECTURE.md](ARCHITECTURE.md) for state ownership, dependency boundaries and booking invariants. Read [SECURITY.md](SECURITY.md) for the demonstration's security model and limitations.

```sh
npm run check
npm run build
```

The browser suite runs against a production build on a dedicated local port, with a fresh browser context for each test:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

It exercises family search, pagination, keyboard selection, cancelling draft filters, household isolation, and the complete makeup booking journey. The journey checks that the original and sibling lessons remain intact and that reopening the original does not allow another booking. GitHub Actions runs this suite after the production build. Failure screenshots and traces stay in ignored local test output directories.

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

The visual reconstruction uses supplied product recordings. Branding and some display names remain reference-derived; contact emails and phone numbers use demonstration values. This repository does not contain the source recordings. Geist Sans is bundled under the [SIL Open Font License](public/fonts/OFL.txt). Sidebar icon geometry is preserved from Lucide 0.468.0 under its [ISC license](third-party/LUCIDE-LICENSE.txt), matching the supplied reference independently of the version used by other controls.

Reference-derived branding is included for demonstration and does not imply endorsement. No license to Noto's product or brand assets is granted by this repository. Do not add real student records, credentials, private documents or recordings to public commits.
