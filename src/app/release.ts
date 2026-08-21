type ReleaseKind = 'major' | 'bugfix'

export const APP_RELEASE: { version: string; kind: ReleaseKind; title: string; body: string } = {
  version: '0.2.1',
  kind: 'bugfix',
  title: 'Little Days đã sửa giao diện',
  body: 'Photobooth chụp trước - chọn khung sau, và màn Phiêu lưu đã vừa khít điện thoại.'
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
