import { describe, it, expect } from 'vitest'
import {
  canTransitionState,
  getContextualBuildingState,
  EPHEMERAL_STATE_DURATIONS
} from '../domain/character/characterStateMachine'
import {
  getAbilitiesByCharacter,
  getAbilityById,
  COMPANION_ABILITIES
} from '../domain/character/abilityRegistry'
import { getContextualDialogue } from '../domain/character/dialogueEngine'
import {
  calculateBondProgress,
  getUnlockedBondPerks,
  chargeLoveLink,
  triggerLittleDaysMiracle
} from '../domain/character/bondProgression'
import type { LoveLinkState } from '../domain/character/types'

describe('Character System Suite — Phase 05', () => {
  describe('1. State Machine & Transitions', () => {
    it('allows valid state transitions from idle', () => {
      expect(canTransitionState('idle', 'walking')).toBe(true)
      expect(canTransitionState('idle', 'happy')).toBe(true)
      expect(canTransitionState('idle', 'sleeping')).toBe(true)
      expect(canTransitionState('idle', 'training')).toBe(true)
      expect(canTransitionState('idle', 'thinking')).toBe(true)
    })

    it('blocks illegal transitions (e.g. directly sleeping -> running)', () => {
      expect(canTransitionState('sleeping', 'running')).toBe(false)
      expect(canTransitionState('sleeping', 'training')).toBe(false)
      expect(canTransitionState('sleeping', 'eating')).toBe(false)
    })

    it('identifies ephemeral state durations', () => {
      expect(EPHEMERAL_STATE_DURATIONS.celebrating).toBe(3500)
      expect(EPHEMERAL_STATE_DURATIONS.surprised).toBe(2000)
      expect(EPHEMERAL_STATE_DURATIONS.victory).toBe(4000)
    })

    it('maps building contexts to natural character states', () => {
      expect(getContextualBuildingState('gym')).toBe('training')
      expect(getContextualBuildingState('sleep')).toBe('sleeping')
      expect(getContextualBuildingState('restaurant')).toBe('eating')
      expect(getContextualBuildingState('quests')).toBe('thinking')
      expect(getContextualBuildingState('home')).toBe('idle')
    })
  })

  describe('2. Companion Ability Registry', () => {
    it('registers exactly 12 unique companion abilities', () => {
      expect(COMPANION_ABILITIES.length).toBe(12)
    })

    it('divides abilities correctly between Chiikawa and Usagi', () => {
      const chiikawaAbilities = getAbilitiesByCharacter('chiikawa')
      const usagiAbilities = getAbilitiesByCharacter('usagi')

      expect(chiikawaAbilities.length).toBe(6)
      expect(usagiAbilities.length).toBe(6)

      expect(chiikawaAbilities.every(a => a.archetype === 'support')).toBe(true)
      expect(usagiAbilities.every(a => a.archetype === 'energy')).toBe(true)
    })

    it('retrieves ability by ID correctly', () => {
      const heartShield = getAbilityById('heart_shield')
      expect(heartShield).toBeDefined()
      expect(heartShield?.name).toContain('Heart Shield')

      const yahaBurst = getAbilityById('yaha_burst')
      expect(yahaBurst).toBeDefined()
      expect(yahaBurst?.name).toContain('Ya-Haaa Burst')
    })
  })

  describe('3. Contextual Dialogue Engine', () => {
    it('generates personalized Chiikawa dialogue and interpolates partner name', () => {
      const line = getContextualDialogue({
        character: 'chiikawa',
        trigger: 'morning',
        partnerName: 'Mai Trang',
        relationshipDays: 120
      })

      expect(line.speaker).toBe('chiikawa')
      expect(line.text).toContain('Mai Trang')
      expect(line.animation).toBe('happy')
    })

    it('generates high-energy Usagi workout dialogue', () => {
      const line = getContextualDialogue({
        character: 'usagi',
        trigger: 'workout_done',
        partnerName: 'Mai Trang',
        relationshipDays: 120
      })

      expect(line.speaker).toBe('usagi')
      expect(line.soundCue).toBe('yaha')
      expect(line.animation).toBe('victory')
    })

    it('falls back gracefully on unknown triggers', () => {
      const line = getContextualDialogue({
        character: 'chiikawa',
        trigger: 'building_enter' as any,
        partnerName: 'Mai Trang'
      })

      expect(line.text.length).toBeGreaterThan(0)
    })
  })

  describe('4. Bond Progression & Love Link Miracle', () => {
    it('calculates Bond Level from total Bond XP correctly', () => {
      const progressLow = calculateBondProgress(50)
      expect(progressLow.level).toBe(1)
      expect(progressLow.progressPercentage).toBe(50)

      const progressHigh = calculateBondProgress(1200)
      expect(progressHigh.level).toBeGreaterThanOrEqual(5)
    })

    it('unlocks bond perks based on current Bond Level', () => {
      const perksLv1 = getUnlockedBondPerks(1)
      expect(perksLv1.find(p => p.interaction === 'wave')?.unlocked).toBe(true)
      expect(perksLv1.find(p => p.interaction === 'warmHug')?.unlocked).toBe(false)

      const perksLv30 = getUnlockedBondPerks(30)
      expect(perksLv30.every(p => p.unlocked)).toBe(true)
    })

    it('charges Love Link Meter and activates Little Days Miracle when full', () => {
      const initialMeter: LoveLinkState = {
        currentCharge: 50,
        maxCharge: 100,
        isMiracleReady: false
      }

      const charged = chargeLoveLink(initialMeter, 50)
      expect(charged.currentCharge).toBe(100)
      expect(charged.isMiracleReady).toBe(true)

      const { nextMeter, rewards } = triggerLittleDaysMiracle(charged)
      expect(nextMeter.currentCharge).toBe(0)
      expect(nextMeter.isMiracleReady).toBe(false)
      expect(rewards.hearts).toBe(100)
      expect(rewards.coins).toBe(100)
      expect(rewards.xp).toBe(150)
    })
  })
})
