import type { LocationId } from '../game/types'

export type DailyScreen = 'today' | 'plan' | 'journal' | 'settings'

export type AppRoute =
  | { mode: 'daily'; screen: DailyScreen }
  | { mode: 'adventure'; scene: 'map' | 'module'; location?: LocationId }

export const DAILY_HOME_ROUTE: AppRoute = { mode: 'daily', screen: 'today' }

export function adventureRoute(location?: LocationId): AppRoute {
  return location ? { mode: 'adventure', scene: 'module', location } : { mode: 'adventure', scene: 'map' }
}
