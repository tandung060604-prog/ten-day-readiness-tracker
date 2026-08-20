import { describe, it, expect } from 'vitest'
import { WORLD_LOCATIONS, getAllLocations, getLocationById } from '../domain/world/locationRegistry'
import { getTimeOfDayPeriod, getAtmosphereConfig, getSunMoonPosition } from '../domain/world/timeOfDay'
import { detectSeasonalTheme } from '../domain/world/seasonalTheme'
import type { LocationId } from '../game/types'
import type { CoupleProfile } from '../domain/couple/types'
import { DEMO_COUPLE_PROFILE } from '../domain/couple/demoProfile'

describe('World Location Registry', () => {
  const EXPECTED_LOCATION_IDS: LocationId[] = [
    'home',
    'quests',
    'gym',
    'water',
    'sleep',
    'journal',
    'album',
    'market',
    'restaurant',
    'airport',
    'beach',
    'hospital',
    'settings'
  ]

  it('contains exactly 13 canonical locations', () => {
    const locations = getAllLocations()
    expect(locations.length).toBe(13)

    EXPECTED_LOCATION_IDS.forEach((id) => {
      expect(WORLD_LOCATIONS[id]).toBeDefined()
      expect(WORLD_LOCATIONS[id].id).toBe(id)
    })
  })

  it('has valid coordinates within bounds (0 to 100%) for all locations and anchors', () => {
    const locations = getAllLocations()
    locations.forEach((loc) => {
      expect(loc.position.x).toBeGreaterThanOrEqual(0)
      expect(loc.position.x).toBeLessThanOrEqual(100)
      expect(loc.position.y).toBeGreaterThanOrEqual(0)
      expect(loc.position.y).toBeLessThanOrEqual(100)

      expect(loc.characterAnchor.x).toBeGreaterThanOrEqual(0)
      expect(loc.characterAnchor.x).toBeLessThanOrEqual(100)
      expect(loc.characterAnchor.y).toBeGreaterThanOrEqual(0)
      expect(loc.characterAnchor.y).toBeLessThanOrEqual(100)
    })
  })

  it('retrieves location by ID or returns safe fallback', () => {
    const home = getLocationById('home')
    expect(home.name).toContain('Tổ Ấm')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unknown = getLocationById('unknown_id' as any)
    expect(unknown.id).toBe('unknown_id')
    expect(unknown.position.x).toBe(50)
  })
})

describe('Time of Day & Atmospheric Engine', () => {
  it('categorizes all 24 hours into the 4 atmospheric periods', () => {
    // Morning (05:00 - 10:59)
    expect(getTimeOfDayPeriod(new Date('2026-08-20T05:00:00'))).toBe('morning')
    expect(getTimeOfDayPeriod(new Date('2026-08-20T08:30:00'))).toBe('morning')
    expect(getTimeOfDayPeriod(new Date('2026-08-20T10:59:59'))).toBe('morning')

    // Afternoon (11:00 - 16:59)
    expect(getTimeOfDayPeriod(new Date('2026-08-20T11:00:00'))).toBe('afternoon')
    expect(getTimeOfDayPeriod(new Date('2026-08-20T14:15:00'))).toBe('afternoon')
    expect(getTimeOfDayPeriod(new Date('2026-08-20T16:59:59'))).toBe('afternoon')

    // Sunset (17:00 - 18:59)
    expect(getTimeOfDayPeriod(new Date('2026-08-20T17:00:00'))).toBe('sunset')
    expect(getTimeOfDayPeriod(new Date('2026-08-20T18:45:00'))).toBe('sunset')

    // Night (19:00 - 04:59)
    expect(getTimeOfDayPeriod(new Date('2026-08-20T19:00:00'))).toBe('night')
    expect(getTimeOfDayPeriod(new Date('2026-08-20T23:00:00'))).toBe('night')
    expect(getTimeOfDayPeriod(new Date('2026-08-20T02:00:00'))).toBe('night')
    expect(getTimeOfDayPeriod(new Date('2026-08-20T04:59:59'))).toBe('night')
  })

  it('provides rich atmosphere config for all periods', () => {
    const morning = getAtmosphereConfig('morning')
    expect(morning.particles).toBe('sakura')
    expect(morning.skyGradient).toContain('linear-gradient')

    const night = getAtmosphereConfig('night')
    expect(night.particles).toBe('fireflies')
    expect(night.windowGlowIntensity).toBeGreaterThan(0.8)
  })

  it('calculates celestial sun/moon positions on a smooth arc', () => {
    const noonPos = getSunMoonPosition('afternoon', 14)
    expect(noonPos.x).toBeGreaterThan(10)
    expect(noonPos.x).toBeLessThan(90)
    expect(noonPos.y).toBeLessThan(35) // High in sky
  })
})

describe('Seasonal Theme Detector', () => {
  const mockProfile: CoupleProfile = {
    ...DEMO_COUPLE_PROFILE,
    relationshipStartDate: '2026-06-11'
  }

  it('detects couple anniversary on exact start date', () => {
    const annivDate = new Date('2026-06-11T10:00:00')
    const theme = detectSeasonalTheme(mockProfile, annivDate)
    expect(theme.theme).toBe('anniversary')
    expect(theme.title).toContain('Kỷ Niệm')
  })

  it('detects Nha Trang trip period in late August', () => {
    const tripDate = new Date('2026-08-20T10:00:00')
    const theme = detectSeasonalTheme(mockProfile, tripDate)
    expect(theme.theme).toBe('trip_countdown')
    expect(theme.title).toContain('Nha Trang')
  })

  it('detects Valentine and Christmas holidays', () => {
    const valDate = new Date('2026-02-14T10:00:00')
    expect(detectSeasonalTheme(mockProfile, valDate).theme).toBe('valentine')

    const xmasDate = new Date('2026-12-25T10:00:00')
    expect(detectSeasonalTheme(mockProfile, xmasDate).theme).toBe('christmas')
  })

  it('defaults to serene town theme during normal days', () => {
    const normalDate = new Date('2026-05-15T10:00:00')
    expect(detectSeasonalTheme(mockProfile, normalDate).theme).toBe('default')
  })
})
