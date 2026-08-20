import { DEMO_COUPLE_PROFILE } from '../domain/couple/demoProfile'
import type { CoupleProfile, PersonProfile, ImportantDate } from '../domain/couple/types'

const STORAGE_KEY = 'little_days_couple_profile_v1'

export const coupleProfileRepository = {
  loadProfile(): CoupleProfile {
    if (typeof window === 'undefined') return DEMO_COUPLE_PROFILE
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return DEMO_COUPLE_PROFILE
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && parsed.player1 && parsed.player2) {
        return {
          ...DEMO_COUPLE_PROFILE,
          ...parsed,
          player1: { ...DEMO_COUPLE_PROFILE.player1, ...parsed.player1 },
          player2: { ...DEMO_COUPLE_PROFILE.player2, ...parsed.player2 },
          privacy: { ...DEMO_COUPLE_PROFILE.privacy, ...(parsed.privacy || {}) }
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved couple profile, falling back to demo:', e)
    }
    return DEMO_COUPLE_PROFILE
  },

  saveProfile(profile: CoupleProfile): void {
    if (typeof window === 'undefined') return
    try {
      const payload: CoupleProfile = {
        ...profile,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (e) {
      console.error('Failed to save couple profile to localStorage:', e)
    }
  },

  hasCustomProfile(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(STORAGE_KEY)
  },

  resetToDemo(): CoupleProfile {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    return DEMO_COUPLE_PROFILE
  },

  updatePlayer(
    current: CoupleProfile,
    playerKey: 'player1' | 'player2',
    data: Partial<PersonProfile>
  ): CoupleProfile {
    const updated: CoupleProfile = {
      ...current,
      [playerKey]: {
        ...current[playerKey],
        ...data
      }
    }
    this.saveProfile(updated)
    return updated
  },

  addImportantDate(current: CoupleProfile, newDate: ImportantDate): CoupleProfile {
    const updated: CoupleProfile = {
      ...current,
      importantDates: [...current.importantDates.filter(d => d.id !== newDate.id), newDate]
    }
    this.saveProfile(updated)
    return updated
  },

  removeImportantDate(current: CoupleProfile, id: string): CoupleProfile {
    const updated: CoupleProfile = {
      ...current,
      importantDates: current.importantDates.filter(d => d.id !== id)
    }
    this.saveProfile(updated)
    return updated
  }
}
