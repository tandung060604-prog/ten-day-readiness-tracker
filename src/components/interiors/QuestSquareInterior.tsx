import { useMemo, useState } from 'react'
import { SceneShell } from './SceneShell'
import { PlanView } from '../../views/PlanView'
import { useQuests } from '../../context/GameStateContext'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import { PuzzleLevelSelectModal } from '../puzzle/PuzzleLevelSelectModal'
import { PuzzleGameBoard } from '../puzzle/PuzzleGameBoard'
import { OrientationPrompt } from '../../game/components/OrientationPrompt'
import type { DailyLog } from '../../types'
import type { LevelDefinition } from '../../domain/puzzle/types'
import type { QuestDefinition } from '../../domain/game/types'
import type { CoupleProfile } from '../../domain/couple/types'
import { createEndlessLevel, getCoupleSeedKey, getLocalDateKey, loadEndlessScore } from '../../domain/puzzle/endlessMode'
import type { EndlessPlayer } from '../../domain/puzzle/endlessMode'

interface QuestSquareProps {
  currentDay: number
  logs: DailyLog[]
  waterTarget: number
  onSelectDay: (day: number) => void
  onNavigateToTraining: () => void
  profile?: CoupleProfile
  endlessPlayer?: EndlessPlayer
}

type QuestProgress = { currentCount: number; completed: boolean }

function getQuestProgress(quest: QuestDefinition, log: DailyLog | undefined, waterTarget: number): QuestProgress {
  if (!log) return { currentCount: 0, completed: false }

  switch (quest.id) {
    case 'q_daily_water':
      return { currentCount: log.hydrationMl, completed: log.hydrationMl >= Math.min(quest.targetCount, waterTarget) }
    case 'q_daily_workout':
      return { currentCount: log.workout?.completed ? 1 : 0, completed: Boolean(log.workout?.completed) }
    case 'q_daily_sleep':
      return { currentCount: (log.sleep?.nightHours ?? 0) >= 8 ? 1 : 0, completed: (log.sleep?.nightHours ?? 0) >= 8 }
    case 'q_couple_journal':
      return { currentCount: log.journal?.trim() ? 1 : 0, completed: Boolean(log.journal?.trim()) }
    default:
      return { currentCount: quest.currentCount, completed: quest.completed }
  }
}

