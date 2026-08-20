import type { LocationId } from '../../game/types'
import type { MascotCharacter } from '../couple/types'

// ─── 1. CHARACTER STATES ───
export type CharacterState =
  | 'idle'
  | 'walking'
  | 'running'
  | 'happy'
  | 'sad'
  | 'sleeping'
  | 'eating'
  | 'training'
  | 'celebrating'
  | 'thinking'
  | 'surprised'
  | 'hugging'
  | 'interacting'
  | 'victory'

export type CharacterEmotion =
  | 'joyful'
  | 'sleepy'
  | 'motivated'
  | 'loving'
  | 'curious'
  | 'playful'
  | 'comforting'
  | 'hungry'

// ─── 2. COMPANION ABILITIES ───
export type AbilityArchetype = 'support' | 'energy'

export interface CharacterAbility {
  id: string
  name: string
  character: MascotCharacter
  archetype: AbilityArchetype
  icon: string
  description: string
  cooldownSeconds: number
  energyCost: number
  synergyEffect?: string
}

// ─── 3. LOVE LINK & DUO MIRACLE ───
export interface LoveLinkState {
  currentCharge: number
  maxCharge: number
  isMiracleReady: boolean
  lastMiracleTriggeredAt?: string
}

export type DuoInteractionType =
  | 'wave'
  | 'highFive'
  | 'sitTogether'
  | 'holdHands'
  | 'warmHug'
  | 'littleDaysMiracle'

export interface BondPerk {
  level: number
  title: string
  interaction: DuoInteractionType
  icon: string
  description: string
  unlocked: boolean
}

// ─── 4. CONTEXTUAL DIALOGUE SYSTEM ───
export type DialogueTrigger =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'sofa_checkin'
  | 'hydration_done'
  | 'workout_done'
  | 'milestone_reach'
  | 'letter_sent'
  | 'building_enter'
  | 'idle_random'
  | 'miracle_ready'

export interface DialogueContext {
  character: MascotCharacter
  trigger: DialogueTrigger
  relationshipDays?: number
  partnerName?: string
  buildingId?: LocationId
  currentEmotion?: CharacterEmotion
  streakDays?: number
}

export interface DialogueLine {
  id: string
  text: string
  speaker: MascotCharacter
  emotion: CharacterEmotion
  soundCue?: string
  animation?: CharacterState
}
