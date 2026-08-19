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

export interface GameBuilding {
  id: LocationId
  name: string
  subtitle: string
  icon: string
  character: 'chiikawa' | 'hachiware' | 'usagi' | 'momonga' | 'kurimanju' | 'rakko'
  transition: TransitionType
  gridCol: number
  gridRow: number
  color: string
  tag: string
}

export interface GameStats {
  hearts: number
  stars: number
  gems: number
  energy: number
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
