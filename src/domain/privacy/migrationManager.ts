import type { MigrationResult } from './types'

const V1_KEYS = {
  PROFILE_V1: 'readiness_couple_profile',
  LOGS_V1: 'readiness_daily_logs',
  LEGACY_PROFILE: 'couple_profile_v1'
}

const MIGRATION_SNAPSHOT_KEY = 'little_days_v1_backup_snapshot'
const MIGRATION_FLAG_KEY = 'little_days_v2_migration_status'

export const migrationManager = {
  detectV1Data(): boolean {
    return Boolean(
      localStorage.getItem(V1_KEYS.PROFILE_V1) ||
      localStorage.getItem(V1_KEYS.LOGS_V1) ||
      localStorage.getItem(V1_KEYS.LEGACY_PROFILE)
    )
  },

  isMigrationCompleted(): boolean {
    return localStorage.getItem(MIGRATION_FLAG_KEY) === 'completed'
  },

  createRollbackSnapshot(): boolean {
    try {
      const dump: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) dump[key] = localStorage.getItem(key) || ''
      }
      localStorage.setItem(MIGRATION_SNAPSHOT_KEY, JSON.stringify(dump))
      return true
    } catch {
      return false
    }
  },

  migrateV1ToV2(): MigrationResult {
    if (this.isMigrationCompleted()) {
      return { migrated: false, fromVersion: 1, toVersion: 2, snapshotSaved: false }
    }

    const hasV1 = this.detectV1Data()
    if (!hasV1) {
      localStorage.setItem(MIGRATION_FLAG_KEY, 'completed')
      return { migrated: false, fromVersion: 1, toVersion: 2, snapshotSaved: false }
    }

    // Step 1: Create Rollback Snapshot
    const snapshotSaved = this.createRollbackSnapshot()

    try {
      // Step 2: Migrate Couple Profile
      const rawProfile = localStorage.getItem(V1_KEYS.PROFILE_V1) || localStorage.getItem(V1_KEYS.LEGACY_PROFILE)
      if (rawProfile) {
        try {
          const parsed = JSON.parse(rawProfile)
          const v2Profile = {
            schemaVersion: 2,
            id: parsed.id || 'profile_default',
            partner1Name: parsed.partner1Name || parsed.user1Name || 'Anh',
            partner2Name: parsed.partner2Name || parsed.user2Name || 'Em',
            partner1Nickname: parsed.partner1Nickname || parsed.partner1Name || 'Anh',
            partner2Nickname: parsed.partner2Nickname || parsed.partner2Name || 'Em',
            relationshipStartDate: parsed.relationshipStartDate || '2024-01-01',
            anniversaryDate: parsed.anniversaryDate || parsed.relationshipStartDate || '2024-01-01',
            primaryMascot: parsed.primaryMascot || 'chiikawa',
            secondaryMascot: parsed.secondaryMascot || 'usagi',
            themePreference: parsed.themePreference || 'pastel',
            soundEnabled: parsed.soundEnabled ?? true,
            updatedAt: new Date().toISOString()
          }
          localStorage.setItem('little_days_couple_profile_v2', JSON.stringify(v2Profile))
        } catch { /* retain original data */ }
      }

      // Step 3: Migrate Daily Logs & Habits
      const rawLogs = localStorage.getItem(V1_KEYS.LOGS_V1)
      if (rawLogs) {
        try {
          const parsedLogs = JSON.parse(rawLogs)
          // Keep compatible logs format
          localStorage.setItem('little_days_v2_migrated_logs', JSON.stringify({
            schemaVersion: 2,
            logs: parsedLogs,
            migratedAt: new Date().toISOString()
          }))
        } catch { /* retain original data */ }
      }

      // Mark migration as completed
      localStorage.setItem(MIGRATION_FLAG_KEY, 'completed')

      return {
        migrated: true,
        fromVersion: 1,
        toVersion: 2,
        snapshotSaved
      }
    } catch (e: any) {
      return {
        migrated: false,
        fromVersion: 1,
        toVersion: 2,
        snapshotSaved,
        error: e.message || 'Lỗi trong quá trình chuyển đổi dữ liệu V1->V2'
      }
    }
  }
}
