import { describe, it, expect, beforeEach } from 'vitest'
import { DEMO_COUPLE_PROFILE } from '../domain/couple/demoProfile'
import {
  getRelationshipDays,
  getNextImportantDate,
  getCoupleDisplayName,
  getPlayerByCharacter,
  getMilestoneCelebration
} from '../domain/couple/selectors'
import { coupleProfileRepository } from '../storage/coupleProfileRepository'
import type { CoupleProfile } from '../domain/couple/types'

describe('CoupleProfile Selectors', () => {
  const mockProfile: CoupleProfile = {
    ...DEMO_COUPLE_PROFILE,
    relationshipStartDate: '2026-06-11',
    importantDates: [
      {
        id: 'anniv',
        title: 'Kỷ Niệm',
        date: '2026-06-11',
        category: 'anniversary',
        countdown: false
      },
      {
        id: 'trip',
        title: 'Chuyến Đi Nha Trang',
        date: '2026-08-27',
        category: 'trip',
        countdown: true
      }
    ]
  }

  it('calculates relationship days correctly for a known date', () => {
    // 2026-06-21 is 10 days after 2026-06-11
    const testNow = new Date('2026-06-21T12:00:00')
    const days = getRelationshipDays(mockProfile, testNow)
    expect(days).toBe(10)
  })

  it('returns 0 when relationshipStartDate is today or in future', () => {
    const testNow = new Date('2026-06-11T00:00:00')
    expect(getRelationshipDays(mockProfile, testNow)).toBe(0)

    const beforeNow = new Date('2026-01-01T00:00:00')
    expect(getRelationshipDays(mockProfile, beforeNow)).toBe(0)
  })

  it('gracefully handles null or invalid profile', () => {
    expect(getRelationshipDays(null)).toBe(0)
    expect(getRelationshipDays(undefined)).toBe(0)
    expect(getRelationshipDays({ ...mockProfile, relationshipStartDate: 'invalid-date' })).toBe(0)
  })

  it('formats couple display name nicely', () => {
    expect(getCoupleDisplayName(mockProfile)).toBe('Haru & Em Yêu')
    expect(getCoupleDisplayName(null)).toBe('Chúng Mình')
  })

  it('finds player by mascot character', () => {
    const chiikawaPlayer = getPlayerByCharacter(mockProfile, 'chiikawa')
    expect(chiikawaPlayer.nickname).toBe('Haru')

    const usagiPlayer = getPlayerByCharacter(mockProfile, 'usagi')
    expect(usagiPlayer.nickname).toBe('Em Yêu')
  })

  it('finds the next upcoming important date countdown', () => {
    // On 2026-08-20, the Nha Trang trip on 2026-08-27 is 7 days away
    const testNow = new Date('2026-08-20T08:00:00')
    const nextDate = getNextImportantDate(mockProfile, testNow)
    expect(nextDate).not.toBeNull()
    expect(nextDate?.item.id).toBe('trip')
    expect(nextDate?.daysRemaining).toBe(7)
  })

  it('detects milestone celebrations accurately', () => {
    expect(getMilestoneCelebration(100)).toEqual({
      milestone: 100,
      title: 'Kỷ Niệm 100 Ngày Yêu! 🌸',
      subtitle: 'Cột mốc 100 ngày đầu tiên tuyệt vời'
    })
    expect(getMilestoneCelebration(365)).toEqual({
      milestone: 365,
      title: 'Kỷ Niệm 1 Năm Yêu Nhau! 🎂',
      subtitle: '365 ngày trọn vẹn yêu thương'
    })
    expect(getMilestoneCelebration(99)).toBeNull()
  })
})

describe('CoupleProfile Repository Persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads demo profile when localStorage is empty', () => {
    const profile = coupleProfileRepository.loadProfile()
    expect(profile).toBeDefined()
    expect(profile.player1.nickname).toBe('Haru')
    expect(coupleProfileRepository.hasCustomProfile()).toBe(false)
  })

  it('saves and reloads custom couple profile', () => {
    const custom: CoupleProfile = {
      ...DEMO_COUPLE_PROFILE,
      id: 'custom-123',
      player1: { ...DEMO_COUPLE_PROFILE.player1, nickname: 'Minh' },
      player2: { ...DEMO_COUPLE_PROFILE.player2, nickname: 'Lan' },
      relationshipStartDate: '2025-01-01'
    }

    coupleProfileRepository.saveProfile(custom)
    expect(coupleProfileRepository.hasCustomProfile()).toBe(true)

    const loaded = coupleProfileRepository.loadProfile()
    expect(loaded.player1.nickname).toBe('Minh')
    expect(loaded.player2.nickname).toBe('Lan')
    expect(loaded.relationshipStartDate).toBe('2025-01-01')
  })

  it('updates player data and writes to storage', () => {
    const initial = coupleProfileRepository.loadProfile()
    const updated = coupleProfileRepository.updatePlayer(initial, 'player1', { nickname: 'Alex' })
    expect(updated.player1.nickname).toBe('Alex')

    const reloaded = coupleProfileRepository.loadProfile()
    expect(reloaded.player1.nickname).toBe('Alex')
  })

  it('recovers cleanly from corrupt JSON in storage', () => {
    localStorage.setItem('little_days_couple_profile_v1', '{corrupt json...')
    const fallback = coupleProfileRepository.loadProfile()
    expect(fallback.player1.nickname).toBe('Haru')
  })
})
