import { useState } from 'react'
import { SceneShell } from './SceneShell'
import { PlanView } from '../../views/PlanView'
import { useGameState } from '../../context/GameStateContext'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import { PuzzleLevelSelectModal } from '../puzzle/PuzzleLevelSelectModal'
import { PuzzleGameBoard } from '../puzzle/PuzzleGameBoard'
import { CANONICAL_PUZZLE_LEVELS } from '../../domain/puzzle/levels'
import type { DailyLog } from '../../types'
import type { LevelDefinition } from '../../domain/puzzle/types'

interface QuestSquareProps {
  currentDay: number
  logs: DailyLog[]
  waterTarget: number
  onSelectDay: (day: number) => void
  onNavigateToTraining: () => void
}

interface QuestItem {
  id: string
  title: string
  rewardXP: number
  rewardHearts: number
  rewardCoins: number
  category: 'daily' | 'couple' | 'wellness'
  icon: string
  isCompleted: boolean
  isClaimed: boolean
}

const INITIAL_QUESTS: QuestItem[] = [
  {
    id: 'q1',
    title: 'Uống đủ 2000ml nước ngọt lành hôm nay',
    rewardXP: 30,
    rewardHearts: 15,
    rewardCoins: 25,
    category: 'wellness',
    icon: '⛲',
    isCompleted: true,
    isClaimed: false
  },
  {
    id: 'q2',
    title: 'Gửi 1 bức thư tình yêu thương tới người ấy',
    rewardXP: 50,
    rewardHearts: 40,
    rewardCoins: 30,
    category: 'couple',
    icon: '💌',
    isCompleted: true,
    isClaimed: false
  },
  {
    id: 'q3',
    title: 'Hoàn thành bài tập thể lực và giãn cơ',
    rewardXP: 60,
    rewardHearts: 20,
    rewardCoins: 50,
    category: 'daily',
    icon: '🥋',
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'q4',
    title: 'Tập thở 4-7-8 trước khi đi ngủ 8 tiếng',
    rewardXP: 40,
    rewardHearts: 20,
    rewardCoins: 20,
    category: 'wellness',
    icon: '🌙',
    isCompleted: false,
    isClaimed: false
  }
]

export function QuestSquareInterior({
  currentDay,
  logs,
  waterTarget,
  onSelectDay,
  onNavigateToTraining
}: QuestSquareProps) {
  const [activeTab, setActiveTab] = useState<'board' | 'campaign'>('board')
  const [quests, setQuests] = useState<QuestItem[]>(INITIAL_QUESTS)
  const [showLevelSelect, setShowLevelSelect] = useState(false)
  const [activePlayingLevel, setActivePlayingLevel] = useState<LevelDefinition | null>(null)
  const { grantReward } = useGameState()

  const handleClaimQuest = (quest: QuestItem) => {
    if (!quest.isCompleted || quest.isClaimed) return

    audioSystem.playAchievement('quest')
    triggerConfetti()

    grantReward({
      hearts: quest.rewardHearts,
      coins: quest.rewardCoins,
      xp: quest.rewardXP,
      source: `quest_${quest.id}`
    })

    setQuests(quests.map(q => q.id === quest.id ? { ...q, isClaimed: true } : q))
  }

  const unclaimedCount = quests.filter(q => q.isCompleted && !q.isClaimed).length

  return (
    <SceneShell
      sceneId="quest-square"
      title="Quảng Trường Nhiệm Vụ"
      subtitle="Bảng yết thị thị trấn trao thưởng vinh dự cho những nỗ lực mỗi ngày"
      icon="📜"
      companionRole="usagi"
      companionMessage="Ura-ya-ha! Nhận nhiệm vụ và rinh thật nhiều Tim và Xu vàng nào!"
    >
      <div className="quest-square-container">
        {/* Navigation Tabs */}
        <div className="quest-tabs-row">
          <button
            className={`quest-tab-btn ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('board'); }}
          >
            📜 Bảng Yết Thị ({unclaimedCount > 0 ? `${unclaimedCount} Sẵn Sàng` : 'Đang Làm'})
          </button>
          <button
            className={`quest-tab-btn ${activeTab === 'campaign' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('campaign'); }}
          >
            🗺️ Lộ Trình 10 Ngày Rèn Luyện
          </button>
        </div>

        {/* Adventure Puzzle Section Banner */}
        <div className="quest-adventure-banner">
          <div className="adventure-banner-content">
            <div className="adventure-icon">🧩✨</div>
            <div>
              <h3>Thám Hiểm Giải Đố (Little Days Adventure)</h3>
              <p>Ghép nối các bạn nhỏ Chiikawa & Usagi vượt qua thử thách để nhận thêm Ngôi Sao, Tim và Xu vàng!</p>
            </div>
          </div>
          <button 
            className="play-adventure-btn animate-bounce-gentle"
            onClick={() => setShowLevelSelect(true)}
          >
            🎮 Bắt Đầu Chơi!
          </button>
        </div>

        {activeTab === 'board' ? (
          <div className="quest-board-scene animate-fade-in">
            <div className="quest-notice-board">
              <div className="board-roof">
                <span>⚔️ BẢNG NHIỆM VỤ THỊ TRẤN ⚔️</span>
              </div>

              <div className="quests-paper-grid">
                {quests.map(quest => (
                  <div 
                    key={quest.id} 
                    className={`quest-paper-card ${quest.isClaimed ? 'claimed' : quest.isCompleted ? 'ready' : 'in-progress'}`}
                  >
                    <div className="quest-paper-pin">📌</div>
                    <div className="quest-icon-badge">{quest.icon}</div>
                    <div className="quest-details">
                      <h4>{quest.title}</h4>
                      <div className="quest-rewards-line">
                        <span>✨ +{quest.rewardXP} XP</span>
                        <span>💖 +{quest.rewardHearts} Tim</span>
                        <span>🪙 +{quest.rewardCoins} Xu</span>
                      </div>
                    </div>

                    <div className="quest-action-zone">
                      {quest.isClaimed ? (
                        <span className="badge-claimed">ĐÃ NHẬN ✅</span>
                      ) : quest.isCompleted ? (
                        <button 
                          className="claim-reward-btn animate-bounce-gentle"
                          onClick={() => handleClaimQuest(quest)}
                        >
                          🎁 Nhận Thưởng!
                        </button>
                      ) : (
                        <span className="badge-pending">Đang thực hiện...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="quest-campaign-scene animate-fade-in">
            <PlanView
              currentDay={currentDay}
              logs={logs}
              waterTarget={waterTarget}
              onSelectDay={onSelectDay}
              onNavigateToTraining={onNavigateToTraining}
            />
          </div>
        )}

        {/* Puzzle Level Select Modal */}
        {showLevelSelect && (
          <PuzzleLevelSelectModal
            isOpen={showLevelSelect}
            onClose={() => setShowLevelSelect(false)}
            onSelectLevel={(level) => {
              setShowLevelSelect(false)
              setActivePlayingLevel(level)
            }}
          />
        )}

        {/* Active Fullscreen Puzzle Game Board */}
        {activePlayingLevel && (
          <PuzzleGameBoard
            level={activePlayingLevel}
            onClose={() => setActivePlayingLevel(null)}
          />
        )}
      </div>
    </SceneShell>
  )
}
