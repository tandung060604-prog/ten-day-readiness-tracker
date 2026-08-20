import type { AtmosphereConfig, TimeOfDayPeriod } from './types'

export function getTimeOfDayPeriod(date = new Date()): TimeOfDayPeriod {
  const hour = date.getHours()

  if (hour >= 5 && hour < 11) {
    return 'morning'
  }
  if (hour >= 11 && hour < 17) {
    return 'afternoon'
  }
  if (hour >= 17 && hour < 19) {
    return 'sunset'
  }
  return 'night'
}

export function getAtmosphereConfig(period: TimeOfDayPeriod): AtmosphereConfig {
  switch (period) {
    case 'morning':
      return {
        period: 'morning',
        label: 'Buổi Sáng Tươi Mới',
        skyGradient: 'linear-gradient(180deg, #ffecd2 0%, #fcb69f 45%, #a1c4fd 100%)',
        ambientFilter: 'saturate(1.05) brightness(1.03)',
        sunlightGlow: 'rgba(255, 236, 179, 0.4)',
        windowGlowIntensity: 0.1,
        riverShimmerOpacity: 0.8,
        particles: 'sakura'
      }

    case 'afternoon':
      return {
        period: 'afternoon',
        label: 'Buổi Trưa Rực Rỡ',
        skyGradient: 'linear-gradient(180deg, #89f7fe 0%, #66a6ff 60%, #e0c3fc 100%)',
        ambientFilter: 'saturate(1.1) brightness(1.05)',
        sunlightGlow: 'rgba(255, 255, 255, 0.5)',
        windowGlowIntensity: 0.0,
        riverShimmerOpacity: 1.0,
        particles: 'sparkles'
      }

    case 'sunset':
      return {
        period: 'sunset',
        label: 'Hoàng Hôn Lãng Mạn',
        skyGradient: 'linear-gradient(180deg, #fa709a 0%, #fee140 60%, #ff8da1 100%)',
        ambientFilter: 'saturate(1.2) contrast(1.05) sepia(0.15)',
        sunlightGlow: 'rgba(255, 140, 0, 0.45)',
        windowGlowIntensity: 0.6,
        riverShimmerOpacity: 0.9,
        particles: 'leaves'
      }

    case 'night':
    default:
      return {
        period: 'night',
        label: 'Đêm Ấm Cúng & Ngàn Sao',
        skyGradient: 'linear-gradient(180deg, #0b132b 0%, #1c2541 55%, #3a506b 100%)',
        ambientFilter: 'brightness(0.85) contrast(1.1) hue-rotate(-10deg)',
        sunlightGlow: 'rgba(160, 210, 255, 0.3)',
        windowGlowIntensity: 0.95,
        riverShimmerOpacity: 0.5,
        particles: 'fireflies'
      }
  }
}

export function getSunMoonPosition(period: TimeOfDayPeriod, hour = new Date().getHours()) {
  let progress = 0.5

  if (period === 'morning') {
    progress = (hour - 5) / 6
  } else if (period === 'afternoon') {
    progress = (hour - 11) / 6
  } else if (period === 'sunset') {
    progress = (hour - 17) / 2
  } else {
    // night
    const nightHour = hour >= 19 ? hour - 19 : hour + 5
    progress = nightHour / 10
  }

  // Calculate parabola arc (x: 10% to 90%, y: 30% down to 10% then to 30%)
  const x = 10 + progress * 80
  const y = 35 - Math.sin(progress * Math.PI) * 25

  return { x, y }
}
