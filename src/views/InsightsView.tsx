import { BarChart } from '../components/common/BarChart'
import { computeReadinessBreakdown, readiness } from '../utils/readiness'
import type { AppSettings, DailyLog } from '../types'

type Props = {
  logs: DailyLog[]
  settings: AppSettings
}

export function InsightsView({ logs, settings }: Props) {
  const activeLogs = logs.filter((l) => l.dayNumber <= settings.currentDay)
  const scores = activeLogs.map((l) => readiness(l, settings.waterTargetMl))
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  const sleepData = activeLogs.map((l) => ({
    label: `D${l.dayNumber}`,
    value: l.sleep?.nightHours || 0,
    max: 9,
    unit: 'h',
    color: (l.sleep?.nightHours || 0) >= 8 ? 'var(--primary)' : 'var(--warn)'
  }))

  const waterData = activeLogs.map((l) => ({
    label: `D${l.dayNumber}`,
    value: Math.round(l.hydrationMl / 100) / 10,
    max: Math.round(settings.waterTargetMl / 100) / 10 || 3,
    unit: 'L',
    color: '#67b7ff'
  }))

  const readinessTrendData = activeLogs.map((l) => ({
    label: `D${l.dayNumber}`,
    value: readiness(l, settings.waterTargetMl),
    max: 100,
    unit: 'đ',
    color: 'linear-gradient(90deg, var(--primary), #64a5ff)'
  }))

  // Current day breakdown
  const currentLog = logs.find((l) => l.dayNumber === settings.currentDay) || logs[0]
  const breakdown = computeReadinessBreakdown(currentLog, settings.waterTargetMl)

  const completedWorkouts = activeLogs.filter((l) => l.workout?.completed).length
  const sleep8hDays = activeLogs.filter((l) => (l.sleep?.nightHours || 0) >= 8).length

  return (
    <div className="view-container animate-fade-in">
      {/* 3 Overview Metric Cards */}
      <div className="grid-3">
        <section className="metric-card">
          <small>ĐIỂM READINESS TRUNG BÌNH</small>
          <h3>
            {avgScore}
            <span>/100</span>
          </h3>
          <p>Mức độ tuân thủ & sẵn sàng chung</p>
        </section>

        <section className="metric-card">
          <small>BUỔI TẬP HOÀN THÀNH</small>
          <h3>
            {completedWorkouts}
            <span>/{activeLogs.length} ngày</span>
          </h3>
          <p>Tỷ lệ hoàn thành: {Math.round((completedWorkouts / (activeLogs.length || 1)) * 100)}%</p>
        </section>

        <section className="metric-card">
          <small>NGÀY ĐẠT MỤC TIÊU NGỦ ≥ 8H</small>
          <h3>
            {sleep8hDays}
            <span> ngày</span>
          </h3>
          <p>Tái tạo thể lực & hệ thần kinh</p>
        </section>
      </div>

      {/* Readiness Trend Chart */}
      <section className="card">
        <div className="section-head">
          <div>
            <small>XU HƯỚNG TỔNG THỂ</small>
            <h3>Biểu đồ Điểm Sẵn Sàng (Readiness Trend) qua 10 Ngày</h3>
          </div>
          <span className="soft-badge">Điểm / 100</span>
        </div>
        <BarChart data={readinessTrendData} />
      </section>

      {/* Sleep & Hydration Trends */}
      <div className="grid-2">
        <section className="card">
          <div className="section-head">
            <div>
              <small>XU HƯỚNG GIẤC NGỦ</small>
              <h3>Thời lượng ngủ (Giờ)</h3>
            </div>
            <span className="soft-badge">Mục tiêu: 8h/đêm</span>
          </div>
          <BarChart data={sleepData} />
        </section>

        <section className="card">
          <div className="section-head">
            <div>
              <small>XU HƯỚNG NƯỚC UỐNG</small>
              <h3>Lượng nước bổ sung (Lít)</h3>
            </div>
            <span className="soft-badge">Mục tiêu: {(settings.waterTargetMl / 1000).toFixed(1)}L</span>
          </div>
          <BarChart data={waterData} />
        </section>
      </div>

      {/* Pillar Breakdown for Current Day */}
      <section className="card">
        <div className="section-head">
          <div>
            <small>CHI TIẾT 6 TRỤ CỘT HÔM NAY (NGÀY {settings.currentDay})</small>
            <h3>Phân tích thành phần Readiness Score</h3>
          </div>
          <span className="soft-badge">Tổng: {breakdown.total}/100</span>
        </div>

        <div className="pillar-grid">
          <div className="pillar-box">
            <span>Giấc ngủ (25%)</span>
            <strong>{breakdown.sleepScore}/100</strong>
          </div>
          <div className="pillar-box">
            <span>Dinh dưỡng (20%)</span>
            <strong>{breakdown.nutritionScore}/100</strong>
          </div>
          <div className="pillar-box">
            <span>Tập luyện (20%)</span>
            <strong>{breakdown.trainingScore}/100</strong>
          </div>
          <div className="pillar-box">
            <span>Nước uống (10%)</span>
            <strong>{breakdown.hydrationScore}/100</strong>
          </div>
          <div className="pillar-box">
            <span>Hồi phục/Thở/Kegel (10%)</span>
            <strong>{breakdown.recoveryScore}/100</strong>
          </div>
          <div className="pillar-box">
            <span>Tinh thần/Mood (10%)</span>
            <strong>{breakdown.moodScore}/100</strong>
          </div>
        </div>
      </section>

      <section className="card disclaimer-card">
        <p>💡 <strong>Ghi chú:</strong> Bảng điều khiển này phục vụ mục đích tự theo dõi thói quen, mức độ tuân thủ và hồi phục sức khỏe cá nhân, không thay thế cho chẩn đoán y khoa chuyên nghiệp.</p>
      </section>
    </div>
  )
}
