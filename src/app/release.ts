export const APP_RELEASE = {
  version: '0.2.0',
  kind: 'major' as const,
  title: 'Little Days đã cập nhật',
  body: 'Bản cập nhật lớn: Hôm Nay, Phiêu Lưu, Endless, offline và sửa lỗi PIN đã sẵn sàng.'
}

// ponytail: local-first release notices; add VAPID/backend push only when closed-app delivery is required.
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
