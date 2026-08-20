import { useState } from 'react'
import { SceneShell } from './SceneShell'
import { CoupleHeroCard } from '../couple/CoupleHeroCard'
import { getRelationshipDays, getPartnerName, getMilestoneProgress } from '../../domain/couple/selectors'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { AppSettings, DailyLog } from '../../types'
import type { CoupleProfile } from '../../domain/couple/types'

interface HomeInteriorProps {
  log: DailyLog
  day: number
  score: number
  settings: AppSettings
  profile: CoupleProfile
  updateLog: (fn: (current: DailyLog) => DailyLog) => void
  setMetric: (key: 'energy' | 'mood' | 'stress' | 'soreness', value: number) => void
  onNavigateToBuilding?: (buildingId: string) => void
}

export function HomeInterior({
  log,
  day,
  score,
  profile,
  updateLog: _updateLog,
  setMetric,
  onNavigateToBuilding
}: HomeInteriorProps) {
  const [activeTab, setActiveTab] = useState<'living' | 'mailbox' | 'bookshelf'>('living')
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [letterDraft, setLetterDraft] = useState('')
  const [sentLetters, setSentLetters] = useState<string[]>([
    'Chúc em yêu một ngày mới tràn ngập niềm vui và nụ cười rạng rỡ! ✨'
  ])

  const relationshipDays = getRelationshipDays(profile)
  const milestone = getMilestoneProgress(profile)
  const partnerName = getPartnerName(profile, 'chiikawa')

  const handleSofaCheckIn = () => {
    audioSystem.playAchievement('quest')
    triggerConfetti()
    setCheckedInToday(true)
  }

  const handleSendLetter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!letterDraft.trim()) return
    audioSystem.playClick('wood')
    setSentLetters([letterDraft.trim(), ...sentLetters])
    setLetterDraft('')
  }

  return (
    <SceneShell
      sceneId="home"
      title="Căn Nhà Ấm Cúng"
      subtitle="Tổ ấm nhỏ lưu giữ từng khoảnh khắc ngọt ngào của đôi mình"
      icon="🏡"
      companionRole="chiikawa"
      companionMessage={`Chào mừng về nhà! Hôm nay là ngày thứ ${relationshipDays} bên nhau rồi đấy!`}
    >
      <div className="home-interior-grid">
        {/* Navigation Tabs for Cottage Rooms/Zones */}
        <div className="home-room-tabs">
          <button 
            className={`home-tab-btn ${activeTab === 'living' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('living'); }}
          >
            🛋️ Phòng Khách
          </button>
          <button 
            className={`home-tab-btn ${activeTab === 'mailbox' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('mailbox'); }}
          >
            💌 Hộp Thư Tình ({sentLetters.length})
          </button>
          <button 
            className={`home-tab-btn ${activeTab === 'bookshelf' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('bookshelf'); }}
          >
            📚 Kệ Kỷ Niệm
          </button>
        </div>

        {/* Room 1: Living Room Focal Area */}
        {activeTab === 'living' && (
          <div className="home-living-scene animate-fade-in">
            {/* Couple Hero Status Card */}
            <CoupleHeroCard profile={profile} />

            {/* Living Room Focal Interactive Objects */}
            <div className="cottage-focal-objects">
              {/* Object 1: Cozy Sofa Check-in */}
              <div className="cottage-object-card sofa-card">
                <div className="cottage-object-header">
                  <span className="cottage-object-icon">🛋️</span>
                  <div>
                    <h3>Sofa Thư Giãn Cùng {partnerName}</h3>
                    <p>Ngồi tựa vào nhau chia sẻ cảm xúc hôm nay</p>
                  </div>
                </div>

                <div className="cottage-mood-selectors">
                  <div className="mood-chip-group">
                    <label>Tâm trạng hôm nay:</label>
                    <div className="mood-buttons">
                      {[
                        { label: 'Rất vui 🥰', val: 5 },
                        { label: 'Hạnh phúc 😊', val: 4 },
                        { label: 'Bình yên 🌿', val: 3 },
                        { label: 'Hơi mệt 🥱', val: 2 }
                      ].map(m => (
                        <button
                          key={m.val}
                          className={`metric-pill ${log.mood === m.val ? 'selected' : ''}`}
                          onClick={() => setMetric('mood', m.val)}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mood-chip-group">
                    <label>Mức năng lượng:</label>
                    <div className="mood-buttons">
                      {[
                        { label: 'Tràn đầy ⚡ 5', val: 5 },
                        { label: 'Tốt 🌟 4', val: 4 },
                        { label: 'Vừa đủ 🍵 3', val: 3 },
                        { label: 'Cần sạc 🔋 2', val: 2 }
                      ].map(e => (
                        <button
                          key={e.val}
                          className={`metric-pill ${log.energy === e.val ? 'selected' : ''}`}
                          onClick={() => setMetric('energy', e.val)}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className={`cottage-checkin-btn ${checkedInToday ? 'done' : ''}`}
                  onClick={handleSofaCheckIn}
                  disabled={checkedInToday}
                >
                  {checkedInToday ? '✅ Đã Check-in Ấm Áp Hôm Nay' : '💖 Check-in Nhận +50 Tim'}
                </button>
              </div>

              {/* Object 2: Hearth Fireplace & Milestone Progress */}
              <div className="cottage-object-card milestone-card">
                <div className="cottage-object-header">
                  <span className="cottage-object-icon">🔥</span>
                  <div>
                    <h3>Ngọn Lửa Tình Yêu</h3>
                    <p>Cột mốc tiếp theo: <strong>{milestone.targetDays} ngày</strong></p>
                  </div>
                </div>

                <div className="milestone-bar-container">
                  <div className="milestone-progress-fill" style={{ width: `${milestone.progressPercentage}%` }} />
                </div>
                <div className="milestone-footer-label">
                  <span>{relationshipDays} ngày</span>
                  <span>Còn {milestone.daysRemaining} ngày nữa</span>
                </div>

                {onNavigateToBuilding && (
                  <div className="cottage-quick-links">
                    <button onClick={() => onNavigateToBuilding('water')} className="cottage-link-chip">
                      ⛲ Uống Nước
                    </button>
                    <button onClick={() => onNavigateToBuilding('sleep')} className="cottage-link-chip">
                      🌙 Giấc Ngủ
                    </button>
                    <button onClick={() => onNavigateToBuilding('market')} className="cottage-link-chip">
                      🥖 Đi Chợ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Room 2: Love Mailbox */}
        {activeTab === 'mailbox' && (
          <div className="home-mailbox-scene animate-fade-in">
            <div className="mailbox-card">
              <h3>💌 Gửi Thư Tình Đến Hòm Thư Yêu Thương</h3>
              <form onSubmit={handleSendLetter} className="mailbox-form">
                <textarea
                  value={letterDraft}
                  onChange={(e) => setLetterDraft(e.target.value)}
                  placeholder={`Gửi đôi lời nhắn gửi ngọt ngào tới ${partnerName}...`}
                  rows={3}
                />
                <button type="submit" className="send-letter-btn">
                  📮 Thả Thư Vào Hòm
                </button>
              </form>

              <div className="letter-history-list">
                <h4>📜 Những Bức Thư Đã Gửi</h4>
                {sentLetters.map((msg, idx) => (
                  <div key={idx} className="letter-item">
                    <p>"{msg}"</p>
                    <small>Ngày thứ {relationshipDays} • Từ trái tim 💖</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Room 3: Bookshelf & Timeline */}
        {activeTab === 'bookshelf' && (
          <div className="home-bookshelf-scene animate-fade-in">
            <div className="bookshelf-card">
              <h3>📚 Sách Biên Niên Sử Tình Yêu</h3>
              <p>Mỗi trang sách là một chặng đường đáng nhớ mà hai bạn đã cùng nhau đi qua.</p>
              
              <div className="timeline-spine-list">
                <div className="timeline-chapter">
                  <span className="chapter-badge">🌱 Khởi Đầu</span>
                  <h4>Ngày Đầu Tiên Bên Nhau</h4>
                  <p>{profile.relationshipStartDate || '06/06/2024'} — Khoảnh khắc hai trái tim bắt đầu chung nhịp đập.</p>
                </div>
                <div className="timeline-chapter">
                  <span className="chapter-badge">🏖️ Hành Trình</span>
                  <h4>Kế Hoạch Khám Phá Nha Trang</h4>
                  <p>10 ngày cùng rèn luyện, chuẩn bị cho chuyến phiêu lưu biển xanh cát trắng.</p>
                </div>
                <div className="timeline-chapter">
                  <span className="chapter-badge">✨ Hiện Tại</span>
                  <h4>Ngày Thứ {relationshipDays} Hạnh Phúc</h4>
                  <p>Tiếp tục viết nên những câu chuyện tuyệt vời mỗi ngày trong Little Days.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SceneShell>
  )
}
