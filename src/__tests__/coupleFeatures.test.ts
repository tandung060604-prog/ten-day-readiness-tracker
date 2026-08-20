import { describe, it, expect, beforeEach } from 'vitest'
import {
  getTodayQuestion,
  CURATED_DAILY_QUESTIONS,
  spinDateRoulette,
  isCapsuleUnlocked,
  detectSpecialEvents,
  generateEndlessDailyQuests
} from '../domain/couple/coupleFeatures'
import { coupleStorage } from '../domain/couple/coupleStorage'
import type { MemoryCapsule, LoveLetter } from '../domain/couple/coupleFeatures'

describe('Couple Features & Endless Mode Suite — Phase 10', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('1. Daily Couple Questions & Storage', () => {
    it('contains at least 30 curated meaningful relationship questions', () => {
      expect(CURATED_DAILY_QUESTIONS.length).toBeGreaterThanOrEqual(30)
      for (const q of CURATED_DAILY_QUESTIONS) {
        expect(q.prompt.length).toBeGreaterThan(10)
        expect(q.category).toBeDefined()
      }
    })

    it('retrieves questions deterministically based on day index', () => {
      const q1 = getTodayQuestion(1)
      const q30 = getTodayQuestion(30)
      expect(q1.id).toBe(1)
      expect(q30.id).toBe(30)
    })

    it('saves and loads answered questions in storage', () => {
      coupleStorage.saveAnsweredQuestion({
        questionId: 1,
        answeredAt: '2026-08-20T10:00:00Z',
        user1Answer: 'Nụ cười ấm áp của người ấy',
        isFavorite: true
      })

      const loaded = coupleStorage.loadAnsweredQuestions()
      expect(loaded[1]).toBeDefined()
      expect(loaded[1].user1Answer).toBe('Nụ cười ấm áp của người ấy')
      expect(loaded[1].isFavorite).toBe(true)
    })
  })

  describe('2. Love Letters & Mailbox Persistence', () => {
    it('saves and marks letters as opened', () => {
      const letter: LoveLetter = {
        id: 'letter_1',
        sender: 'Anh',
        recipient: 'Em',
        title: 'Thư gửi ngày nắng',
        content: 'Cảm ơn em vì luôn đồng hành cùng anh.',
        writtenAt: '2026-08-20T10:00:00Z',
        isOpened: false,
        isFavorite: false
      }

      coupleStorage.saveLoveLetter(letter)
      const letters = coupleStorage.loadLoveLetters()
      expect(letters.length).toBe(1)
      expect(letters[0].title).toBe('Thư gửi ngày nắng')
    })
  })

  describe('3. Time-Locked Memory Capsule Unlocking Rules', () => {
    it('unlocks specific_date capsule only on or after target date', () => {
      const capsule: MemoryCapsule = {
        id: 'cap_1',
        title: 'Lời hứa 2027',
        content: 'Chuyến đi xuyên Việt của chúng mình',
        sealedAt: '2026-01-01',
        unlockCondition: {
          type: 'specific_date',
          targetDate: '2026-12-31'
        },
        isOpened: false
      }

      // Past current date
      const beforeCheck = isCapsuleUnlocked(capsule, new Date('2026-06-01'))
      expect(beforeCheck.isUnlocked).toBe(false)
      expect(beforeCheck.reason).toContain('ngày nữa')

      // Reached current date
      const afterCheck = isCapsuleUnlocked(capsule, new Date('2027-01-01'))
      expect(afterCheck.isUnlocked).toBe(true)
    })

    it('unlocks anniversary capsule on exact anniversary date', () => {
      const capsule: MemoryCapsule = {
        id: 'cap_anni',
        title: 'Kỷ niệm 1 năm',
        content: '1 năm trọn vẹn bên nhau',
        sealedAt: '2025-08-20',
        unlockCondition: { type: 'anniversary' },
        isOpened: false
      }

      const anniversaryDate = new Date('2024-08-20')
      const todayMatch = isCapsuleUnlocked(capsule, new Date('2026-08-20'), anniversaryDate)
      expect(todayMatch.isUnlocked).toBe(true)

      const notYet = isCapsuleUnlocked(capsule, new Date('2026-08-19'), anniversaryDate)
      expect(notYet.isUnlocked).toBe(false)
    })
  })

  describe('4. Date Roulette Algorithm', () => {
    it('spins and returns a valid date recommendation', () => {
      const result = spinDateRoulette('romantic', 'indoor')
      expect(result).toBeDefined()
      expect(result.title.length).toBeGreaterThan(0)
      expect(result.category).toBe('romantic')
      expect(result.locationType === 'indoor' || result.locationType === 'any').toBe(true)
    })
  })

  describe('5. Special Event & Holiday Detection', () => {
    it('detects Valentine Day on Feb 14', () => {
      const event = detectSpecialEvents(new Date('2026-02-14'))
      expect(event.isHoliday).toBe(true)
      expect(event.holidayName).toContain('Valentine')
    })

    it('detects Anniversary and calculates elapsed relationship days', () => {
      const event = detectSpecialEvents(
        new Date('2026-08-20'),
        '2024-08-20'
      )
      expect(event.isAnniversary).toBe(true)
      expect(event.anniversaryYears).toBe(2)
      expect(event.daysTogether).toBeGreaterThanOrEqual(730)
    })
  })

  describe('6. Endless Mode Rotating Quests', () => {
    it('generates 3 balanced daily endless quests', () => {
      const quests = generateEndlessDailyQuests('2026-08-20')
      expect(quests.length).toBe(3)
      expect(quests[0].category).toBe('health')
      expect(quests[1].category).toBe('love')
      expect(quests[2].category).toBe('puzzle')
      for (const q of quests) {
        expect(q.rewardHearts).toBeGreaterThanOrEqual(30)
        expect(q.rewardCoins).toBeGreaterThanOrEqual(40)
      }
    })
  })
})
