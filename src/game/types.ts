export type LocationId =
  | 'home'
  | 'quests'
  | 'gym'
  | 'water'
  | 'sleep'
  | 'journal'
  | 'album'
  | 'market'
  | 'restaurant'
  | 'airport'
  | 'beach'
  | 'settings'

export type TransitionType =
  | 'cloud'
  | 'water'
  | 'book'
  | 'camera'
  | 'moon'
  | 'plane'
  | 'heart'
  | 'gear'

export type BuildingState =
  | 'idle'
  | 'hovered'
  | 'selected'
  | 'loading'
  | 'locked'
  | 'completed'

export interface MapBuilding {
  id: LocationId
  name: string
  subtitle: string
  icon: string
  img: string
  transition: TransitionType
  color: string
  glow: string
  tag: string
  size: number
  /** Position on the map as percentage (0–100) */
  x: number
  y: number
}

export interface GameStats {
  hearts: number
  stars: number
  gems: number
  energy: number
  energyMax: number
  level: number
  levelProgress: number
  loveDays: number
  day: number
  maxDays: number
}

export interface InventoryItem {
  id: string
  name: string
  icon: string
  description: string
  count: number
  category: 'food' | 'souvenir' | 'decoration' | 'special'
}
