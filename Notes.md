## Key decisions & trade-offs

- **Stack:** Vite + React + TypeScript + Tailwind CSS. Fast dev loop, no
  framework overhead beyond what the assignment calls for.

- **Server state:** TanStack Query for all API calls instead of manual
  `useEffect`/`useState` fetching — gives caching, loading/error states, and
  cache invalidation on mutation (e.g. record list refetches automatically
  after a create/edit) without hand-rolled logic.

- **Audit trail grouping:** The API returns flat, per-field audit rows.
  The frontend groups them into "events" — one card per save action — keyed
  by shared timestamp:

  ```ts
  const eventKey = (e: AuditEntry) => e.changed_at ?? e.createdAt;
  ```

  `changed_at` is `null` on creation rows, so those fall back to
  `createdAt` and are grouped together as a single "Created" event.

- **No-op audit rows filtered client-side.** Some update events in the API
  response include rows where `old_value === new_value` (a backend diff bug
  that logs a field even when it didn't change). The frontend defensively
  drops these:

  ```ts
  const changes = group.filter((e) => isCreation || e.old_value !== e.new_value);
  ```

  This is a **display-layer workaround, not the fix** — the real fix
  belongs in the backend's diff logic. [State here whether that backend fix
  was also applied, or if this filter is the only mitigation shipped.]

- **Testing scope:** Only pure logic was unit tested — `groupAuditEntries`
  (audit event grouping/filtering) — not component rendering. This matches
  the assignment's "frontend tests are optional/light" framing and its
  general "quality over quantity" guidance; test effort was prioritized on
  the backend's audit-diff and pagination logic instead.

## What I'd do differently with more time

- Add component-level tests (React Testing Library) for the cleaning-record
  form and list interactions.
- Build out a full CRUD UI for equipment (create/edit), not just listing,
  if time didn't allow it.
- Improve empty-state and error-state styling — currently minimal.

## Deliberately left out

- Auth / login UI — no auth was required by the spec.
- Any UI-driven business rules around equipment status transitions — no
  such rules were specified, so none were built.