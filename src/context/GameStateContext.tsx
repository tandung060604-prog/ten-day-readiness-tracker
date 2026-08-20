import React, { createContext, useContext, useEffect, useState } from 'react'
import { rewardService } from '../domain/game/rewardService'
import type { RewardProcessResult } from '../domain/game/rewardService'
import { gameStateRepository } from '../storage/gameStateRepository'
import type { CurrencyBalances, GameState, RewardGrant } from '../domain/game/types'
import type { LocationId } from '../game/types'

interface GameStateContextValue {
  state: GameState
  grantReward: (grant: RewardGrant) => RewardProcessResult
  spendCurrency: (currency: keyof CurrencyBalances, amount: number) => boolean
  consumeItem: (itemId: string, quantity?: number) => boolean
  claimQuest: (questId: string) => { success: boolean; summary?: string }
  resetState: () => void
  updateState: (fn: (current: GameState) => GameState) => void
}

const GameStateContext = createContext<GameStateContextValue | null>(null)

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => gameStateRepository.loadGameState())

  // Persist on state change
  useEffect(() => {
    gameStateRepository.saveGameState(state)
  }, [state])

  const grantReward = (grant: RewardGrant): RewardProcessResult => {
    const result = rewardService.processReward(state, grant)
    setState(result.nextState)
    return result
  }

  const spendCurrency = (currency: keyof CurrencyBalances, amount: number): boolean => {
    const result = gameStateRepository.spendCurrency(state, currency, amount)
    if (result.success) {
      setState(result.nextState)
    }
    return result.success
  }

  const consumeItem = (itemId: string, quantity = 1): boolean => {
    const result = gameStateRepository.consumeInventoryItem(state, itemId, quantity)
    if (result.success) {
      setState(result.nextState)
    }
    return result.success
  }

  const claimQuest = (questId: string): { success: boolean; summary?: string } => {
    const result = gameStateRepository.claimQuest(state, questId)
    if (result.success) {
      setState(result.nextState)
    }
    return { success: result.success, summary: result.summary }
  }

  const resetState = () => {
    const fresh = gameStateRepository.resetGameState()
    setState(fresh)
  }

  const updateState = (fn: (current: GameState) => GameState) => {
    setState((prev) => {
      const next = fn(prev)
      gameStateRepository.saveGameState(next)
      return next
    })
  }

  return (
    <GameStateContext.Provider
      value={{
        state,
        grantReward,
        spendCurrency,
        consumeItem,
        claimQuest,
        resetState,
        updateState
      }}
    >
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const ctx = useContext(GameStateContext)
  if (!ctx) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return ctx
}

export function useProgression() {
  const { state } = useGameState()
  return {
    progression: state.progression,
    currencies: state.currencies
  }
}

export function useInventory() {
  const { state, consumeItem } = useGameState()
  const hasItem = (itemId: string, quantity = 1): boolean => {
    const slot = state.inventory.find((s) => s.itemId === itemId)
    return !!slot && slot.quantity >= quantity
  }

  return {
    inventory: state.inventory,
    consumeItem,
    hasItem
  }
}

export function useBuildings() {
  const { state } = useGameState()
  return {
    buildings: state.buildings,
    getBuilding: (id: LocationId) => state.buildings[id]
  }
}

export function useQuests() {
  const { state, claimQuest } = useGameState()
  return {
    quests: state.quests,
    claimQuest
  }
}
