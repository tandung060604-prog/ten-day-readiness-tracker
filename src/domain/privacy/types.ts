export interface PrivacySettings {
  hideWellnessClinicOnMap: boolean
  requirePinForJournal: boolean
  requirePinForClinic: boolean
  enablePrivacyBlur: boolean
  optInPreciseGps: boolean
}

export interface VaultConfig {
  hasPin: boolean
  hashedPin?: string
  lastUnlockedAt?: string
}

export interface BackupPayload {
  schemaVersion: number
  exportedAt: string
  appVersion: string
  coupleProfile: any
  gameState: any
  puzzleProgress: any
  answeredQuestions: any
  loveLetters: any
  memoryCapsules: any
  bucketList: any
  privacySettings: PrivacySettings
}

export interface EncryptedBackupPayload {
  version: number
  isEncrypted: true
  exportedAt: string
  saltHex: string
  ivHex: string
  ciphertextHex: string
}

export interface MigrationResult {
  migrated: boolean
  fromVersion: number
  toVersion: number
  snapshotSaved: boolean
  error?: string
}
