import type { LocationId, TransitionType } from '../../game/types'

export type LocationCategory =
  | 'core'       // Home, Quests, Town Hall
  | 'fitness'    // Gym & Dojo
  | 'wellness'   // Water Fountain, Sleep Haven, Love Hospital
  | 'dining'     // Market, Restaurant
  | 'romance'    // Journal, Album
  | 'adventure'  // Beach, Airport

export interface MapCoordinates {
  /** Percentage from left (0 to 100) */
  x: number
  /** Percentage from top (0 to 100) */
  y: number
}

export interface WorldLocation {
  id: LocationId
  name: string
  subtitle: string
  category: LocationCategory
  position: MapCoordinates
  characterAnchor: MapCoordinates
  img: string
  icon: string
  color: string
  glow: string
  tag: string
  size: number
  transition: TransitionType
  ambienceId: string
  unlockLevel: number
  defaultLevel: 1 | 2 | 3
}

export type TimeOfDayPeriod = 'morning' | 'afternoon' | 'sunset' | 'night'

export interface AtmosphereConfig {
  period: TimeOfDayPeriod
  label: string
  skyGradient: string
  ambientFilter: string
  sunlightGlow: string
  windowGlowIntensity: number // 0 to 1
  riverShimmerOpacity: number
  particles: 'sakura' | 'sparkles' | 'fireflies' | 'leaves'
}

export type SeasonalTheme =
  | 'default'
  | 'anniversary'
  | 'trip_countdown'
  | 'tet'
  | 'valentine'
  | 'christmas'

export interface MascotMapPosition {
  x: number
  y: number
  isMoving: boolean
  facing: 'left' | 'right'
  targetBuildingId?: LocationId | null
}
