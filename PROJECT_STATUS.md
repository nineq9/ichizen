# PROJECT STATUS — ichizen

Last synced: 2026-08-21
Project state: ACTIVE / Safari visual refinement in progress
Source of truth: this repository + this file

## Current verified GitHub state
- Safari prototype is active on GitHub Pages.
- Recent work repeatedly repaired/replaced the round crystal/orb asset and Safari rendering fallback.
- Light-mode brightness and number spacing were recently refined.
- Final visual fidelity to the approved mock still needs verification.

## Approved storage architecture
- ICHIZEN is local-first.
- Current Safari prototype should migrate durable user data to IndexedDB while preserving existing `ichizen-state-v4` data.
- Native iOS release will use SwiftData on-device as the primary database.
- Optional iCloud / CloudKit backup-sync may be added for restore across devices/reinstall.
- Normal use must not require sign-in or an external server.
- See `LOCAL_FIRST_STORAGE.md` for the source-of-truth storage decision.

## Current visual focus
- Preserve a truly round crystal/orb.
- Match the approved light/dark mock rather than inventing new styling.
- Crystal asset should have real alpha transparency; do not use a screenshot of a checkerboard transparency preview.
- No star-like particles inside the glass sphere.
- Keep natural contact shadow and ambient shadow so the object does not float above the background.
- Keep light/dark presentation and number typography visually consistent with the approved direction.

## Open / needs verification
- Verify the latest crystal asset actually renders correctly on iPhone Safari.
- Verify light mode is no longer unnaturally dark and number spacing remains clean.
- Verify final crystal asset has real transparency and no baked checkerboard pixels.
- Implement IndexedDB migration for the Safari prototype without losing current data.

## Next safe step
1. Compare current Safari preview against the approved mock.
2. Fix only remaining crystal/background/shadow/type mismatches.
3. Wire the local-first IndexedDB migration without changing the visible UI.
4. Re-test existing saved entries and balance after migration.

## Working rule
Future sessions must read `PROJECT_STATUS.md` before continuing. Do not call the project DONE until the intended visual result and local-data persistence are actually observed.
