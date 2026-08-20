import type { BondPerk, LoveLinkState } from './types'

export const BOND_PERK_DEFINITIONS: BondPerk[] = [
  {
    level: 1,
    title: 'Đôi Bạn Mới Gặp',
    interaction: 'wave',
    icon: '👋',
    description: 'Vẫy tay chào nhau mỗi khi bước vào thị trấn Little Days.',
    unlocked: true
  },
  {
    level: 5,
    title: 'Bạn Đồng Hành Ấm Áp',
    interaction: 'highFive',
    icon: '✋✨',
    description: 'Đập tay ăn mừng khi hoàn thành nhiệm vụ (+5% Xu thưởng).',
    unlocked: false
  },
  {
    level: 10,
    title: 'Cặp Đôi Ngọt Ngào',
    interaction: 'sitTogether',
    icon: '🛋️☕',
    description: 'Ngồi tựa vào nhau thưởng thức tách trà chiều trong phòng khách.',
    unlocked: false
  },
  {
    level: 20,
    title: 'Gắn Kết Bất Khả Phân',
    interaction: 'holdHands',
    icon: '🤝💖',
    description: 'Nắm tay dạo bước khắp bản đồ thị trấn (+10% Tim tình yêu).',
    unlocked: false
  },
  {
    level: 30,
    title: 'Tâm Giao Tri Kỷ',
    interaction: 'warmHug',
    icon: '🤗🌸',
    description: 'Vòng tay ôm ấm áp và hào quang hoàng kim bao bọc.',
    unlocked: false
  }
]

/**
 * Calculates current Bond Level and progress percentage from total Bond XP.
 */
export function calculateBondProgress(totalBondXp: number): {
  level: number
  currentXp: number
  xpToNextLevel: number
  progressPercentage: number
} {
  const baseLevelXp = 100
  let level = 1
  let remainingXp = Math.max(0, totalBondXp)

  while (true) {
    const costForNext = Math.floor(baseLevelXp * Math.pow(1.15, level - 1))
    if (remainingXp < costForNext || level >= 50) {
      const progressPercentage = Math.min(100, Math.round((remainingXp / costForNext) * 100))
      return {
        level,
        currentXp: remainingXp,
        xpToNextLevel: costForNext,
        progressPercentage
      }
    }
    remainingXp -= costForNext
    level++
  }
}

/**
 * Returns all bond perks with their unlocked status evaluated against current Bond Level.
 */
export function getUnlockedBondPerks(currentBondLevel: number): BondPerk[] {
  return BOND_PERK_DEFINITIONS.map(perk => ({
    ...perk,
    unlocked: currentBondLevel >= perk.level
  }))
}

/**
 * Adds charge to the Love Link Meter and returns updated state.
 */
export function chargeLoveLink(
  currentMeter: LoveLinkState,
  amount: number
): LoveLinkState {
  const nextCharge = Math.min(currentMeter.maxCharge, currentMeter.currentCharge + Math.max(0, amount))
  return {
    ...currentMeter,
    currentCharge: nextCharge,
    isMiracleReady: nextCharge >= currentMeter.maxCharge
  }
}

/**
 * Discharges the Love Link Meter when triggering Little Days Miracle.
 */
export function triggerLittleDaysMiracle(currentMeter: LoveLinkState): {
  nextMeter: LoveLinkState
  rewards: { hearts: number; coins: number; xp: number }
} {
  return {
    nextMeter: {
      ...currentMeter,
      currentCharge: 0,
      isMiracleReady: false,
      lastMiracleTriggeredAt: new Date().toISOString()
    },
    rewards: {
      hearts: 100,
      coins: 100,
      xp: 150
    }
  }
}
