# V1 TO V2 DATA MIGRATION SPECIFICATION — LITTLE DAYS

## 1. Overview & Non-Destructive Guarantee
When users update from V1 (Ten-Day Readiness Tracker) to V2 (Little Days V2 Town & Adventure), their existing check-in logs, habit records, and couple profile are automatically preserved without data loss.

---

## 2. Migration Pipeline

```text
App Launch ➔ detectV1Data()
   │
   ├── YES ➔ createRollbackSnapshot() ➔ (Saved to 'little_days_v1_backup_snapshot')
   │          │
   │          └── migrateV1ToV2() ➔ Field-by-Field Mapping ➔ schemaVersion: 2
   │
   └── NO  ➔ Mark migration completed ➔ Continue normal V2 startup
```

---

## 3. Field-by-Field Schema Mapping

| Legacy V1 Field | V2 Schema Destination | Transform / Fallback Rule |
|---|---|---|
| `partner1Name` / `user1Name` | `coupleProfile.partner1Name` | String trim, fallback 'Anh' |
| `partner2Name` / `user2Name` | `coupleProfile.partner2Name` | String trim, fallback 'Em' |
| `relationshipStartDate` | `coupleProfile.relationshipStartDate` | ISO Date format YYYY-MM-DD |
| `primaryMascot` | `coupleProfile.primaryMascot` | 'chiikawa' / 'usagi' / 'hachiware' |
| `readiness_daily_logs` | `little_days_v2_migrated_logs` | Wrapped with `{ schemaVersion: 2, logs: [...] }` |

---

## 4. Rollback & Fault Tolerance
- A complete JSON dump of all legacy localStorage items is stored at `little_days_v1_backup_snapshot` before any schema mutation occurs.
- If JSON parsing encounters corrupted or truncated strings, the original raw values remain untouched and fallbacks are safely initialized.
