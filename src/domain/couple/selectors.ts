import type { CoupleProfile, ImportantDate, MascotCharacter, PersonProfile } from './types'

/**
 * Calculates total elapsed days since the relationship start date.
 */
export function getRelationshipDays(profile?: CoupleProfile | null, now = new Date()): number {
  if (!profile || !profile.relationshipStartDate) return 0
  try {
    const start = new Date(`${profile.relationshipStartDate}T00:00:00`)
    if (isNaN(start.getTime())) return 0
    const diffMs = now.getTime() - start.getTime()
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
  } catch {
    return 0
  }
}

/**
 * Finds the nearest upcoming important date (e.g. trip countdown or anniversary).
 */
export function getNextImportantDate(
  profile?: CoupleProfile | null,
  now = new Date()
): { item: ImportantDate; daysRemaining: number } | null {
  if (!profile || !Array.isArray(profile.importantDates) || profile.importantDates.length === 0) {
    return null
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  let closest: { item: ImportantDate; daysRemaining: number } | null = null

  for (const item of profile.importantDates) {
    try {
      const targetDate = new Date(`${item.date}T00:00:00`).getTime()
      if (isNaN(targetDate)) continue

      const diffDays = Math.ceil((targetDate - todayStart) / (1000 * 60 * 60 * 24))
      if (diffDays >= 0) {
        if (!closest || diffDays < closest.daysRemaining) {
          closest = { item, daysRemaining: diffDays }
        }
      }
    } catch {
      // ignore item
    }
  }

  return closest
}

/**
 * Returns formatted couple display name, e.g. "Haru & Mai Trang".
 */
export function getCoupleDisplayName(profile?: CoupleProfile | null): string {
  if (!profile) return 'Chúng Mình'
  const p1 = profile.player1?.nickname || profile.player1?.displayName || 'Bạn'
  const p2 = profile.player2?.nickname || profile.player2?.displayName || 'Người Yêu'
  return `${p1} & ${p2}`
}

/**
 * Finds player profile mapped to the selected mascot character (Chiikawa or Usagi).
 */
export function getPlayerByCharacter(
  profile?: CoupleProfile | null,
  character: MascotCharacter = 'chiikawa'
): PersonProfile {
  if (!profile) {
    return {
      id: 'default',
      displayName: character === 'chiikawa' ? 'Haru' : 'Mai Trang',
      nickname: character === 'chiikawa' ? 'Haru' : 'Em Yêu',
      avatarCharacter: character
    }
  }

  if (profile.player1?.avatarCharacter === character) {
    return profile.player1
  }
  if (profile.player2?.avatarCharacter === character) {
    return profile.player2
  }

  return character === 'chiikawa' ? profile.player1 : profile.player2
}

/**
 * Milestone detection for special relationship anniversaries.
 */
export function getMilestoneCelebration(days: number): { milestone: number; title: string; subtitle: string } | null {
  if (days <= 0) return null

  const milestones = [
    { milestone: 1000, title: 'Kỷ Niệm 1000 Ngày Yêu! 💎', subtitle: 'Tình yêu bền chặt như kim cương' },
    { milestone: 730, title: 'Kỷ Niệm 2 Năm Yêu Nhau! 🥂', subtitle: 'Hai năm ngập tràn kỷ niệm hạnh phúc' },
    { milestone: 500, title: 'Kỷ Niệm 500 Ngày Yêu! 🌟', subtitle: 'Nửa nghìn ngày bên nhau thật ý nghĩa' },
    { milestone: 365, title: 'Kỷ Niệm 1 Năm Yêu Nhau! 🎂', subtitle: '365 ngày trọn vẹn yêu thương' },
    { milestone: 200, title: 'Kỷ Niệm 200 Ngày Yêu! 💖', subtitle: 'Hai trăm ngày đồng hành ngọt ngào' },
    { milestone: 100, title: 'Kỷ Niệm 100 Ngày Yêu! 🌸', subtitle: 'Cột mốc 100 ngày đầu tiên tuyệt vời' },
    { milestone: 50, title: 'Kỷ Niệm 50 Ngày Yêu! 🌷', subtitle: 'Năm mươi ngày bên nhau đong đầy nụ cười' }
  ]

  for (const m of milestones) {
    if (days === m.milestone) return m
  }

  return null
}

/**
 * Returns the name of the partner opposite to the given character.
 */
export function getPartnerName(
  profile?: CoupleProfile | null,
  character: MascotCharacter = 'chiikawa'
): string {
  const partnerRole = character === 'chiikawa' ? 'usagi' : 'chiikawa'
  const partner = getPlayerByCharacter(profile, partnerRole)
  return partner.nickname || partner.displayName || 'Người Yêu'
}

/**
 * Calculates progress towards the next major relationship milestone.
 */
export function getMilestoneProgress(
  profile?: CoupleProfile | null,
  now = new Date()
): { targetDays: number; daysRemaining: number; progressPercentage: number } {
  const days = getRelationshipDays(profile, now)
  const milestoneGoals = [50, 100, 200, 365, 500, 730, 1000, 1500, 2000]
  
  let targetDays = 100
  let prevGoal = 0

  for (const goal of milestoneGoals) {
    if (days < goal) {
      targetDays = goal
      break
    }
    prevGoal = goal
    targetDays = goal + 365
  }

  const daysRemaining = Math.max(0, targetDays - days)
  const range = targetDays - prevGoal
  const progressInRange = Math.max(0, days - prevGoal)
  const progressPercentage = Math.min(100, Math.round((progressInRange / Math.max(1, range)) * 100))

  return {
    targetDays,
    daysRemaining,
    progressPercentage
  }
}
