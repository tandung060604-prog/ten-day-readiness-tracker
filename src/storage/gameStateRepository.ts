import { createDefaultGameState } from '../domain/game/defaultState'
import { gameEvents } from '../domain/game/events'
import { rewardService } from '../domain/game/rewardService'
import type { CurrencyBalances, GameState } from '../domain/game/types'

const STORAGE_KEY = 'little_days_game_state_v1'

export const gameStateRepository = {
  /**
   * Load game state from localStorage with corrupt-data recovery
   */
  loadGameState(): GameState {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) {
        return createDefaultGameState()
      }
      const parsed: GameState = JSON.parse(data)
      // Ensure required sub-properties exist
      if (!parsed.progression || !parsed.currencies || !parsed.inventory || !parsed.buildings) {
        return createDefaultGameState()
      }
      return parsed
    } catch (err) {
      console.warn('Failed to parse saved game state, falling back to defaults:', err)
      return createDefaultGameState()
    }
  },

  /**
   * Save game state to localStorage
   */
  saveGameState(state: GameState): void {
    try {
      const toSave: GameState = {
        ...state,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (err) {
      console.error('Failed to save game state to localStorage:', err)
    }
  },

  /**
   * Reset game state to defaults
   */
  resetGameState(): GameState {
    const fresh = createDefaultGameState()
    this.saveGameState(fresh)
    return fresh
  },

  /**
   * Spend in-game currency with underflow protection
   */
  spendCurrency(
    state: GameState,
    currency: keyof CurrencyBalances,
    amount: number
  ): { success: boolean; nextState: GameState } {
    if (amount <= 0) return { success: true, nextState: state }
    if (state.currencies[currency] < amount) {
      return { success: false, nextState: state }
    }

    const nextState: GameState = JSON.parse(JSON.stringify(state))
    nextState.currencies[currency] -= amount

    gameEvents.emit('CURRENCY_CHANGED', {
      currency,
      delta: -amount,
      newBalance: nextState.currencies[currency]
    })

    this.saveGameState(nextState)
    return { success: true, nextState }
  },

  /**
   * Consume an item from inventory
   */
  consumeInventoryItem(
    state: GameState,
    itemId: string,
    quantity = 1
  ): { success: boolean; nextState: GameState } {
    const slot = state.inventory.find((s) => s.itemId === itemId)
    if (!slot || slot.quantity < quantity) {
      return { success: false, nextState: state }
    }

    const nextState: GameState = JSON.parse(JSON.stringify(state))
    const targetSlot = nextState.inventory.find((s) => s.itemId === itemId)!
    targetSlot.quantity -= quantity

    if (targetSlot.quantity <= 0) {
      nextState.inventory = nextState.inventory.filter((s) => s.itemId !== itemId)
    }

    gameEvents.emit('INVENTORY_UPDATED', {
      itemId,
      delta: -quantity,
      newQuantity: targetSlot.quantity > 0 ? targetSlot.quantity : 0
    })

    this.saveGameState(nextState)
    return { success: true, nextState }
  },

  /**
   * Mark a quest complete and grant rewards via Authoritative RewardService
   */
  claimQuest(
    state: GameState,
    questId: string
  ): { success: boolean; nextState: GameState; summary?: string } {
    const quest = state.quests.find((q) => q.id === questId)
    if (!quest || quest.claimed) {
      return { success: false, nextState: state }
    }

    const nextState: GameState = JSON.parse(JSON.stringify(state))
    const targetQuest = nextState.quests.find((q) => q.id === questId)!
    targetQuest.completed = true
    targetQuest.claimed = true

    // Process reward atomically
    const { nextState: rewardedState, summary } = rewardService.processReward(nextState, {
      ...quest.rewards,
      source: `Nhiệm vụ: ${quest.title}`
    })

    gameEvents.emit('QUEST_COMPLETED', {
      questId,
      title: quest.title
    })

    this.saveGameState(rewardedState)
    return { success: true, nextState: rewardedState, summary }
  }
}
