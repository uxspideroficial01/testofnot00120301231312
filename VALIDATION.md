# Refactor verification

Verified locally on October 8, 2026 using Node.js 22.23.1.

## Automated gates

- `npm run check`: ESLint with no warnings, Prettier, strict TypeScript including unused bindings, and Node tests.
- `npm run build`: successful Next.js production build; the page is dynamically rendered for per-request CSP nonces.
- `npm audit --json`: zero known vulnerabilities reported across the installed dependency tree at the time of review. This is a point-in-time dependency check, not a security certification.
- HTTP inspection of the production preview: response headers include CSP, no-store, nosniff, frame denial, no-referrer and restricted browser permissions. Rendered scripts carry the response nonce.

The GitHub Actions workflow runs checks, a production build and a production-dependency audit. Actions are pinned to commit hashes. Results for published commits are available in the repository's Actions tab; local verification does not imply that a remote workflow has passed.

## Browser checks

The production preview was exercised through the actual browser:

- Combined issuance and booking reaches success, keeps the original lesson cancelled and leaves sibling sessions unchanged.
- Reopening the original shows the linked makeup without another scheduling action.
- Standalone issuance is reused by the subsequent confirmation.
- Editing one CRM contact does not populate a different contact with the same display name.
- Staff profiles open, and edited weekly availability survives switching profile tabs.
- Calendar navigation opens the recorded session drawer; enrollment adds one selected attendee to its roster.
- No browser console errors or warnings were reported during the reviewed paths.

The CSS extraction preserved selectors, declarations and cascade order; only file boundaries and formatting changed. The unused personal portrait was replaced with initials. This review is not a new zero-difference pixel comparison against every recording frame.

## Review scope and limits

This change separates feature UI, controllers, fixtures and pure booking rules. It adds regression coverage for family membership, conflicts, malformed dates, duplicate enrollment, atomic in-memory booking results, idempotency and CSV formula escaping.

Remaining limits are intentional and documented in [SECURITY.md](SECURITY.md): no PostgreSQL adapter, login, enforceable roles, tenancy, durable state or outbound messaging. Browser-only validation is not an authorization mechanism. Secondary demonstration forms are not verified production workflows.

The reference-derived fixture names and Noto branding remain visible. Recordings, private contact values, the copied portrait, local refactoring scripts, dependency folders and build output are excluded from the source delivery.

## Integrated family filter

The follow-up adds Family to the reference Filter menu and exercises a directory of 125 synthetic households. All 60 automated tests passed, along with lint, formatting, TypeScript and the production build.

Browser checks covered paginated results, no matches, guardian-email and child-name searches, homonymous families, keyboard selection, Escape without committing a draft, applying another family and reloading its canonical URL. Combining Family with Status: Cancelled showed only the selected family's cancelled lesson. Issuance and scheduling then reached success with no browser console errors.

Search and row isolation are tested separately from React rendering. This proves the seeded local demonstration; it does not measure database search latency or introduce a server integration.
