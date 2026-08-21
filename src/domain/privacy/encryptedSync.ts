import { backupManager } from './backupManager'
import type { BackupPayload, EncryptedSyncEnvelope } from './types'

const DEVICE_ID_KEY = 'little_days_sync_device_id_v1'

function getDeviceId(): string {
  try {
    const saved = localStorage.getItem(DEVICE_ID_KEY)
    if (saved) return saved
    const generated = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(DEVICE_ID_KEY, generated)
    return generated
  } catch {
    return 'temporary-device'
  }
}

function updatedAt(value: unknown): number {
  const raw = value && typeof value === 'object' && 'updatedAt' in value ? (value as { updatedAt?: string }).updatedAt : undefined
  const timestamp = raw ? Date.parse(raw) : 0
  return Number.isFinite(timestamp) ? timestamp : 0
}

function mergeById(local: unknown, incoming: unknown): unknown {
  if (!Array.isArray(local) || !Array.isArray(incoming)) return updatedAt(incoming) >= updatedAt(local) ? incoming : local
  const merged = new Map<string, unknown>()
  for (const item of [...local, ...incoming]) {
    if (!item || typeof item !== 'object') continue
    const key = String((item as { id?: string }).id ?? JSON.stringify(item))
    merged.set(key, item)
  }
  return [...merged.values()]
}

function mergePuzzleProgress(local: unknown, incoming: unknown): unknown {
  const left = (local && typeof local === 'object' ? local : {}) as Record<string, Record<string, unknown>>
  const right = (incoming && typeof incoming === 'object' ? incoming : {}) as Record<string, Record<string, unknown>>
  const merged: Record<string, Record<string, unknown>> = { ...left, ...right }
  for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
    const a = left[key] ?? {}; const b = right[key] ?? {}
    merged[key] = { ...a, ...b, completed: Boolean(a.completed || b.completed), rewardClaimed: Boolean(a.rewardClaimed || b.rewardClaimed), stars: Math.max(Number(a.stars ?? 0), Number(b.stars ?? 0)), highScore: Math.max(Number(a.highScore ?? 0), Number(b.highScore ?? 0)) }
  }
  return merged
}

function mergeWellnessLogs(local: unknown, incoming: unknown): unknown {
  if (!Array.isArray(local) || !Array.isArray(incoming)) return updatedAt(incoming) >= updatedAt(local) ? incoming : local
  const byDay = new Map<number, unknown>()
  for (const item of [...local, ...incoming]) {
    if (!item || typeof item !== 'object') continue
    const day = Number((item as { dayNumber?: number }).dayNumber)
    const previous = byDay.get(day)
    byDay.set(day, !previous || updatedAt(item) >= updatedAt(previous) ? item : previous)
  }
  return [...byDay.entries()].sort(([a], [b]) => a - b).map(([, value]) => value)
}

function mergeGameState(local: unknown, incoming: unknown): unknown {
  if (!local || typeof local !== 'object') return incoming
  if (!incoming || typeof incoming !== 'object') return local
  const newer = updatedAt(incoming) >= updatedAt(local) ? incoming : local
  const older = newer === incoming ? local : incoming
  const next = { ...JSON.parse(JSON.stringify(older)) as Record<string, unknown>, ...JSON.parse(JSON.stringify(newer)) as Record<string, unknown> }
  const newerState = newer as Record<string, unknown>
  const olderState = older as Record<string, unknown>
  const claims = { ...((olderState.dailyChallengeClaims as Record<string, string[]>) ?? {}), ...((newerState.dailyChallengeClaims as Record<string, string[]>) ?? {}) }
  for (const date of new Set([...Object.keys((olderState.dailyChallengeClaims as object) ?? {}), ...Object.keys((newerState.dailyChallengeClaims as object) ?? {})])) {
    claims[date] = [...new Set([...(olderState.dailyChallengeClaims as Record<string, string[]>)?.[date] ?? [], ...(newerState.dailyChallengeClaims as Record<string, string[]>)?.[date] ?? []])]
  }
  next.dailyChallengeClaims = claims
  return next
}

export const encryptedSync = {
  async createEnvelope(passphrase: string): Promise<EncryptedSyncEnvelope> {
    return { version: 1, kind: 'little-days-encrypted-sync', deviceId: getDeviceId(), createdAt: new Date().toISOString(), payload: await backupManager.encryptBackup(backupManager.generateBackupPayload(), passphrase) }
  },
  async decryptEnvelope(envelope: EncryptedSyncEnvelope, passphrase: string): Promise<BackupPayload> {
    if (envelope.kind !== 'little-days-encrypted-sync' || envelope.version !== 1) throw new Error('Gói đồng bộ không được hỗ trợ')
    return backupManager.decryptBackup(envelope.payload, passphrase)
  },
  mergePayloads(local: BackupPayload, incoming: BackupPayload): BackupPayload {
    return {
      ...local,
      ...incoming,
      exportedAt: new Date(Math.max(Date.parse(local.exportedAt) || 0, Date.parse(incoming.exportedAt) || 0)).toISOString(),
      gameState: mergeGameState(local.gameState, incoming.gameState),
      coupleProfile: updatedAt(incoming.coupleProfile) >= updatedAt(local.coupleProfile) ? incoming.coupleProfile : local.coupleProfile,
      puzzleProgress: mergePuzzleProgress(local.puzzleProgress, incoming.puzzleProgress),
      loveLetters: mergeById(local.loveLetters, incoming.loveLetters),
      memoryCapsules: mergeById(local.memoryCapsules, incoming.memoryCapsules),
      bucketList: mergeById(local.bucketList, incoming.bucketList),
      wellnessLogs: mergeWellnessLogs(local.wellnessLogs, incoming.wellnessLogs),
      appSettings: updatedAt(incoming.appSettings) >= updatedAt(local.appSettings) ? incoming.appSettings : local.appSettings
    }
  },
  restoreMergedPayload(local: BackupPayload, incoming: BackupPayload) {
    return backupManager.restoreBackupPayload(this.mergePayloads(local, incoming))
  }
}
