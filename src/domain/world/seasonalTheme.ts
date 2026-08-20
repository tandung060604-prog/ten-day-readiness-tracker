import type { CoupleProfile } from '../couple/types'
import type { SeasonalTheme } from './types'

export interface SeasonalThemeInfo {
  theme: SeasonalTheme
  title: string
  icon: string
  accentColor: string
}

export function detectSeasonalTheme(profile?: CoupleProfile | null, now = new Date()): SeasonalThemeInfo {
  const month = now.getMonth() + 1 // 1-12
  const date = now.getDate()

  // 1. Check for Anniversary
  if (profile?.relationshipStartDate) {
    const start = new Date(profile.relationshipStartDate)
    if (start.getMonth() + 1 === month && start.getDate() === date) {
      return {
        theme: 'anniversary',
        title: 'Kỷ Niệm Ngày Yêu Nhau! 💖',
        icon: '💍',
        accentColor: '#ff4d6d'
      }
    }
  }

  // 2. Check for Nha Trang Trip Countdown
  if (month === 8 && date >= 17 && date <= 28) {
    return {
      theme: 'trip_countdown',
      title: 'Hành Trình Khởi Hành Nha Trang 27/08 🏖️',
      icon: '✈️',
      accentColor: '#00bbf9'
    }
  }

  // 3. Valentine (14/02)
  if (month === 2 && date === 14) {
    return {
      theme: 'valentine',
      title: 'Lễ Tình Nhân Valentine 🌹',
      icon: '🍫',
      accentColor: '#e63946'
    }
  }

  // 4. Christmas (24-25/12)
  if (month === 12 && (date === 24 || date === 25)) {
    return {
      theme: 'christmas',
      title: 'Giáng Sinh Ấm Áp 🎄',
      icon: '❄️',
      accentColor: '#2b9348'
    }
  }

  // 5. Default Living Town
  return {
    theme: 'default',
    title: 'Thị Trấn Little Days Bình Yên 🌸',
    icon: '🏡',
    accentColor: '#ff8da1'
  }
}
