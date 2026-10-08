# Security model

## Intended use

This repository is an unauthenticated local demonstration with seeded data. It must not be used to manage real students, guardians, payments or school operations.

The **Admin**, **Restricted Admin**, private-note labels and portal actions are interface states. They are not enforced roles or access controls. The application has no authentication, tenant isolation, server-side authorization or audit log.

## Data handling

- React state holds edits for the current demonstration. There is no application persistence, PostgreSQL connection or synchronization with Noto.
- Email, SMS and portal invitations are not sent. Sending controls are disabled or presented as unavailable local actions.
- Local exports use browser downloads. Exporting a confirmation or contact list does not transmit it to a service.
- The Documents picker retains file names and sizes only in memory. File contents are not read or uploaded.
- Demo contact values use `example.com` and reserved `555-01xx` phone numbers. Some display names and branding remain derived from the supplied references.
- No application credentials or environment configuration are required. Environment files, local caches and build artifacts are excluded from Git.

Keep real personal data out of the demo. A browser download can still be saved to the user's disk, and entered information remains visible to anyone using that browser session.

## Defensive controls

User-entered strings are rendered through React text interpolation. The application does not evaluate input or inject raw HTML. Session drafts validate dates and time ranges; enrollment submission checks duplicates and capacity. These controls preserve local data consistency and do not replace server-side validation or authorization.

Contact CSV cells are quoted, embedded quotes are escaped and formula-like prefixes are neutralized before spreadsheet import. The serializer has regression tests covering commas, line breaks, quotes and formula prefixes. Shared text downloads constrain filenames and revoke temporary object URLs after use.

Development and production scripts bind to `127.0.0.1`. Changing the binding or publishing the app makes the demo reachable by others; it does not add authentication.

The response policy is maintained in [`src/proxy.ts`](src/proxy.ts) and [`next.config.ts`](next.config.ts). Application responses use a per-request script nonce and Content Security Policy; document caching is disabled. Inline styles remain permitted to support the current React style props. Development additionally permits script evaluation and local WebSocket connections required by the development runtime.

Headers disable framing, MIME sniffing, referrer disclosure, camera, microphone and geolocation. Review the policy when changing scripts, styles, embedded resources or network integrations. These controls are defense in depth; they do not make this an authorized multi-user system.

## Limits of local booking checks

Issuance and booking validation run in the browser against in-memory state. A user can modify that state using developer tools. There is no authoritative server or cross-user lock.

A production implementation would need authorization on every data operation, tenancy-aware queries, database constraints and transactions, conflict handling for concurrent requests, secure session handling, controlled file storage and delivery-provider integration. Those capabilities are outside this repository's scope.

## Reporting and contributing

Report a suspected vulnerability privately to the repository owner. Do not publish credentials or personal data in an issue, screenshot or reproduction. This project does not advertise a managed vulnerability-response service or response-time commitment.

Before contributing, run the repository checks, inspect new dependencies and confirm that fixtures, screenshots, recordings and configuration contain no private data. `.gitignore` helps prevent accidental inclusion; it is not a secret scanner. Review the staged diff before making a repository public.