export function QuestSquareInterior({
  currentDay,
  logs,
  waterTarget,
  onSelectDay,
  onNavigateToTraining,
  profile,
  endlessPlayer = 'player1'
}: QuestSquareProps) {
  const [activeTab, setActiveTab] = useState<'board' | 'campaign'>('board')
  const [showLevelSelect, setShowLevelSelect] = useState(false)
  const [activePlayingLevel, setActivePlayingLevel] = useState<LevelDefinition | null>(null)
  const { quests, claimQuest } = useQuests()
  const currentLog = logs.find((log) => log.dayNumber === currentDay)
  const endlessDate = getLocalDateKey()
  const endlessLevel = useMemo(() => createEndlessLevel(endlessDate, getCoupleSeedKey(profile), endlessPlayer), [endlessDate, endlessPlayer, profile])
  const endlessScore = loadEndlessScore(endlessDate, endlessLevel.seed ?? 0)

  const visibleQuests = useMemo(
    () => quests.filter((quest) => quest.category === 'daily' || quest.category === 'couple'),
    [quests]
  )
  const unclaimedCount = visibleQuests.filter(
    (quest) => !quest.claimed && getQuestProgress(quest, currentLog, waterTarget).completed
  ).length

  const handleClaimQuest = (quest: QuestDefinition) => {
    const progress = getQuestProgress(quest, currentLog, waterTarget)
    if (!progress.completed || quest.claimed) return

    const result = claimQuest(quest.id)
    if (!result.success) return
    audioSystem.playAchievement('quest')
    triggerConfetti()
  }

  return (
    <SceneShell
      sceneId="quest-square"
      title="Quảng Trường Nhiệm Vụ"
      subtitle="Những việc nhỏ hôm nay tạo nên hành trình lớn"
      icon="📜"
      companionRole="usagi"
      companionMessage="Nhận nhiệm vụ, hoàn thành từng bước và rinh phần thưởng nhé!"
    >
      <div className="quest-square-container">
        <div className="quest-tabs-row" role="tablist" aria-label="Nội dung nhiệm vụ">
          <button
            className={`quest-tab-btn ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('board') }}
            role="tab"
            aria-selected={activeTab === 'board'}
          >
            📜 Bảng nhiệm vụ {unclaimedCount > 0 ? `(${unclaimedCount} sẵn sàng)` : ''}
          </button>
          <button
            className={`quest-tab-btn ${activeTab === 'campaign' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('campaign') }}
            role="tab"
            aria-selected={activeTab === 'campaign'}
          >
            🗺️ Lộ trình 10 ngày
          </button>
        </div>

        <div className="quest-adventure-banner">
          <div className="adventure-banner-content">
            <div className="adventure-icon" aria-hidden="true">🧩</div>
              <div>
                <h3>Thám hiểm giải đố</h3>
                <p>Ghép các bạn nhỏ, hoàn thành mục tiêu và nhận Sao, Tim cùng Xu.</p>
                <small className="endless-score-line">Seed hôm nay · Chiikawa {endlessScore.player1Best.toLocaleString('vi-VN')} · Usagi {endlessScore.player2Best.toLocaleString('vi-VN')}</small>
              </div>
          </div>
            <div className="quest-adventure-actions"><button className="play-adventure-btn" onClick={() => setShowLevelSelect(true)}>Chiến dịch</button><button className="play-endless-btn" onClick={() => setActivePlayingLevel(endlessLevel)}>Vô tận · {Math.max(endlessScore.player1Best, endlessScore.player2Best).toLocaleString('vi-VN')}</button></div>
        </div>

        {activeTab === 'board' ? (
          <div className="quest-board-scene animate-fade-in">
            <div className="quest-notice-board">
              <div className="board-roof"><span>BẢNG NHIỆM VỤ THỊ TRẤN</span></div>
              <div className="quests-paper-grid">
                {visibleQuests.map((quest) => {
                  const progress = getQuestProgress(quest, currentLog, waterTarget)
                  const completed = quest.claimed || progress.completed
                  return (
                    <div key={quest.id} className={`quest-paper-card ${quest.claimed ? 'claimed' : completed ? 'ready' : 'in-progress'}`}>
                      <div className="quest-icon-badge" aria-hidden="true">{quest.icon}</div>
                      <div className="quest-details">
                        <h4>{quest.title}</h4>
                        <p>{quest.description}</p>
                        <div className="quest-rewards-line">
                          {quest.rewards.xp ? <span>+{quest.rewards.xp} XP</span> : null}
                          {quest.rewards.hearts ? <span>+{quest.rewards.hearts} Tim</span> : null}
                          {quest.rewards.coins ? <span>+{quest.rewards.coins} Xu</span> : null}
                        </div>
                      </div>
                      <div className="quest-action-zone">
                        {quest.claimed ? (
                          <span className="badge-claimed">ĐÃ NHẬN ✅</span>
                        ) : completed ? (
                          <button className="claim-reward-btn" onClick={() => handleClaimQuest(quest)}>Nhận Thưởng!</button>
                        ) : (
                          <span className="badge-pending">{progress.currentCount}/{quest.targetCount}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
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

        {showLevelSelect && (
          <>
            <OrientationPrompt />
            <PuzzleLevelSelectModal
              isOpen={showLevelSelect}
              onClose={() => setShowLevelSelect(false)}
              onSelectLevel={(level) => { setShowLevelSelect(false); setActivePlayingLevel(level) }}
            />
          </>
        )}

        {activePlayingLevel && (
          <PuzzleGameBoard level={activePlayingLevel} onClose={() => setActivePlayingLevel(null)} />
        )}
      </div>
    </SceneShell>
  )
}
