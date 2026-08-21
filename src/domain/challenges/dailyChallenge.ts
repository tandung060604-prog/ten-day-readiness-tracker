import type { DailyLog } from '../../types'
import type { QuestReward } from '../game/types'

export type DailyChallengeMetric = 'hydration' | 'workout' | 'sleep' | 'journal'

export interface DailyChallengeDefinition {
  id: string
  dateKey: string
  title: string
  description: string
  metric: DailyChallengeMetric
  target: number
  reward: QuestReward
}

export interface DailyChallengeProgress extends DailyChallengeDefinition {
  current: number
  completed: boolean
  claimed: boolean
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function createDailyChallenges(dateKey: string, waterTargetMl: number): DailyChallengeDefinition[] {
  const safeWaterTarget = Math.max(500, Math.round(waterTargetMl))
  return [
    {
      id: 'hydration', dateKey, title: 'Suối Nước Nhỏ',
      description: `Uống đủ ${safeWaterTarget.toLocaleString('vi-VN')}ml nước`, metric: 'hydration', target: safeWaterTarget,
      reward: { hearts: 20, coins: 30, xp: 25, bondXp: 10 }
    },
    {
      id: 'movement', dateKey, title: 'Bước Chân Đồng Đội',
      description: 'Hoàn thành buổi tập hoặc recovery hôm nay', metric: 'workout', target: 1,
      reward: { hearts: 25, coins: 40, xp: 35, bondXp: 15 }
    },
    {
      id: 'connection', dateKey, title: 'Một Dòng Cho Nhau',
      description: 'Viết một dòng nhật ký gửi người thương', metric: 'journal', target: 1,
      reward: { hearts: 35, coins: 45, xp: 40, bondXp: 25 }
    },
    {
      id: 'rest', dateKey, title: 'Đêm Ngủ Dịu Êm',
      description: 'Ghi nhận ít nhất 8 giờ ngủ', metric: 'sleep', target: 8,
      reward: { hearts: 30, coins: 35, xp: 30, bondXp: 15 }
    }
  ]
}

export function getDailyChallengeProgress(
  challenge: DailyChallengeDefinition,
  log: DailyLog | undefined,
  claimedIds: string[] = []
): DailyChallengeProgress {
  const current = !log ? 0 : challenge.metric === 'hydration'
    ? log.hydrationMl
    : challenge.metric === 'workout'
      ? (log.workout?.completed ? 1 : 0)
      : challenge.metric === 'sleep'
        ? Math.min(challenge.target, log.sleep?.nightHours ?? 0)
        : (log.journal?.trim() ? 1 : 0)
  return { ...challenge, current, completed: current >= challenge.target, claimed: claimedIds.includes(challenge.id) }
}
