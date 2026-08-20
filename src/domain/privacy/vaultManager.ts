import type { PrivacySettings, VaultConfig } from './types'

const PRIVACY_SETTINGS_KEY = 'little_days_v2_privacy_settings'
const VAULT_CONFIG_KEY = 'little_days_v2_vault_config'

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  hideWellnessClinicOnMap: false,
  requirePinForJournal: false,
  requirePinForClinic: false,
  enablePrivacyBlur: false,
  optInPreciseGps: false
}

// Simple hash for local PIN verification
function hashPin(pin: string): string {
  let hash = 0
  for (let i = 0; i < pin.length; i++) {
    hash = (hash << 5) - hash + pin.charCodeAt(i)
    hash |= 0
  }
  return hash.toString(16)
}

export const vaultManager = {
  loadPrivacySettings(): PrivacySettings {
    try {
      const raw = localStorage.getItem(PRIVACY_SETTINGS_KEY)
      return raw ? { ...DEFAULT_PRIVACY_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_PRIVACY_SETTINGS }
    } catch {
      return { ...DEFAULT_PRIVACY_SETTINGS }
    }
  },

  savePrivacySettings(settings: PrivacySettings): void {
    try {
      localStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(settings))
    } catch { /* ignore */ }
  },

  loadVaultConfig(): VaultConfig {
    try {
      const raw = localStorage.getItem(VAULT_CONFIG_KEY)
      return raw ? JSON.parse(raw) : { hasPin: false }
    } catch {
      return { hasPin: false }
    }
  },

  setPin(pin: string): { success: boolean; error?: string } {
    if (!/^\d{4}$/.test(pin)) {
      return { success: false, error: 'Mã PIN phải bao gồm đúng 4 chữ số!' }
    }

    try {
      const config: VaultConfig = {
        hasPin: true,
        hashedPin: hashPin(pin),
        lastUnlockedAt: new Date().toISOString()
      }
      localStorage.setItem(VAULT_CONFIG_KEY, JSON.stringify(config))
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  },

  verifyPin(pin: string): boolean {
    const config = this.loadVaultConfig()
    if (!config.hasPin || !config.hashedPin) return true
    return config.hashedPin === hashPin(pin)
  },

  clearPin(): void {
    localStorage.removeItem(VAULT_CONFIG_KEY)
  }
}
