# ROLLBACK PLAN & EMERGENCY RECOVERY — LITTLE DAYS V2

## 1. Overview
In the event of an unexpected release regression on GitHub Pages, follow the documented rollback procedures to restore previous stable deployments or recover corrupted client states.

---

## 2. Release Rollback Steps

### Step 1: Identify Last Stable Commit
- **Last Verified Release Tag / Commit**: `e386d14` (Phase 12 complete)
- **V1 Stable Baseline**: `dd373f0` (Audit & stabilization)

### Step 2: Emergency Git Rollback
```bash
git checkout main
git revert HEAD --no-edit
git push origin main
```

---

## 3. Client-Side Data Recovery

### 3.1 V1 Snapshot Rollback
If a user experiences an issue with automatic migration:
1. Open Browser DevTools (`F12` ➔ Application ➔ Local Storage).
2. Retrieve the snapshot string stored under the key: `little_days_v1_backup_snapshot`.
3. Restore the legacy raw keys (`readiness_couple_profile`, `readiness_daily_logs`).

### 3.2 Pre-Restore Safety Snapshot
Before any backup import executes, a safety copy is automatically created at `little_days_pre_restore_snapshot`. Users can restore this snapshot directly from DevTools if an accidental file overwrite occurs.
