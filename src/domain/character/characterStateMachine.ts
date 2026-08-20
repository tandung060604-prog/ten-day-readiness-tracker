import type { CharacterState } from './types'
import type { LocationId } from '../../game/types'

// Allowed outgoing transitions from each state
const VALID_TRANSITIONS: Record<CharacterState, CharacterState[]> = {
  idle: ['walking', 'thinking', 'happy', 'sad', 'sleeping', 'eating', 'training', 'celebrating', 'surprised', 'interacting', 'hugging'],
  walking: ['idle', 'running', 'surprised', 'thinking'],
  running: ['idle', 'walking', 'victory', 'surprised'],
  happy: ['idle', 'celebrating', 'hugging', 'victory', 'interacting'],
  sad: ['idle', 'thinking', 'interacting'],
  sleeping: ['idle', 'surprised'],
  eating: ['idle', 'happy', 'celebrating'],
  training: ['idle', 'victory', 'happy', 'celebrating'],
  celebrating: ['idle', 'victory', 'happy'],
  thinking: ['idle', 'happy', 'surprised', 'interacting'],
  surprised: ['idle', 'happy', 'celebrating', 'running'],
  hugging: ['idle', 'happy', 'celebrating'],
  interacting: ['idle', 'happy', 'thinking', 'celebrating'],
  victory: ['idle', 'celebrating', 'happy']
}

// Auto-reverting states and their timeout durations in milliseconds
export const EPHEMERAL_STATE_DURATIONS: Partial<Record<CharacterState, number>> = {
  celebrating: 3500,
  surprised: 2000,
  victory: 4000,
  interacting: 4500,
  eating: 3000,
  hugging: 3500
}

/**
 * Validates if a state transition from `from` to `to` is legally allowed.
 */
export function canTransitionState(from: CharacterState, to: CharacterState): boolean {
  if (from === to) return true
  const allowed = VALID_TRANSITIONS[from]
  return allowed ? allowed.includes(to) : false
}

/**
 * Maps building interiors to their natural contextual character state.
 */
export function getContextualBuildingState(buildingId: LocationId): CharacterState {
  switch (buildingId) {
    case 'gym':
      return 'training'
    case 'sleep':
      return 'sleeping'
    case 'market':
    case 'restaurant':
      return 'eating'
    case 'quests':
    case 'album':
      return 'thinking'
    case 'beach':
    case 'airport':
      return 'happy'
    case 'hospital':
      return 'hugging'
    default:
      return 'idle'
  }
}
