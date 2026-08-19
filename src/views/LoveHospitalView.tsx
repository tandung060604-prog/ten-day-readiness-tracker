import { useState } from 'react'
import { ChiikawaSVG } from '../components/common/ChiikawaSVG'
import { GameIcon } from '../components/common/GameIcons'
import { audioSystem } from '../game/systems/GameAudioSystem'
import { speakVietnamese } from '../utils/vietnameseAudio'
import {
  calculateCycleInfo,
  getMonthlyCalendarGrid,
  loadCycleSettings,
  saveCycleSettings,
  loadDailyLogs,
  saveDailyLog,
  formatVNDate
} from '../utils/menstrualEngine'
import type { DayMenstrualLog, MenstrualCycleSettings } from '../utils/menstrualEngine'

const SYMPTOMS_LIST = [
  { id: 'cramps', label: 'Đau bụng dưới', icon: '😣' },
  { id: 'backache', label: 'Mỏi lưng', icon: '💆‍♀️' },
  { id: 'breast_tender', label: 'Căng ngực', icon: '🌸' },
  { id: 'headache', label: 'Đau đầu', icon: '💤' },
  { id: 'sweet_craving', label: 'Thèm ngọt', icon: '🍫' },
  { id: 'bloating', label: 'Đầy hơi nhẹ', icon: '🎈' },
  { id: 'fatigue', label: 'Hơi mệt mỏi', icon: '🛌' },
  { id: 'skin_glow', label: 'Da mịn màng', icon: '✨' }
]

const MOODS_LIST = [
  { id: 'happy', label: 'Vui vẻ', icon: '🥰' },
  { id: 'need_hugs', label: 'Cần được ôm', icon: '🤗' },
  { id: 'sensitive', label: 'Dễ xúc động', icon: '🥺' },
  { id: 'calm', label: 'Thư thái', icon: '🍃' },
  { id: 'romantic', label: 'Yêu thương', icon: '💖' },
  { id: 'irritated', label: 'Hơi cáu nhẹ', icon: '😤' }
]

