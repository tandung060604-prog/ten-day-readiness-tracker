import { useState } from 'react'
import { SceneShell } from './SceneShell'
import { BreathingTimer } from '../BreathingTimer'
import { SleepTrackerPro } from '../features/SleepTrackerPro'
import { SleepModal } from '../modals/SleepModal'
import { SoundscapeMixerWidget } from '../common/SoundscapeMixerWidget'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import type { DailyLog, SleepEntry } from '../../types'

interface SleepHavenProps {
  log: DailyLog
  updateLog: (fn: (current: DailyLog) => DailyLog) => void
  setMetric: (key: 'energy' | 'mood' | 'stress' | 'soreness', value: number) => void
}

export function SleepHavenInterior({
  log,
  updateLog,
  setMetric: _setMetric
}: SleepHavenProps) {
  const [activeMode, setActiveMode] = useState<'bed' | 'breathing' | 'soundscape' | 'routine'>('bed')
  const [showSleepModal, setShowSleepModal] = useState(false)

  const handleSaveSleep = (entry: SleepEntry) => {
    updateLog(l => ({ ...l, sleep: entry }))
    setShowSleepModal(false)
    audioSystem.playAchievement('quest')
  }

  return (
    <SceneShell
      sceneId="sleep"
      title="Thung Lũng Giấc Mơ & Sleep Haven"
      subtitle="Không gian êm dịu nâng niu giấc ngủ ngon và phục hồi năng lượng"
      icon="🌙"
      companionRole="chiikawa"
      companionMessage="Khò khò... Chúc hai bạn ngủ một giấc thật ngon và mơ giấc mơ đẹp nhé... 💤"
    >
      <div className="sleep-haven-container">
        {/* Navigation Tabs for Sleep Room */}
        <div className="sleep-tabs-row">
          <button
            className={`sleep-tab-btn ${activeMode === 'bed' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveMode('bed'); }}
          >
            🛏️ Giường Mây & Thống Kê
          </button>
          <button
            className={`sleep-tab-btn ${activeMode === 'soundscape' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveMode('soundscape'); }}
          >
            🎧 Âm Thanh ASMR & Ru Ngủ
          </button>
          <button
            className={`sleep-tab-btn ${activeMode === 'breathing' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveMode('breathing'); }}
          >
            🫁 Luyện Thở 4-7-8
          </button>
          <button
            className={`sleep-tab-btn ${activeMode === 'routine' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveMode('routine'); }}
          >
            ✨ Nghi Thức Buổi Tối
          </button>
        </div>

        {/* Mode 2: Soundscape ASMR */}
        {activeMode === 'soundscape' && (
          <div className="sleep-soundscape-scene animate-fade-in">
            <SoundscapeMixerWidget />
          </div>
        )}

        {/* Mode 1: Cloud Bed & Sleep Tracker */}
        {activeMode === 'bed' && (
          <div className="sleep-bed-scene animate-fade-in">
            <div className="sleep-atmosphere-card">
              <div className="moon-window-visual">
                <span className="celestial-moon">🌕</span>
                <span className="star-twinkle s1">⭐</span>
                <span className="star-twinkle s2">✨</span>
                <span className="star-twinkle s3">🌟</span>
              </div>
              
              <div className="sleep-summary-block">
                <h3>Thời Gian Nghỉ Ngơi Hôm Nay</h3>
                {log.sleep ? (
                  <div className="sleep-logged-stats">
                    <p>Ngủ lúc: <strong>{log.sleep.bedtime}</strong> → Dậy lúc: <strong>{log.sleep.wakeTime}</strong></p>
                    <p>Tổng thời gian: <strong>{log.sleep.nightHours} giờ</strong></p>
                    <p>Chất lượng: <strong>{'⭐'.repeat(log.sleep.quality)}</strong> ({log.sleep.quality}/5)</p>
                  </div>
                ) : (
                  <p className="no-sleep-note">Chưa ghi nhận giấc ngủ tối qua. Hãy ghi lại để theo dõi sức khỏe nhé!</p>
                )}

                <button 
                  className="open-sleep-modal-btn"
                  onClick={() => setShowSleepModal(true)}
                >
                  💤 {log.sleep ? 'Cập Nhật Giấc Ngủ' : 'Ghi Nhật Ký Giấc Ngủ'}
                </button>
              </div>
            </div>

            {/* Advanced Sleep Tracker Pro Component */}
            <div className="sleep-pro-wrapper">
              <SleepTrackerPro
                sleep={log.sleep}
                onOpenSleepModal={() => setShowSleepModal(true)}
              />
            </div>
          </div>
        )}

        {/* Mode 2: Guided Breathing 4-7-8 */}
        {activeMode === 'breathing' && (
          <div className="sleep-breathing-scene animate-fade-in">
            <div className="breathing-card-container">
              <h3>🫁 Bài Tập Thở 4-7-8 Thư Giãn Sâu</h3>
              <p>Hít vào 4 giây — Giữ hơi 7 giây — Thở ra êm ái 8 giây. Giúp xua tan mệt mỏi và dễ đi vào giấc ngủ.</p>
              <BreathingTimer />
            </div>
          </div>
        )}

        {/* Mode 3: Night Routine Checklist */}
        {activeMode === 'routine' && (
          <div className="sleep-routine-scene animate-fade-in">
            <div className="night-routine-card">
              <h3>🕯️ Danh Sách Nghi Thức Buổi Tối</h3>
              <ul className="routine-checklist">
                <li className="routine-item">
                  <span>🍵 Uống 1 cốc nước ấm hoặc trà hoa cúc</span>
                  <span className="check-badge">Khuyên Dùng</span>
                </li>
                <li className="routine-item">
                  <span>📱 Đặt điện thoại ra xa giường 30 phút trước khi ngủ</span>
                  <span className="check-badge">Tốt Cho Mắt</span>
                </li>
                <li className="routine-item">
                  <span>💬 Gửi lời chúc ngủ ngon ngọt ngào tới người thương</span>
                  <span className="check-badge">Hạnh Phúc</span>
                </li>
                <li className="routine-item">
                  <span>🌿 Bật máy khuếch tán tinh dầu oải hương thư thái</span>
                  <span className="check-badge">Dễ Chịu</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal for Logging Sleep Details */}
        {showSleepModal && (
          <SleepModal
            initialSleep={log.sleep}
            onClose={() => setShowSleepModal(false)}
            onSave={handleSaveSleep}
          />
        )}
      </div>
    </SceneShell>
  )
}
