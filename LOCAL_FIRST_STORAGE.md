# ICHIZEN Local-first Storage

Approved: 2026-08-21

## Product decision
ICHIZEN is local-first. A user's virtue balance, entries, received-good-things notes, reflection data, and UI settings should live on the user's device by default.

## Current Safari prototype
- Primary target for durable browser storage: IndexedDB.
- `localStorage` may remain only as a compatibility/fallback layer during migration.
- No account or remote server is required for the MVP.
- Existing `ichizen-state-v4` data must be migrated without deleting current user data.

## Native iOS release
- Primary database: SwiftData stored locally on the iPhone.
- Optional backup/sync: iCloud / CloudKit.
- The app must remain usable without enabling iCloud sync.
- No mandatory sign-in for normal use.

## Core records
### VirtueEntry
- id
- createdAt
- text
- score
- reason

### ReceivedEntry
- id
- createdAt
- text
- score
- reason
- whyItMattered

### AppState / Settings
- currentVirtueBalance
- themeMode (Light / Auto / Dark)
- lastOpenAt
- storageSchemaVersion

## Privacy principle
Personal reflections should not be sent to an external server just to make the app function. Server-side storage should only be added later for a feature that genuinely requires it and should be opt-in where practical.

## Migration rule
Never silently discard existing local data when changing storage implementations. Migrations must preserve current virtue balance and all entries.

## Backup behavior
If iCloud is enabled in the native iOS version, use it to restore data after device replacement/reinstall where supported. Local use must continue if iCloud is unavailable.
