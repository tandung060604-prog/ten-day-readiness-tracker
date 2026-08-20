import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HomeInterior } from '../components/interiors/HomeInterior'
import { WaterFountainInterior } from '../components/interiors/WaterFountainInterior'
import { SleepHavenInterior } from '../components/interiors/SleepHavenInterior'
import { RestaurantInterior } from '../components/interiors/RestaurantInterior'
import { AirportInterior } from '../components/interiors/AirportInterior'
import { BeachAdventureInterior } from '../components/interiors/BeachAdventureInterior'
import { PhotoStudioInterior } from '../components/interiors/PhotoStudioInterior'
import { QuestSquareInterior } from '../components/interiors/QuestSquareInterior'
import { DEMO_COUPLE_PROFILE } from '../domain/couple/demoProfile'
import { defaultSettings, seededLogs } from '../data/plan'
import { GameStateProvider } from '../context/GameStateContext'
import type { DailyLog } from '../types'

const mockLog: DailyLog = {
  ...seededLogs[0],
  hydrationMl: 1200,
  energy: 4,
  mood: 5,
  stress: 2,
  soreness: 1,
  checklist: [
    { id: 'c1', label: 'Tập thể dục 30 phút', done: true },
    { id: 'c2', label: 'Uống đủ nước', done: false }
  ]
}

describe('Building Interiors Suite — Phase 04', () => {
  it('1. HomeInterior renders cottage living room, tabs, and sofa check-in', () => {
    const updateLog = vi.fn()
    const setMetric = vi.fn()
    const onNavigate = vi.fn()

    render(
      <HomeInterior
        log={mockLog}
        day={1}
        score={85}
        settings={defaultSettings}
        profile={DEMO_COUPLE_PROFILE}
        updateLog={updateLog}
        setMetric={setMetric}
        onNavigateToBuilding={onNavigate}
      />
    )

    expect(screen.getAllByText(/Căn Nhà Ấm Cúng/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Phòng Khách/i)).toBeInTheDocument()
    expect(screen.getByText(/Hộp Thư Tình/i)).toBeInTheDocument()

    // Test Sofa Check-in action
    const checkinBtn = screen.getByText(/Check-in Nhận \+50 Tim/i)
    fireEvent.click(checkinBtn)
    expect(screen.getByText(/Đã Check-in Ấm Áp Hôm Nay/i)).toBeInTheDocument()

    // Test tab switching
    const mailboxTab = screen.getByText(/Hộp Thư Tình/i)
    fireEvent.click(mailboxTab)
    expect(screen.getByText(/Gửi Thư Tình Đến Hòm Thư Yêu Thương/i)).toBeInTheDocument()
  })

  it('2. WaterFountainInterior visually displays hydration % and quick pour actions', () => {
    const addWater = vi.fn()

    render(
      <WaterFountainInterior
        log={mockLog}
        waterTargetMl={2000}
        addWater={addWater}
      />
    )

    expect(screen.getAllByText(/Đài Phun Nước Ma Thuật/i).length).toBeGreaterThan(0)
    expect(screen.getByText('60%')).toBeInTheDocument() // 1200 / 2000 = 60%

    // Click +300ml cup
    const pour300Btn = screen.getByText('+300 ml')
    fireEvent.click(pour300Btn)
    expect(addWater).toHaveBeenCalledWith(300)
  })

  it('3. SleepHavenInterior renders moonlit atmosphere, breathing guide, and sleep logger', () => {
    const updateLog = vi.fn()
    const setMetric = vi.fn()

    render(
      <SleepHavenInterior
        log={mockLog}
        updateLog={updateLog}
        setMetric={setMetric}
      />
    )

    expect(screen.getAllByText(/Tháp Trăng Ngủ Say/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Luyện Thở 4-7-8 Thư Giãn/i)).toBeInTheDocument()

    // Switch to breathing tab
    const breathingTab = screen.getByText(/Luyện Thở 4-7-8 Thư Giãn/i)
    fireEvent.click(breathingTab)
    expect(screen.getByText(/Bài Tập Thở 4-7-8 Thư Giãn Sâu/i)).toBeInTheDocument()
  })

  it('4. RestaurantInterior renders date idea generator and romantic wishlist', () => {
    render(<RestaurantInterior profile={DEMO_COUPLE_PROFILE} />)

    expect(screen.getAllByText(/Nhà Hàng Hẹn Hò Ánh Nến/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Bộ Quay Ý Tưởng Hẹn Hò Ngọt Ngào/i)).toBeInTheDocument()
    expect(screen.getByText(/Danh Sách Ước Mơ Hẹn Hò/i)).toBeInTheDocument()
  })

  it('5. AirportInterior renders departure board and luggage checklist', () => {
    render(<AirportInterior profile={DEMO_COUPLE_PROFILE} />)

    expect(screen.getAllByText(/Sân Bay Little Sky/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/BẢNG KHỞI HÀNH • DEPARTURE BOARD/i)).toBeInTheDocument()
    expect(screen.getByText(/Danh Sách Hành Lý Cần Chuẩn Bị/i)).toBeInTheDocument()
  })

  it('6. BeachAdventureInterior renders trip readiness milestones and beach activities', () => {
    const toggleChecklist = vi.fn()

    render(
      <BeachAdventureInterior
        log={mockLog}
        day={1}
        profile={DEMO_COUPLE_PROFILE}
        toggleChecklist={toggleChecklist}
      />
    )

    expect(screen.getAllByText(/Bãi Biển & Khu Thám Hiểm/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Hoạt Động Biển Không Thể Bỏ Lỡ/i)).toBeInTheDocument()
  })

  it('7. PhotoStudioInterior displays polaroid corkboard gallery and favorites', () => {
    render(<PhotoStudioInterior logs={seededLogs} settings={defaultSettings} />)

    expect(screen.getByText('Xưởng Ảnh Polaroid & Kỷ Niệm')).toBeInTheDocument()
    expect(screen.getByText(/Bảng Ghim Ảnh Polaroid/i)).toBeInTheDocument()
    expect(screen.getByText('Buổi Hẹn Đầu Tiên')).toBeInTheDocument()
  })

  it('8. QuestSquareInterior renders bulletin noticeboard and reward claims', () => {
    const onSelectDay = vi.fn()
    const onNavigateToTraining = vi.fn()

    render(
      <GameStateProvider>
        <QuestSquareInterior
          currentDay={1}
          logs={seededLogs}
          waterTarget={2000}
          onSelectDay={onSelectDay}
          onNavigateToTraining={onNavigateToTraining}
        />
      </GameStateProvider>
    )

    expect(screen.getByText('Quảng Trường Nhiệm Vụ')).toBeInTheDocument()
    expect(screen.getByText(/BẢNG NHIỆM VỤ THỊ TRẤN/i)).toBeInTheDocument()

    // Claim completed quest
    const claimButtons = screen.getAllByText(/Nhận Thưởng!/i)
    expect(claimButtons.length).toBeGreaterThan(0)
    fireEvent.click(claimButtons[0])
    expect(screen.getAllByText(/ĐÃ NHẬN ✅/i).length).toBeGreaterThan(0)
  })
})
