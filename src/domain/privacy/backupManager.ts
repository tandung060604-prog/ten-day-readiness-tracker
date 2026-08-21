import type { BackupPayload, EncryptedBackupPayload } from './types'

const PRE_RESTORE_SNAPSHOT_KEY = 'little_days_pre_restore_snapshot'

// Helper: Convert ArrayBuffer to Hex String
function buf2hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Helper: Convert Hex String to Uint8Array
function hex2buf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes
}

export const backupManager = {
  generateBackupPayload(): BackupPayload {
    const getStored = (key: string) => {
      try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    }

    const getStoredAny = (keys: string[]) => keys.map(getStored).find(value => value !== null) ?? null

    return {
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      appVersion: '2.0.0',
      coupleProfile: getStoredAny(['little_days_couple_profile_v1', 'little_days_couple_profile_v2', 'readiness_couple_profile']),
      gameState: getStoredAny(['little_days_game_state_v1', 'little_days_gamestate', 'little_days_v2_gamestate']),
      puzzleProgress: getStoredAny(['little_days_puzzle_progress_v1', 'little_days_v2_puzzle_progress']),
      answeredQuestions: getStored('little_days_v2_answered_questions'),
      loveLetters: getStored('little_days_v2_love_letters'),
      memoryCapsules: getStored('little_days_v2_memory_capsules'),
      bucketList: getStored('little_days_v2_bucket_list'),
      wellnessLogs: getStored('ten-day-readiness-v1'),
      appSettings: getStored('ten-day-readiness-settings-v1'),
      privacySettings: getStored('little_days_v2_privacy_settings') || {
        hideWellnessClinicOnMap: false,
        requirePinForJournal: false,
        requirePinForClinic: false,
        enablePrivacyBlur: false,
        optInPreciseGps: false
      }
    }
  },

  validateBackupPayload(payload: any): { isValid: boolean; error?: string; summary?: string } {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, error: 'Dữ liệu file sao lưu không hợp lệ!' }
    }

    if (payload.isEncrypted) {
      if (!payload.saltHex || !payload.ivHex || !payload.ciphertextHex) {
        return { isValid: false, error: 'Dữ liệu sao lưu mã hóa bị thiếu thông số kỹ thuật!' }
      }
      return { isValid: true, summary: 'File sao lưu mã hóa AES-GCM 256-bit' }
    }

    if (!payload.schemaVersion || payload.schemaVersion < 1) {
      return { isValid: false, error: 'Phiên bản schema sao lưu không được hỗ trợ!' }
    }

    const itemsCount = [
      payload.coupleProfile ? 'Hồ sơ đôi' : null,
      payload.gameState ? 'Tiến trình thị trấn' : null,
      payload.puzzleProgress ? 'Cấp độ giải đố' : null,
      payload.loveLetters?.length ? `${payload.loveLetters.length} Thư tình` : null,
      payload.bucketList?.length ? `${payload.bucketList.length} Ước nguyện` : null
    ].filter(Boolean)

    return {
      isValid: true,
      summary: `Bản sao lưu Schema V${payload.schemaVersion} (${itemsCount.join(', ') || 'Dữ liệu cơ bản'})`
    }
  },

  restoreBackupPayload(payload: BackupPayload): { success: boolean; error?: string } {
    const validation = this.validateBackupPayload(payload)
    if (!validation.isValid) {
      return { success: false, error: validation.error }
    }

    try {
      // 1. Create safety snapshot before restore
      const safetySnapshot: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k) safetySnapshot[k] = localStorage.getItem(k) || ''
      }
      localStorage.setItem(PRE_RESTORE_SNAPSHOT_KEY, JSON.stringify(safetySnapshot))

      // 2. Restore sections cleanly
      const setStoredKeys = (keys: string[], value: unknown) => keys.forEach(key => localStorage.setItem(key, JSON.stringify(value)))
      if (payload.coupleProfile) {
        setStoredKeys(['little_days_couple_profile_v1', 'little_days_couple_profile_v2'], payload.coupleProfile)
      }
      if (payload.gameState) {
        setStoredKeys(['little_days_game_state_v1', 'little_days_gamestate', 'little_days_v2_gamestate'], payload.gameState)
      }
      if (payload.puzzleProgress) {
        setStoredKeys(['little_days_puzzle_progress_v1', 'little_days_v2_puzzle_progress'], payload.puzzleProgress)
      }
      if (payload.answeredQuestions) {
        localStorage.setItem('little_days_v2_answered_questions', JSON.stringify(payload.answeredQuestions))
      }
      if (payload.loveLetters) {
        localStorage.setItem('little_days_v2_love_letters', JSON.stringify(payload.loveLetters))
      }
      if (payload.memoryCapsules) {
        localStorage.setItem('little_days_v2_memory_capsules', JSON.stringify(payload.memoryCapsules))
      }
      if (payload.bucketList) {
        localStorage.setItem('little_days_v2_bucket_list', JSON.stringify(payload.bucketList))
      }
      if (payload.wellnessLogs) {
        localStorage.setItem('ten-day-readiness-v1', JSON.stringify(payload.wellnessLogs))
      }
      if (payload.appSettings) {
        localStorage.setItem('ten-day-readiness-settings-v1', JSON.stringify(payload.appSettings))
      }
      if (payload.privacySettings) {
        localStorage.setItem('little_days_v2_privacy_settings', JSON.stringify(payload.privacySettings))
      }

      return { success: true }
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi khi ghi đè dữ liệu khôi phục!' }
    }
  },

  // ─── WEB CRYPTO AES-GCM ENCRYPT / DECRYPT ───
  async encryptBackup(payload: BackupPayload, passphrase: string): Promise<EncryptedBackupPayload> {
    if (!passphrase || passphrase.length < 4) {
      throw new Error('Mật khẩu mã hóa phải có ít nhất 4 ký tự!')
    }

    const enc = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Derive key using PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as unknown as BufferSource,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )

    const jsonString = JSON.stringify(payload)
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      enc.encode(jsonString)
    )

    return {
      version: 2,
      isEncrypted: true,
      exportedAt: new Date().toISOString(),
      saltHex: buf2hex(salt.buffer),
      ivHex: buf2hex(iv.buffer),
      ciphertextHex: buf2hex(ciphertext)
    }
  },

  async decryptBackup(encrypted: EncryptedBackupPayload, passphrase: string): Promise<BackupPayload> {
    const enc = new TextEncoder()
    const dec = new TextDecoder()

    const salt = hex2buf(encrypted.saltHex)
    const iv = hex2buf(encrypted.ivHex)
    const ciphertext = hex2buf(encrypted.ciphertextHex)

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as unknown as BufferSource,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )

    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv as unknown as BufferSource },
        key,
        ciphertext as unknown as BufferSource
      )
      return JSON.parse(dec.decode(decrypted))
    } catch {
      throw new Error('Mật khẩu giải mã không chính xác hoặc file bị hỏng!')
    }
  }
}
