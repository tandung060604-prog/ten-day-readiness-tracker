import { describe, it, expect } from 'vitest'
import { readiness } from '../utils/readiness'
import type { DailyLog } from '../types'

describe('Readiness Scoring Engine', () => {
  const sampleLog: DailyLog = {
    dayNumber: 1,
    dateLabel: 'Day 1',
    sleep: {
      bedtime: '23:45',
      wakeTime: '07:45',
      nightHours: 8,
      napMinutes: 30,
      quality: 4,
    },
    meals: [
      {
        id: 'm1',
        day: 1,
        mealType: 'lunch',
        time: '12:30',
        foods: [
          { id: 'f1', name: 'Ức gà', category: 'protein' },
          { id: 'f2', name: 'Cơm', category: 'carb' },
        ],
      },
    ],
    hydrationMl: 2500,
    workout: {
      title: 'Full Body',
      completed: true,
      durationMinutes: 60,
    },
    mobilityCompleted: true,
    kegelCompleted: true,
    breathingMinutes: 5,
    energy: 8,
    mood: 8,
    stress: 3,
    soreness: 2,
    checklist: [
      { id: 'c1', label: 'Item 1', done: true },
      { id: 'c2', label: 'Item 2', done: true },
    ],
  }

  it('calculates a positive readiness score for a complete day log', () => {
    const score = readiness(sampleLog, 2500)
    expect(score).toBeGreaterThan(50)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('handles empty / zero logs without crashing', () => {
    const emptyLog: DailyLog = {
      dayNumber: 2,
      dateLabel: 'Day 2',
      meals: [],
      hydrationMl: 0,
      mobilityCompleted: false,
      kegelCompleted: false,
      breathingMinutes: 0,
      checklist: [],
    }

    const score = readiness(emptyLog, 2500)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(typeof score).toBe('number')
  })

  it('awards full hydration points when target is met or exceeded', () => {
    const logNormal = { ...sampleLog, hydrationMl: 2500 }
    const logExcess = { ...sampleLog, hydrationMl: 3500 }

    const scoreNormal = readiness(logNormal, 2500)
    const scoreExcess = readiness(logExcess, 2500)

    expect(scoreExcess).toBeGreaterThanOrEqual(scoreNormal)
  })
})