export function LoveHospitalView() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'haruGuide' | 'calendar' | 'settings'>('tracker')
  const [settings, setSettings] = useState<MenstrualCycleSettings>(() => loadCycleSettings())
  const [dailyLogs, setDailyLogs] = useState<Record<string, DayMenstrualLog>>(() => loadDailyLogs())
  const [todayLog, setTodayLog] = useState<DayMenstrualLog>(() => {
    const logs = loadDailyLogs()
    return (
      logs['2026-08-19'] || {
        date: '2026-08-19',
        symptoms: ['backache', 'sweet_craving'],
        moods: ['need_hugs', 'romantic'],
        waterGlasses: 6,
        warmTeaCount: 2,
        tookSupplements: true,
        note: ''
      }
    )
  })

  const [calMonthOffset, setCalMonthOffset] = useState(7) // 7 = August 2026
  const [saveToast, setSaveToast] = useState<string | null>(null)

  // Current Cycle info
  const cycleInfo = calculateCycleInfo('2026-08-19', settings)

  const handleToggleSymptom = (id: string) => {
    audioSystem.playClick('soft')
    setTodayLog((prev) => {
      const exists = prev.symptoms.includes(id)
      const nextSymptoms = exists ? prev.symptoms.filter((s) => s !== id) : [...prev.symptoms, id]
      const updated = { ...prev, symptoms: nextSymptoms }
      saveDailyLog(updated)
      setDailyLogs(loadDailyLogs())
      return updated
    })
  }

  const handleToggleMood = (id: string) => {
    audioSystem.playClick('soft')
    setTodayLog((prev) => {
      const exists = prev.moods.includes(id)
      const nextMoods = exists ? prev.moods.filter((m) => m !== id) : [...prev.moods, id]
      const updated = { ...prev, moods: nextMoods }
      saveDailyLog(updated)
      setDailyLogs(loadDailyLogs())
      return updated
    })
  }

  const handleWaterChange = (delta: number) => {
    audioSystem.playClick('soft')
    setTodayLog((prev) => {
      const count = Math.max(0, Math.min(15, prev.waterGlasses + delta))
      const updated = { ...prev, waterGlasses: count }
      saveDailyLog(updated)
      setDailyLogs(loadDailyLogs())
      return updated
    })
  }

  const handleWarmTeaChange = (delta: number) => {
    audioSystem.playClick('soft')
    setTodayLog((prev) => {
      const count = Math.max(0, Math.min(10, prev.warmTeaCount + delta))
      const updated = { ...prev, warmTeaCount: count }
      saveDailyLog(updated)
      setDailyLogs(loadDailyLogs())
      return updated
    })
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    audioSystem.playClick('enter')
    saveCycleSettings(settings)
    setSaveToast('Đã cập nhật thuật toán chu kỳ kinh nguyệt thành công!')
    speakVietnamese('Đã lưu cài đặt chu kỳ thành công!', { charVoice: 'usagi' })
    setTimeout(() => setSaveToast(null), 3000)
  }

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const calendarGrid = getMonthlyCalendarGrid(2026, calMonthOffset, settings, dailyLogs)

  return (
    <div className="love-hospital-view-container animate-fade-in">
      {/* ── TOP HERO BANNER ── */}
      <div className="hospital-hero-card">
        <div className="hospital-hero-left">
          <div className="hospital-badge-chip">
            <span>🏥 BỆNH VIỆN TÌNH YÊU · FLO CYCLE HEALTH</span>
          </div>
          <h1 className="hospital-hero-title">Sức Khỏe &amp; Chu Kỳ Của Mai Trang 🌸</h1>
          <p className="hospital-hero-subtitle">
            Theo dõi chu kỳ kinh nguyệt khoa học chuẩn <strong>Flo App</strong>, dự đoán ngày rụng trứng, cảnh báo lịch trình và cẩm nang chăm sóc cho <strong>Haru</strong>.
          </p>
        </div>

        <div className="hospital-hero-mascots">
          <div className="mascot-doctor-box">
            <ChiikawaSVG character="chiikawa" size={54} />
            <span className="doctor-hat">🩺</span>
          </div>
          <span className="doctor-heart">💖</span>
          <div className="mascot-patient-box">
            <ChiikawaSVG character="usagi" size={54} />
            <span className="flower-pin">🌸</span>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="hospital-nav-tabs">
        <button
          className={`hospital-tab-btn ${activeTab === 'tracker' ? 'tab-active' : ''}`}
          onClick={() => { audioSystem.playClick('soft'); setActiveTab('tracker') }}
        >
          <span>🌸 Vòng Tròn Chu Kỳ (Flo)</span>
        </button>
        <button
          className={`hospital-tab-btn ${activeTab === 'haruGuide' ? 'tab-active' : ''}`}
          onClick={() => { audioSystem.playClick('soft'); setActiveTab('haruGuide') }}
        >
          <span>🐹 Cẩm Nang Cho Haru</span>
        </button>
        <button
          className={`hospital-tab-btn ${activeTab === 'calendar' ? 'tab-active' : ''}`}
          onClick={() => { audioSystem.playClick('soft'); setActiveTab('calendar') }}
        >
          <span>📅 Lịch 12 Tháng</span>
        </button>
        <button
          className={`hospital-tab-btn ${activeTab === 'settings' ? 'tab-active' : ''}`}
          onClick={() => { audioSystem.playClick('soft'); setActiveTab('settings') }}
        >
          <span>⚙️ Cài Đặt Thuật Toán</span>
        </button>
      </div>

      {saveToast && (
        <div className="hospital-toast-pill animate-pop">
          <span>✨ {saveToast}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
         TAB 1: FLO CYCLE TRACKER & TODAY'S SYMPTOMS
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tracker' && (
        <div className="hospital-tracker-tab-grid animate-slide-up">
          {/* 1. FLO CYCLE RADIAL DIAL HERO */}
          <div className="flo-cycle-dial-card" style={{ borderColor: cycleInfo.color }}>
            <div className="cycle-dial-container">
              {/* Outer Glowing Ring */}
              <div
                className="cycle-dial-ring"
                style={{
                  background: `conic-gradient(${cycleInfo.color} ${(cycleInfo.dayInCycle / cycleInfo.totalCycleDays) * 360}deg, #f1f3f5 0deg)`
                }}
              >
                <div className="cycle-dial-inner-circle">
                  <span className="cycle-phase-icon">{cycleInfo.icon}</span>
                  <div className="cycle-day-number">
                    <span>Ngày</span>
                    <strong>{cycleInfo.dayInCycle}</strong>
                    <small>/{cycleInfo.totalCycleDays}</small>
                  </div>
                  <span className="cycle-phase-tag" style={{ backgroundColor: cycleInfo.color }}>
                    {cycleInfo.phase === 'luteal' ? 'Hoàng Thể (PMS)' : cycleInfo.phase === 'menstrual' ? 'Kỳ Kinh' : 'Nang Trứng'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dial Details */}
            <div className="cycle-dial-meta-info">
              <h2 className="cycle-phase-title" style={{ color: cycleInfo.color }}>{cycleInfo.name}</h2>
              <p className="cycle-phase-desc">{cycleInfo.subtitle}</p>

              <div className="cycle-stat-pills-row">
                <div className="cycle-pill-item">
                  <span className="pill-lbl">Kỳ kinh kế tiếp</span>
                  <strong className="pill-val alert-pink">{formatVNDate(cycleInfo.nextPeriodDate)}</strong>
                  <small className="pill-note">({cycleInfo.daysUntilNextPeriod} ngày nữa)</small>
                </div>

                <div className="cycle-pill-item">
                  <span className="pill-lbl">Khả năng thụ thai</span>
                  <strong className="pill-val">{cycleInfo.pregnancyChance}</strong>
                  <small className="pill-note">Giai đoạn an toàn</small>
                </div>

                <div className="cycle-pill-item">
                  <span className="pill-lbl">Ngày rụng trứng</span>
                  <strong className="pill-val">{formatVNDate(cycleInfo.ovulationDate)}</strong>
                  <small className="pill-note">Đã qua</small>
                </div>
              </div>

              {/* NHA TRANG FLIGHT PERIOD ALERT */}
              <div className="nhatrang-period-alert-box animate-bounce-gentle">
                <span className="alert-bell-icon">✈️⚠️</span>
                <div>
                  <strong>Cảnh Báo Chuyến Bay Nha Trang 27/08:</strong>
                  <p>Kỳ kinh dự kiến rơi đúng vào ngày <strong>27/08/2026</strong>. Cả Haru &amp; Mai Trang nhớ chuẩn bị sẵn băng vệ sinh, túi sưởi ấm bụng và đồ bơi tối màu nhé!</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. DAILY LOGGING (SYMPTOMS & MOODS) */}
          <div className="symptoms-logging-card">
            <div className="card-section-header">
              <span className="sec-icon">📝</span>
              <h3>Ghi Nhận Triệu Chứng Hôm Nay (19/08)</h3>
            </div>

            {/* Physical Symptoms */}
            <div className="symptoms-group">
              <label className="group-label">Dấu hiệu thể chất:</label>
              <div className="symptoms-chips-grid">
                {SYMPTOMS_LIST.map((sym) => {
                  const isSelected = todayLog.symptoms.includes(sym.id)
                  return (
                    <button
                      key={sym.id}
                      className={`symptom-chip-btn ${isSelected ? 'chip-active' : ''}`}
                      onClick={() => handleToggleSymptom(sym.id)}
                    >
                      <span className="chip-icon">{sym.icon}</span>
                      <span className="chip-text">{sym.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Moods */}
            <div className="symptoms-group">
              <label className="group-label">Tâm trạng &amp; Cảm xúc:</label>
              <div className="symptoms-chips-grid">
                {MOODS_LIST.map((m) => {
                  const isSelected = todayLog.moods.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      className={`symptom-chip-btn mood-chip ${isSelected ? 'chip-active' : ''}`}
                      onClick={() => handleToggleMood(m.id)}
                    >
                      <span className="chip-icon">{m.icon}</span>
                      <span className="chip-text">{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Water & Warm Tea Counter */}
            <div className="drink-counter-row">
              <div className="drink-box">
                <span className="drink-icon">💧</span>
                <div className="drink-info">
                  <strong>Nước ấm</strong>
                  <small>{todayLog.waterGlasses * 250}ml / 2500ml</small>
                </div>
                <div className="drink-btns">
                  <button onClick={() => handleWaterChange(-1)}>-</button>
                  <span>{todayLog.waterGlasses}</span>
                  <button onClick={() => handleWaterChange(1)}>+</button>
                </div>
              </div>

              <div className="drink-box">
                <span className="drink-icon">🍵</span>
                <div className="drink-info">
                  <strong>Trà gừng / Hoa cúc</strong>
                  <small>{todayLog.warmTeaCount} cốc ấm bụng</small>
                </div>
                <div className="drink-btns">
                  <button onClick={() => handleWarmTeaChange(-1)}>-</button>
                  <span>{todayLog.warmTeaCount}</span>
                  <button onClick={() => handleWarmTeaChange(1)}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
         TAB 2: HARU'S CARE GUIDE (FOR BOYFRIEND DŨNG)
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'haruGuide' && (
        <div className="hospital-haru-guide-view animate-slide-up">
          <div className="haru-guide-hero-banner">
            <div className="guide-hero-badge">
              <span>🐹 BÍ KÍP YÊU THƯƠNG DÀNH RIÊNG CHO HARU</span>
            </div>
            <h2>Cách Chăm Sóc Mai Trang Chu Đáo &amp; Ngọt Ngào Nhất 💖</h2>
            <p>Trong những ngày nhạy cảm và sắp tới kỳ kinh, một chút quan tâm ấm áp của Haru sẽ là liều thuốc xoa dịu tuyệt vời nhất cho bạn gái!</p>
          </div>

          <div className="care-guide-cards-grid">
            <div className="care-card care-tea">
              <span className="care-card-icon">🫖</span>
              <h3>1. Nước Ấm &amp; Trà Gừng Mật Ong</h3>
              <p>Chủ động mang nước ấm cho Mai Trang, pha trà hoa cúc hoặc trà gừng mật ong để làm ấm tử cung và giảm co thắt bụng dưới.</p>
            </div>

            <div className="care-card care-massage">
              <span className="care-card-icon">💆‍♂️</span>
              <h3>2. Massage &amp; Chườm Ấm</h3>
              <p>Nhẹ nhàng xoa bóp vùng thắt lưng và bả vai. Chuẩn bị túi chườm ấm để Mai Trang áp lên bụng dưới khi thấy tức mỏi.</p>
            </div>

            <div className="care-card care-sweets">
              <span className="care-card-icon">🍫</span>
              <h3>3. Món Ngọt &amp; Đồ Ăn Yêu Thích</h3>
              <p>Mua socola đen, bánh pudding sữa, dâu tây hoặc món bánh ngọt Mai Trang yêu thích để bổ sung dopamine tăng cảm giác vui vẻ.</p>
            </div>

            <div className="care-card care-love">
              <span className="care-card-icon">🫂</span>
              <h3>4. Nhường Nhịn &amp; Ôm Thật Nhiều</h3>
              <p>Khi hormone thay đổi, Mai Trang có thể dễ xúc động hoặc cáu nhẹ. Haru hãy luôn mỉm cười, lắng nghe và ôm bạn gái vào lòng nhé!</p>
            </div>
          </div>

          {/* Special Nha Trang Trip Packing Checklist for Boyfriend */}
          <div className="haru-packing-checklist-card">
            <div className="card-header-row">
              <span className="header-icon">🎒</span>
              <h3>Checklist Hành Lý Đi Nha Trang 27/08 (Haru Nhắc Nhở)</h3>
            </div>
            <ul className="haru-checklist-ul">
              <li>✅ <strong>Băng vệ sinh &amp; Tampon:</strong> Nhắc Mai Trang mang đủ loại ban ngày, ban đêm và loại siêu mỏng đi biển.</li>
              <li>✅ <strong>Túi sưởi mini dán bụng:</strong> Mua sẵn 3-5 miếng dán nhiệt giữ ấm bụng khi di chuyển trên máy bay.</li>
              <li>✅ <strong>Thuốc giảm đau bụng kinh (Drotavet / Paracetamol):</strong> Mang theo dự phòng trong balo cá nhân.</li>
              <li>✅ <strong>Đồ bơi &amp; Trang phục tối màu:</strong> Ưu tiên váy maxi mềm, quần shorts cotton co giãn thoáng mát.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
         TAB 3: 12-MONTH FLO MENSTRUAL CALENDAR
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'calendar' && (
        <div className="hospital-calendar-view animate-slide-up">
          <div className="calendar-controls-card">
            <div className="month-nav-row">
              <button
                className="month-nav-btn"
                onClick={() => setCalMonthOffset((prev) => Math.max(0, prev - 1))}
              >
                ← Tháng Trước
              </button>

              <div className="current-month-heading">
                <h2>{monthNames[calMonthOffset]} 2026</h2>
                <small>Lịch Dự Đoán Chu Kỳ Kinh Nguyệt</small>
              </div>

              <button
                className="month-nav-btn"
                onClick={() => setCalMonthOffset((prev) => Math.min(11, prev + 1))}
              >
                Tháng Sau →
              </button>
            </div>

            {/* Legend Bar */}
            <div className="calendar-legend-bar">
              <span className="leg-item"><i className="leg-dot leg-period-actual" /> Kỳ kinh thực tế (29/07)</span>
              <span className="leg-item"><i className="leg-dot leg-period-predict" /> Dự kiến có kinh (27/08)</span>
              <span className="leg-item"><i className="leg-dot leg-ovulation" /> Rụng trứng &amp; Thụ thai</span>
              <span className="leg-item"><i className="leg-dot leg-flight" /> ✈️ 27/08 Bay Nha Trang</span>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-table-wrap">
              <div className="calendar-week-headers">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
              </div>

              <div className="calendar-days-grid">
                {calendarGrid.map((day, idx) => (
                  <div
                    key={idx}
                    className={`cal-day-cell ${!day.isCurrentMonth ? 'day-other-month' : ''} ${day.isToday ? 'day-today' : ''} ${day.isPeriod ? 'day-period-actual' : ''} ${day.isPredictedPeriod ? 'day-period-predict' : ''} ${day.isOvulation ? 'day-ovulation' : ''} ${day.isFertile ? 'day-fertile' : ''} ${day.isNhaTrangFlight ? 'day-nhatrang-flight' : ''}`}
                  >
                    <span className="cal-day-num">{day.dayNumber}</span>
                    {day.isPeriod && <span className="cal-cell-badge">🩸 Kinh</span>}
                    {day.isPredictedPeriod && <span className="cal-cell-badge predict">🩸 Dự kiến</span>}
                    {day.isOvulation && <span className="cal-cell-badge ovu">🌸 Rụng trứng</span>}
                    {day.isNhaTrangFlight && <span className="cal-cell-badge flight">✈️ Nha Trang</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
         TAB 4: CYCLE ALGORITHM SETTINGS
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="hospital-settings-view animate-slide-up">
          <form className="cycle-settings-form-card" onSubmit={handleSaveSettings}>
            <div className="form-header">
              <span className="form-icon">⚙️</span>
              <div>
                <h2>Cấu Hình Thuật Toán Chu Kỳ Flo</h2>
                <p>Điều chỉnh các thông số sinh học để dự đoán chính xác nhất từng ngày cho Mai Trang.</p>
              </div>
            </div>

            <div className="form-fields-grid">
              <div className="form-field-item">
                <label>Ngày bắt đầu kỳ kinh gần nhất:</label>
                <input
                  type="date"
                  value={settings.lastPeriodStartDate}
                  onChange={(e) => setSettings({ ...settings, lastPeriodStartDate: e.target.value })}
                  required
                />
                <small>Mặc định: 29/07/2026</small>
              </div>

              <div className="form-field-item">
                <label>Độ dài chu kỳ trung bình (ngày):</label>
                <input
                  type="number"
                  min={21}
                  max={45}
                  value={settings.cycleLength}
                  onChange={(e) => setSettings({ ...settings, cycleLength: Number(e.target.value) })}
                  required
                />
                <small>Chu kỳ chuẩn: 28 - 30 ngày (Hiện tại: 29 ngày)</small>
              </div>

              <div className="form-field-item">
                <label>Số ngày hành kinh trung bình:</label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={settings.periodDuration}
                  onChange={(e) => setSettings({ ...settings, periodDuration: Number(e.target.value) })}
                  required
                />
                <small>Thời gian ra kinh thông thường: 4 - 6 ngày</small>
              </div>

              <div className="form-field-item">
                <label>Thời lượng pha hoàng thể (Luteal Phase):</label>
                <input
                  type="number"
                  min={10}
                  max={18}
                  value={settings.lutealPhaseDuration}
                  onChange={(e) => setSettings({ ...settings, lutealPhaseDuration: Number(e.target.value) })}
                  required
                />
                <small>Khoảng cách từ ngày rụng trứng tới kỳ kinh mới (Chuẩn: 14 ngày)</small>
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="save-cycle-btn">
                <span>LƯU CÀI ĐẶT THUẬT TOÁN 💾</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
