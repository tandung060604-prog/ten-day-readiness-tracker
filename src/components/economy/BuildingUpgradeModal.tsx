import { useState } from 'react'
import { Modal } from '../common/Modal'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { BUILDING_UPGRADE_REGISTRY } from '../../domain/economy/buildingUpgradeRegistry'
import { getItem } from '../../domain/economy/itemRegistry'
import { canAffordUpgrade, executeBuildingUpgrade } from '../../domain/economy/inventoryManager'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { audioManager } from '../../domain/audio/audioManager'
import { triggerConfetti } from '../../utils/confetti'
import type { InventorySlot } from '../../domain/economy/types'

interface BuildingUpgradeModalProps {
  isOpen: boolean
  buildingId: string
  currentTier: 1 | 2 | 3
  coins: number
  hearts: number
  stars: number
  inventory: InventorySlot[]
  onClose: () => void
  onUpgradeSuccess: (nextTier: 1 | 2 | 3, nextCoins: number, nextHearts: number, nextInventory: InventorySlot[]) => void
}

export function BuildingUpgradeModal({
  isOpen,
  buildingId,
  currentTier,
  coins,
  hearts,
  stars,
  inventory,
  onClose,
  onUpgradeSuccess
}: BuildingUpgradeModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)

  if (!isOpen) return null

  const def = BUILDING_UPGRADE_REGISTRY[buildingId]
  if (!def) return null

  const currentTierConfig = def.tiers[currentTier]
  const isMaxTier = currentTier >= 3
  const nextTier = (isMaxTier ? 3 : currentTier + 1) as 2 | 3
  const nextTierConfig = def.tiers[nextTier]

  const affordability = canAffordUpgrade(buildingId, nextTier, coins, hearts, stars, inventory)

  const handleUpgrade = () => {
    if (isMaxTier || !affordability.canAfford) return
    setIsUpgrading(true)
    setFeedbackError(null)

    const result = executeBuildingUpgrade(buildingId, currentTier, coins, hearts, stars, inventory)

    if (result.success && result.nextTier) {
      audioManager.playVocalization(nextTierConfig.dialogueCheer.character === 'usagi' ? 'usagi_yaha' : 'chiikawa_cheer')
      audioSystem.playClick('pop')
      triggerConfetti()

      setTimeout(() => {
        setIsUpgrading(false)
        onUpgradeSuccess(result.nextTier!, result.nextCoins, result.nextHearts, result.nextInventory)
        onClose()
      }, 600)
    } else {
      setIsUpgrading(false)
      setFeedbackError(result.error || 'Nâng cấp thất bại!')
    }
  }

  return (
    <Modal title={`Nâng Cấp — ${def.buildingName}`} onClose={onClose}>
      <div className="upgrade-modal-container">
        {/* Tier Comparison Banner */}
        <div className="tier-comparison-box">
          <div className="tier-col current-tier">
            <span className="tier-tag">Hiện Tại (Cấp {currentTier})</span>
            <h4>{currentTierConfig.tierName}</h4>
            <p>{currentTierConfig.description}</p>
          </div>

          {!isMaxTier && (
            <>
              <div className="tier-arrow">➔</div>
              <div className="tier-col next-tier">
                <span className="tier-tag highlight">Cấp Mới (Cấp {nextTier})</span>
                <h4>{nextTierConfig.tierName}</h4>
                <p>{nextTierConfig.description}</p>
              </div>
            </>
          )}
        </div>

        {/* Unlocked Perks List */}
        {!isMaxTier && (
          <div className="unlocked-perks-section">
            <h5>✨ Quyền Lợi & Tính Năng Mới:</h5>
            <ul className="perks-list">
              {nextTierConfig.unlockedPerks.map((perk, i) => (
                <li key={i}>🌟 {perk}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mascot Cheer Banner */}
        <div className="mascot-cheer-banner">
          <ChiikawaSVG character={nextTierConfig.dialogueCheer.character === 'both' ? 'chiikawa' : nextTierConfig.dialogueCheer.character} size={36} />
          <p>"{nextTierConfig.dialogueCheer.text}"</p>
        </div>

        {/* Required Costs Card */}
        {!isMaxTier ? (
          <div className="upgrade-costs-card">
            <h5>📦 Chi Phí Nâng Cấp:</h5>

            {/* Currency costs */}
            <div className="cost-currencies-row">
              <div className={`cost-pill ${coins >= affordability.cost.coins ? 'met' : 'unmet'}`}>
                <span>🪙 Xu:</span>
                <strong>{coins} / {affordability.cost.coins}</strong>
              </div>
              <div className={`cost-pill ${hearts >= affordability.cost.hearts ? 'met' : 'unmet'}`}>
                <span>💖 Tim:</span>
                <strong>{hearts} / {affordability.cost.hearts}</strong>
              </div>
              <div className={`cost-pill ${stars >= affordability.cost.stars ? 'met' : 'unmet'}`}>
                <span>⭐ Sao:</span>
                <strong>{stars} / {affordability.cost.stars}</strong>
              </div>
            </div>

            {/* Material costs */}
            {affordability.cost.requiredMaterials.length > 0 && (
              <div className="cost-materials-grid">
                {affordability.cost.requiredMaterials.map(mat => {
                  const item = getItem(mat.itemId)
                  const slot = inventory.find(s => s.itemId === mat.itemId)
                  const have = slot ? slot.quantity : 0
                  const isMet = have >= mat.quantity

                  return (
                    <div key={mat.itemId} className={`material-cost-card ${isMet ? 'met' : 'unmet'}`}>
                      <span className="mat-icon">{item?.icon || '📦'}</span>
                      <div className="mat-details">
                        <span className="mat-name">{item?.name || mat.itemId}</span>
                        <span className="mat-qty">{have} / {mat.quantity}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="max-tier-celebration">
            <span className="crown-icon">👑✨</span>
            <h4>Công trình đã đạt Cấp Độ Hoàng Kim Tối Đa (Cấp 3)!</h4>
          </div>
        )}

        {feedbackError && <p className="upgrade-error-text">{feedbackError}</p>}

        {/* Actions */}
        <div className="upgrade-modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Đóng
          </button>
          {!isMaxTier && (
            <button
              className={`confirm-upgrade-btn ${affordability.canAfford ? 'ready animate-bounce-gentle' : 'disabled'}`}
              onClick={handleUpgrade}
              disabled={!affordability.canAfford || isUpgrading}
            >
              {isUpgrading ? 'Đang Nâng Cấp...' : '🏗️ Xác Nhận Nâng Cấp'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
