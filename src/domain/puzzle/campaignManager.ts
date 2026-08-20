import { CANONICAL_PUZZLE_LEVELS, getLevelsByChapter } from './levels'
import type { PuzzleLevelProgress } from './types'

export interface ChapterSummary {
  chapter: 1 | 2 | 3
  title: string
  subtitle: string
  icon: string
  totalLevels: number
  completedLevels: number
  earnedStars: number
  maxStars: number
  isUnlocked: boolean
}

export function getChapterSummary(
  chapter: 1 | 2 | 3,
  progressMap: Record<number, PuzzleLevelProgress>
): ChapterSummary {
  const levels = getLevelsByChapter(chapter)
  const totalLevels = levels.length
  let completedLevels = 0
  let earnedStars = 0

  for (const l of levels) {
    const p = progressMap[l.levelNumber]
    if (p?.completed) {
      completedLevels++
      earnedStars += p.stars
    }
  }

  // Chapter 1 is always unlocked
  // Chapter 2 requires Level 10 completed
  // Chapter 3 requires Level 20 completed
  let isUnlocked = true
  if (chapter === 2) {
    isUnlocked = Boolean(progressMap[10]?.completed)
  } else if (chapter === 3) {
    isUnlocked = Boolean(progressMap[20]?.completed)
  }

  const titles: Record<1 | 2 | 3, { title: string; subtitle: string; icon: string }> = {
    1: {
      title: 'Chương 1: Ngôi Nhà Nhỏ',
      subtitle: 'Xây dựng tổ ấm và rèn luyện thói quen lành mạnh',
      icon: '🏡'
    },
    2: {
      title: 'Chương 2: Xây Dựng Thị Trấn',
      subtitle: 'Mở rộng thị trấn Little Days và nâng cấp các công trình',
      icon: '🏘️'
    },
    3: {
      title: 'Chương 3: Chuyến Đi Nha Trang',
      subtitle: 'Hành trình biển xanh cát trắng và đại tiệc pháo hoa hoàng hôn',
      icon: '🏖️'
    }
  }

  return {
    chapter,
    title: titles[chapter].title,
    subtitle: titles[chapter].subtitle,
    icon: titles[chapter].icon,
    totalLevels,
    completedLevels,
    earnedStars,
    maxStars: totalLevels * 3,
    isUnlocked
  }
}

export function getOverallCampaignProgress(
  progressMap: Record<number, PuzzleLevelProgress>
): {
  totalEarnedStars: number
  maxPossibleStars: number
  totalCompletedLevels: number
  isCampaignComplete: boolean
  completionPercentage: number
} {
  const maxPossibleStars = CANONICAL_PUZZLE_LEVELS.length * 3
  let totalEarnedStars = 0
  let totalCompletedLevels = 0

  for (const l of CANONICAL_PUZZLE_LEVELS) {
    const p = progressMap[l.levelNumber]
    if (p?.completed) {
      totalCompletedLevels++
      totalEarnedStars += p.stars
    }
  }

  const isCampaignComplete = Boolean(progressMap[30]?.completed)
  const completionPercentage = Math.round((totalCompletedLevels / CANONICAL_PUZZLE_LEVELS.length) * 100)

  return {
    totalEarnedStars,
    maxPossibleStars,
    totalCompletedLevels,
    isCampaignComplete,
    completionPercentage
  }
}
