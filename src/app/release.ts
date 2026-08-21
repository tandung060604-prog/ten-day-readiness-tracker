type ReleaseKind = 'major' | 'bugfix'

export const APP_RELEASE: { version: string; kind: ReleaseKind; title: string; body: string } = {
  version: '0.3.0',
  kind: 'major',
  title: 'Little Days đã có thông báo cập nhật',
  body: 'Bật thông báo một lần để nhận tin ngay khi có bản mới.'
}

// ponytail: only push subscriptions are stored remotely; profile and wellness data stay local-first.
const RELEASE_SEEN_KEY = 'little_days_seen_release_v1'
const APP_DATA_KEYS = [
  'little_days_couple_profile_v1',
  'little_days_game_state_v1',
  'ten-day-readiness-v1',
  'ten-day-readiness-settings-v1'
]

export function consumeReleaseNotice(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const previous = localStorage.getItem(RELEASE_SEEN_KEY)
    const hasExistingData = APP_DATA_KEYS.some(key => localStorage.getItem(key) !== null)
    localStorage.setItem(RELEASE_SEEN_KEY, APP_RELEASE.version)
    return previous === null ? hasExistingData : previous !== APP_RELEASE.version
  } catch {
    return false
  }
}
