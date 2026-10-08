# Architecture

## Scope

The application is a single local administrative workspace. Next.js supplies the page shell and development/production runtime; React manages interactive demonstration state. The repository has no application API, database adapter, background job, authentication provider or outbound messaging integration.

The architecture separates the reference reconstruction from the proposed administrative makeup flow while sharing primitive controls and attendance vocabulary. Keeping that boundary visible avoids presenting prototype assumptions as verified Noto requirements.

## Source map

```text
src/
  app/                  Next.js page, layout and global visual tokens
  components/           Compatibility entry points and common UI primitives
  demo/                 Synthetic family and booking scenario
  domain/               Booking, availability, attendance and family rules
  features/
    workspace/          Navigation, family filtering and session list composition
    calendar/           Calendar controls, filters, grid and local state
    makeup/             Proposed administrative makeup flow and stage components
    sessions/           Recorded session details, roster, notes and dialogs
    profiles/           Member/staff tabs and profile availability state
    crm/                Board, lead detail, contact editor and activity
    people/             Member/staff lists and CSV export
    scheduling/         Scheduling links and availability finder
    forms/              Local form list and editing
    tasks/              Local task list and editing
    messaging/          Email drafts and recorded inbox presentation
    templates/          Demonstration email templates
    secondary-shared/   Controls, styles and CSV serialization for supporting views
  shared/lib/           Small cross-feature utilities
```

Feature styles retain the reference selectors and are split by UI responsibility. The compatibility CSS entry points preserve their loading order. Feature fixtures are colocated with the feature that owns them; `src/demo` holds the cross-feature family scenario. The recorded session model and its reference fixtures currently share `src/domain/official.ts`.

## Dependency direction

- The Next.js page initializes the workspace from supported URL state.
- Workspace components compose features and pass typed callbacks for navigation and updates.
- Feature hooks own interaction state; view components render that state and invoke explicit actions.
- Domain functions operate on plain typed values and do not depend on React, the DOM or network services.
- Shared utilities handle narrow browser concerns such as local downloads. They do not own booking rules.

When adding behavior, put its invariant at the narrowest boundary that can enforce it. For example, roster capacity is checked when submitting enrollment, not only by hiding an option in the picker. Avoid importing an entire workspace into a leaf component to access one rule.

## State ownership

Session filtering stores a validated family ID at workspace level. The anchored filter dialog owns its temporary category/search/selection state and commits a family only on Apply. `family-search.ts` handles normalized lookup and bounded pagination; `session-filter-model.ts` combines exact filter values. `session-rows.ts` enforces family membership by student ID before text filtering. Directory fixtures and their scheduled lessons are separate from the original makeup scenario.

`useWorkspace` owns the selected view, open record, reference session collection and proposed booking state. The two session collections support different demonstration paths; they are not two synchronized backend representations.

The makeup hook coordinates the origin, time selection, review and success stages. The domain returns a result union; the UI commits returned state only on success and displays the failure reason otherwise.

Reference session edits are reported to workspace state through callbacks. Profile-specific drafts and supporting views own their own local state. CRM draft notes and editable contact fields are keyed by stable lead IDs, so contacts with the same display name do not share edits.

No state is written to browser storage or a server. Reload resets the application. A feature unmount can also discard its local drafts; tab-local preservation should not be confused with durable persistence.

## Domain distinctions

`Attendance` describes an attendee's outcome. Session lifecycle, an issued makeup and a scheduled replacement are separate concepts.

The proposed booking scenario uses:

- `Session`: a student's lesson, including links to an original lesson and applied issuance when applicable.
- `Slot`: a seeded candidate time with instructor, location and availability.
- `MakeupIssuance`: the right represented in this demonstration to schedule one replacement for one original lesson and student.
- `BookingState`: sessions, slots and issuances evaluated together.
- `Family`: guardian and members used to find the family and present sibling schedules.

The official reference model supports group-session rosters and observed display states. It shares attendance types but is not forced into the single-student booking scenario's shape.

## Booking invariants

The pure functions in `src/domain/makeup.ts` enforce the demonstration's assumptions:

1. Issuance belongs to an original lesson and its student.
2. Reissuing the same lesson returns its existing issuance.
3. Applying an issuance links one new session to that original lesson.
4. Repeating a successful booking resolves to the existing linked booking.
5. Unavailable or conflicting slots fail without changing the input state.
6. Combined issuance and scheduling commit together in the returned in-memory result.
7. The original attendance and unrelated family sessions are preserved.

These are tested local invariants, not verified Noto policies and not a database transaction. Timezone conversion, recurrence, travel time, concurrent writes and institution-specific eligibility require separate product and backend work.

## Verification boundaries

TypeScript checks contracts. ESLint and Prettier check configured code conventions. Node tests exercise domain and validation behavior. A Next.js production build verifies the deployable application bundle. Browser review checks the visual states and interaction sequences represented in the demonstration.

None of those individually proves the others. A future persisted implementation needs server-side authorization, transactional writes and constraints, integration tests, and validation against agreed requirements before it can handle customer data.
