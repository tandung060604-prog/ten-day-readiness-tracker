# PHASE 11 — PRIVACY, BACKUP, DATA VAULT AND V1→V2 MIGRATION

## Goal

Harden local personal data, provide safe backup/export and guarantee V1 users do not lose data.

This phase is mandatory before public release.

---

# Data Policy

Repository source must contain only:

- demo profiles;
- sample journal content;
- sample images/assets;
- synthetic/test data.

Never commit real:

- names;
- birthdays;
- cycle data;
- private journal;
- couple photos;
- precise location;
- health notes;
- private routines.

---

# Storage

Prefer IndexedDB for structured user data.

A lightweight library such as Dexie may be used if it improves:

- schema versioning;
- transactions;
- migrations;
- querying.

Do not add it if current storage is already robust and equivalent.

---

# Schema

Every persisted root should include:

```ts
schemaVersion
createdAt
updatedAt
```

Maintain explicit version migrations.

---

# Migration

Required V1 → V2 process:

1. detect V1 storage;
2. snapshot/backup old values;
3. parse safely;
4. validate;
5. migrate to V2 schema;
6. verify;
7. mark migration complete;
8. retain rollback data for a defined period/version;
9. never silently discard malformed data.

Document migration mapping field by field.

---

# Import

Never:

`JSON.parse → setState`

Instead:

- parse;
- validate schema;
- show validation errors;
- preview import;
- merge/replace choice where safe;
- backup current data before replacement.

---

# Export

Provide:

### Standard Local Backup

Structured JSON export.

### Optional Encrypted Backup

If implemented:

- use browser-standard cryptography;
- do not invent custom encryption;
- require passphrase;
- clearly state passphrase cannot be recovered.

Do not claim encryption strength beyond what is implemented.

---

# Optional Vault

For sensitive areas such as journal/cycle notes:

Potential:

- local PIN gate;
- WebAuthn/device auth if browser support and UX are acceptable;
- privacy blur/lock.

This is an app privacy layer, not a guarantee against a compromised device.

Document limitations.

---

# Location

Default:

- city/timezone only.

Precise GPS:

- only after explicit action;
- explain why;
- do not store by default.

---

# Wellness/Cycle Data

Mark as:

`Sensitive Local Data`

Default:

- local only;
- hidden from unrelated views;
- export only when user chooses full backup.

Show:

`Predictions are estimates and are not medical advice.`

Do not label estimates as medically accurate.

---

# Privacy Settings

Town Hall should provide:

- sensitive building visibility;
- profile visibility;
- photo privacy;
- include/exclude sensitive data in export;
- reset sensitive data;
- full local reset.

Require clear confirmation for destructive reset.

---

# Tests

Test:

- V1 detection;
- V1 migration;
- malformed V1 data;
- import invalid schema;
- export/import roundtrip;
- sensitive building hidden;
- reset;
- backup before destructive replacement;
- encrypted backup roundtrip if implemented.

---

# Acceptance Criteria

- [ ] Real personal data is not in tracked source.
- [ ] V1 migration is documented and tested.
- [ ] Imports validate before mutation.
- [ ] Backup/export works.
- [ ] Sensitive data is classified.
- [ ] Precise GPS is opt-in only.
- [ ] Sensitive building can be hidden.
- [ ] Destructive reset requires confirmation.
- [ ] Phase report exists.

---

# Required Output

Create:

- `docs/v2/V2_PERSONALIZATION_PRIVACY.md`
- `docs/v2/V1_TO_V2_MIGRATION.md`
- `docs/v2/BACKUP_AND_VAULT_SPEC.md`
- `docs/v2/reports/PHASE_11_REPORT.md`

Then stop.
