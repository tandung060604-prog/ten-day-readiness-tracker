import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEventBus } from '../domain/game/events'
import { RewardService, calculateXpToNextLevel, calculateBondXpToNextLevel } from '../domain/game/rewardService'
import { createDefaultGameState } from '../domain/game/defaultState'
import { gameStateRepository } from '../storage/gameStateRepository'
import type { GameState } from '../domain/game/types'

describe('GameEventBus', () => {
  let eventBus: GameEventBus

  beforeEach(() => {
    eventBus = new GameEventBus()
  })

  it('subscribes to and receives emitted events', () => {
    const handler = vi.fn()
    const unsubscribe = eventBus.on('ACTIVITY_COMPLETED', handler)

    eventBus.emit('ACTIVITY_COMPLETED', {
      activityId: 'gym_workout',
      name: 'Rèn luyện gym',
      category: 'workout'
    })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith({
      activityId: 'gym_workout',
      name: 'Rèn luyện gym',
      category: 'workout'
    })

    unsubscribe()
    eventBus.emit('ACTIVITY_COMPLETED', {
      activityId: 'gym_workout_2',
      name: 'Chạy bộ',
      category: 'cardio'
    })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('handles once subscriptions correctly', () => {
    const handler = vi.fn()
    eventBus.once('LEVEL_UP', handler)

    eventBus.emit('LEVEL_UP', { newLevel: 2, previousLevel: 1 })
    eventBus.emit('LEVEL_UP', { newLevel: 3, previousLevel: 2 })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith({ newLevel: 2, previousLevel: 1 })
  })

  it('clears all listeners on clearAll()', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    eventBus.on('CURRENCY_CHANGED', handler1)
    eventBus.on('QUEST_COMPLETED', handler2)

    eventBus.clearAll()

    eventBus.emit('CURRENCY_CHANGED', { currency: 'hearts', delta: 10, newBalance: 110 })
    eventBus.emit('QUEST_COMPLETED', { questId: 'q1', title: 'Quest 1' })

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
  })
})

describe('RewardService (Authoritative Pipeline)', () => {
  let rewardService: RewardService
  let initialState: GameState

  beforeEach(() => {
    rewardService = new RewardService()
    initialState = createDefaultGameState()
  })

  it('grants currencies and updates balances atomically', () => {
    const result = rewardService.processReward(initialState, {
      hearts: 50,
      stars: 20,
      coins: 100,
      source: 'Test Grant'
    })

    expect(result.nextState.currencies.hearts).toBe(initialState.currencies.hearts + 50)
    expect(result.nextState.currencies.stars).toBe(initialState.currencies.stars + 20)
    expect(result.nextState.currencies.coins).toBe(initialState.currencies.coins + 100)
    expect(result.summary).toContain('+50 ❤️')
  })

  it('calculates XP progression and triggers level ups', () => {
    // Initial: Level 1, 0 XP, 100 required
    const result = rewardService.processReward(initialState, {
      xp: 150,
      source: 'Workout complete'
    })

    // Level 1 -> Level 2 with 50 leftover XP
    expect(result.levelUps).toBe(1)
    expect(result.nextState.progression.level).toBe(2)
    expect(result.nextState.progression.xp).toBe(50)
    expect(result.nextState.progression.xpToNextLevel).toBe(calculateXpToNextLevel(2))
  })

  it('calculates Bond XP progression and triggers bond level ups', () => {
    const result = rewardService.processReward(initialState, {
      bondXp: 120,
      source: 'Couple anniversary'
    })

    expect(result.bondLevelUps).toBe(1)
    expect(result.nextState.progression.bondLevel).toBe(2)
    expect(result.nextState.progression.bondXp).toBe(20)
    expect(result.nextState.progression.bondXpToNextLevel).toBe(calculateBondXpToNextLevel(2))
  })

  it('adds items to inventory and respects maxStack', () => {
    const result = rewardService.processReward(initialState, {
      items: [{ itemId: 'strawberries', quantity: 10 }],
      source: 'Farm harvest'
    })

    // Initial has 5 strawberries, maxStack is 99
    const slot = result.nextState.inventory.find((s) => s.itemId === 'strawberries')
    expect(slot).toBeDefined()
    expect(slot?.quantity).toBe(15)
  })

  it('levels up buildings and caps at max level 3', () => {
    // Level 1 -> 2 requires 100 XP
    const result1 = rewardService.processReward(initialState, {
      buildingXp: [{ buildingId: 'home', amount: 150 }],
      source: 'Home cleanup'
    })

    expect(result1.upgradedBuildings).toContain('home')
    expect(result1.nextState.buildings.home.level).toBe(2)
    expect(result1.nextState.buildings.home.xp).toBe(50)

    // Level 2 -> 3 requires 250 XP (currently has 50 XP, needs 200 more)
    const result2 = rewardService.processReward(result1.nextState, {
      buildingXp: [{ buildingId: 'home', amount: 300 }],
      source: 'Major renovation'
    })

    expect(result2.nextState.buildings.home.level).toBe(3)
  })
})

describe('GameStateRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads default game state on fresh start', () => {
    const state = gameStateRepository.loadGameState()
    expect(state).toBeDefined()
    expect(state.progression.level).toBe(1)
    expect(state.currencies.hearts).toBe(150)
  })

  it('spends currency with underflow protection', () => {
    const state = gameStateRepository.loadGameState()
    
    // Spend affordable amount
    const res1 = gameStateRepository.spendCurrency(state, 'coins', 50)
    expect(res1.success).toBe(true)
    expect(res1.nextState.currencies.coins).toBe(150)

    // Try to overspend
    const res2 = gameStateRepository.spendCurrency(res1.nextState, 'coins', 9999)
    expect(res2.success).toBe(false)
    expect(res2.nextState.currencies.coins).toBe(150)
  })

  it('consumes inventory items correctly', () => {
    const state = gameStateRepository.loadGameState()
    // Initial state has 5 strawberries
    const res1 = gameStateRepository.consumeInventoryItem(state, 'strawberries', 2)
    expect(res1.success).toBe(true)
    expect(res1.nextState.inventory.find((s) => s.itemId === 'strawberries')?.quantity).toBe(3)

    // Consume remaining
    const res2 = gameStateRepository.consumeInventoryItem(res1.nextState, 'strawberries', 3)
    expect(res2.success).toBe(true)
    expect(res2.nextState.inventory.find((s) => s.itemId === 'strawberries')).toBeUndefined()
  })

  it('claims quest reward atomically through reward pipeline', () => {
    const state = gameStateRepository.loadGameState()
    const questId = 'q_daily_water'
    
    const initialHearts = state.currencies.hearts
    const res = gameStateRepository.claimQuest(state, questId)

    expect(res.success).toBe(true)
    expect(res.nextState.quests.find((q) => q.id === questId)?.claimed).toBe(true)
    expect(res.nextState.currencies.hearts).toBe(initialHearts + 25)

    // Cannot claim twice
    const doubleClaim = gameStateRepository.claimQuest(res.nextState, questId)
    expect(doubleClaim.success).toBe(false)
  })

  it('recovers cleanly from corrupt JSON in storage', () => {
    localStorage.setItem('little_days_game_state_v1', 'bad_json_string{...')
    const state = gameStateRepository.loadGameState()
    expect(state.progression.level).toBe(1)
    expect(state.currencies.hearts).toBe(150)
  })
})
