import { beforeEach, describe, expect, it } from 'vitest'
import { APP_RELEASE, consumeReleaseNotice } from '../app/release'

describe('release notifications', () => {
  beforeEach(() => localStorage.clear())

  it('does not announce a fresh install', () => {
    expect(consumeReleaseNotice()).toBe(false)
  })

  it('announces an existing app on the first release-aware launch', () => {
    localStorage.setItem('little_days_game_state_v1', '{}')
    expect(consumeReleaseNotice()).toBe(true)
    expect(consumeReleaseNotice()).toBe(false)
  })

  it('announces a later release once', () => {
    localStorage.setItem('little_days_seen_release_v1', '0.1.0')
    expect(consumeReleaseNotice()).toBe(true)
    expect(localStorage.getItem('little_days_seen_release_v1')).toBe(APP_RELEASE.version)
    expect(consumeReleaseNotice()).toBe(false)
  })
})
