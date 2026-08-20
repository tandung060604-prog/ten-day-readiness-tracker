import { gameEvents } from './events'
import { getItemDefinition } from './itemCatalog'
import type { BuildingLevel, GameState, InventorySlot, RewardGrant } from './types'

export function calculateXpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.25, Math.max(0, level - 1)))
}

export function calculateBondXpToNextLevel(bondLevel: number): number {
  return Math.floor(100 * Math.pow(1.2, Math.max(0, bondLevel - 1)))
}

export function calculateBuildingXpToNextLevel(level: BuildingLevel): number {
  if (level === 1) return 100
  if (level === 2) return 250
  return 999999 // Max level
}

export interface RewardProcessResult {
  nextState: GameState
  summary: string
  levelUps: number
  bondLevelUps: number
  upgradedBuildings: string[]
}

export class RewardService {
  /**
   * Process and grant a reward atomically onto the given GameState
   */
  public processReward(state: GameState, grant: RewardGrant): RewardProcessResult {
    const nextState: GameState = JSON.parse(JSON.stringify(state))
    const summaryParts: string[] = []
    let levelUps = 0
    let bondLevelUps = 0
    const upgradedBuildings: string[] = []

    // 1. Process Currencies
    if (grant.hearts && grant.hearts > 0) {
      nextState.currencies.hearts += grant.hearts
      summaryParts.push(`+${grant.hearts} ❤️`)
      gameEvents.emit('CURRENCY_CHANGED', {
        currency: 'hearts',
        delta: grant.hearts,
        newBalance: nextState.currencies.hearts
      })
    }

    if (grant.stars && grant.stars > 0) {
      nextState.currencies.stars += grant.stars
      summaryParts.push(`+${grant.stars} ⭐`)
      gameEvents.emit('CURRENCY_CHANGED', {
        currency: 'stars',
        delta: grant.stars,
        newBalance: nextState.currencies.stars
      })
    }

    if (grant.coins && grant.coins > 0) {
      nextState.currencies.coins += grant.coins
      summaryParts.push(`+${grant.coins} 🪙`)
      gameEvents.emit('CURRENCY_CHANGED', {
        currency: 'coins',
        delta: grant.coins,
        newBalance: nextState.currencies.coins
      })
    }

    // 2. Process Player XP & Leveling
    if (grant.xp && grant.xp > 0) {
      summaryParts.push(`+${grant.xp} XP`)
      let currentXp = nextState.progression.xp + grant.xp
      let currentLevel = nextState.progression.level
      let requiredXp = calculateXpToNextLevel(currentLevel)

      while (currentXp >= requiredXp) {
        currentXp -= requiredXp
        const previousLevel = currentLevel
        currentLevel += 1
        levelUps += 1
        requiredXp = calculateXpToNextLevel(currentLevel)

        gameEvents.emit('LEVEL_UP', {
          newLevel: currentLevel,
          previousLevel
        })
      }

      nextState.progression.level = currentLevel
      nextState.progression.xp = currentXp
      nextState.progression.xpToNextLevel = requiredXp
    }

    // 3. Process Couple Bond XP & Leveling
    if (grant.bondXp && grant.bondXp > 0) {
      summaryParts.push(`+${grant.bondXp} Bond XP`)
      let currentBondXp = nextState.progression.bondXp + grant.bondXp
      let currentBondLevel = nextState.progression.bondLevel
      let requiredBondXp = calculateBondXpToNextLevel(currentBondLevel)

      while (currentBondXp >= requiredBondXp) {
        currentBondXp -= requiredBondXp
        const previousBondLevel = currentBondLevel
        currentBondLevel += 1
        bondLevelUps += 1
        requiredBondXp = calculateBondXpToNextLevel(currentBondLevel)

        gameEvents.emit('BOND_LEVEL_UP', {
          newBondLevel: currentBondLevel,
          previousBondLevel
        })
      }

      nextState.progression.bondLevel = currentBondLevel
      nextState.progression.bondXp = currentBondXp
      nextState.progression.bondXpToNextLevel = requiredBondXp
    }

    // 4. Process Inventory Items
    if (grant.items && grant.items.length > 0) {
      const newInventory: InventorySlot[] = [...nextState.inventory]

      grant.items.forEach(({ itemId, quantity }) => {
        if (quantity <= 0) return
        const def = getItemDefinition(itemId)
        summaryParts.push(`+${quantity} ${def.icon} ${def.name}`)

        // Check if item already in inventory and can stack
        const existingSlot = newInventory.find(
          (slot) => slot.itemId === itemId && slot.quantity < def.maxStack
        )

        if (existingSlot) {
          const space = def.maxStack - existingSlot.quantity
          const addAmount = Math.min(space, quantity)
          existingSlot.quantity += addAmount
          const remainder = quantity - addAmount

          gameEvents.emit('INVENTORY_UPDATED', {
            itemId,
            delta: addAmount,
            newQuantity: existingSlot.quantity
          })

          if (remainder > 0) {
            newInventory.push({
              itemId,
              quantity: remainder,
              acquiredAt: new Date().toISOString()
            })
          }
        } else {
          newInventory.push({
            itemId,
            quantity,
            acquiredAt: new Date().toISOString()
          })
          gameEvents.emit('INVENTORY_UPDATED', {
            itemId,
            delta: quantity,
            newQuantity: quantity
          })
        }
      })

      nextState.inventory = newInventory
    }

    // 5. Process Building XP & Leveling
    if (grant.buildingXp && grant.buildingXp.length > 0) {
      grant.buildingXp.forEach(({ buildingId, amount }) => {
        const b = nextState.buildings[buildingId]
        if (!b) return

        if (b.level >= 3) {
          // Already max level
          b.xp += amount
          return
        }

        b.xp += amount
        summaryParts.push(`+${amount} XP ${buildingId}`)

        while (b.level < 3 && b.xp >= b.xpToNextLevel) {
          b.xp -= b.xpToNextLevel
          b.level = (b.level + 1) as BuildingLevel
          b.xpToNextLevel = calculateBuildingXpToNextLevel(b.level)
          b.unlockedFeatures.push(`${buildingId}_tier_${b.level}`)
          upgradedBuildings.push(buildingId)

          gameEvents.emit('BUILDING_UPGRADED', {
            buildingId,
            newLevel: b.level
          })
        }
      })
    }

    nextState.progression.totalActivitiesCompleted += 1
    nextState.updatedAt = new Date().toISOString()

    const summary = summaryParts.join(' · ') || 'Đã nhận thưởng'

    gameEvents.emit('REWARD_GRANTED', {
      grant,
      summary
    })

    return {
      nextState,
      summary,
      levelUps,
      bondLevelUps,
      upgradedBuildings
    }
  }
}

// Global Singleton Instance
export const rewardService = new RewardService()
