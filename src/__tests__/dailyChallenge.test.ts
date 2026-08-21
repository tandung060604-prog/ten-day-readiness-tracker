import { beforeEach, describe, expect, it } from 'vitest'
import { createDailyChallenges, getDailyChallengeProgress } from '../domain/challenges/dailyChallenge'
import { createDefaultGameState } from '../domain/game/defaultState'
import { gameStateRepository } from '../storage/gameStateRepository'
import type { DailyLog } from '../types'

const log: DailyLog = {
  dayNumber: 1, dateLabel: 'Day 1', hydrationMl: 2000,
  workout: { title: 'Test', completed: true }, sleep: { bedtime: '23:00', wakeTime: '07:00', nightHours: 8, quality: 4 },
  journal: 'Một ngày thật tốt', meals: [], mobilityCompleted: false, kegelCompleted: false, breathingMinutes: 0, checklist: []
}

describe('daily wellness challenges', () => {
  beforeEach(() => localStorage.clear())

  it('derives progress from the real wellness log', () => {
    const challenges = createDailyChallenges('2026-08-21', 2000)
    const progress = challenges.map(challenge => getDailyChallengeProgress(challenge, log))
    expect(progress.every(challenge => challenge.completed)).toBe(true)
    expect(progress[0].current).toBe(2000)
  })

  it('claims a completed challenge once and persists the reward ledger', () => {
    const state = createDefaultGameState()
    const challenge = createDailyChallenges('2026-08-21', 2000)[0]
    const initialCoins = state.currencies.coins
    const first = gameStateRepository.claimDailyChallenge(state, '2026-08-21', challenge, true)
    expect(first.success).toBe(true)
    expect(first.nextState.currencies.coins).toBe(initialCoins + (challenge.reward.coins ?? 0))
    expect(first.nextState.dailyChallengeClaims?.['2026-08-21']).toContain('hydration')

    const second = gameStateRepository.claimDailyChallenge(first.nextState, '2026-08-21', challenge, true)
    expect(second.success).toBe(false)
    expect(second.nextState.currencies.coins).toBe(first.nextState.currencies.coins)
  })
})
