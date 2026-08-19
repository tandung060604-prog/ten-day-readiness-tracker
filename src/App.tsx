import { useEffect, useRef, useState } from 'react'
import { AppLogo } from './components/common/AppLogo'
import { DaySelector } from './components/common/DaySelector'
import { MealModal } from './components/modals/MealModal'
import { ExerciseModal } from './components/modals/ExerciseModal'
import { LockScreen } from './components/security/LockScreen'
import { LandingPage } from './views/LandingPage'
import { TodayView } from './views/TodayView'
import { PlanView } from './views/PlanView'
import { MealsView } from './views/MealsView'
import { TrainingView } from './views/TrainingView'
import { JournalView } from './views/JournalView'
import { InsightsView } from './views/InsightsView'
import { SettingsView } from './views/SettingsView'
import { clearPhotos } from './db/photos'
import { defaultSettings, seededLogs, trainingPlan } from './data/plan'
import { readiness } from './utils/readiness'
import type { AppSettings, DailyLog, Exercise, MealEntry } from './types'

const STORAGE_KEY = 'ten-day-readiness-v1'
const SETTINGS_KEY = 'ten-day-readiness-settings-v1'
const LANDING_SEEN_KEY = 'ten-day-readiness-landing-v1'

export const TABS = [
  { id: 'Today', label: 'Hôm nay', icon: '◉' },
  { id: '10-Day Plan', label: 'Lộ trình 10 ngày', icon: '▦' },
  { id: 'Meals', label: 'Bữa ăn', icon: '🥗' },
  { id: 'Training', label: 'Tập luyện', icon: '⚡' },
  { id: 'Journal', label: 'Nhật ký', icon: '✎' },
  { id: 'Insights', label: 'Thống kê', icon: '📊' },
  { id: 'Settings', label: 'Cài đặt', icon: '⚙' }
] as const

export type TabId = typeof TABS[number]['id']

function loadLogs(): DailyLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return seededLogs
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) && parsed.length ? parsed : seededLogs
  } catch {
    return seededLogs
  }
}

function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    if (!data) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(data) }
  } catch {
    return defaultSettings
  }
}

export function App() {
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    return !localStorage.getItem(LANDING_SEEN_KEY)
  })
  const [tab, setTab] = useState<TabId>('Today')
  const [logs, setLogs] = useState<DailyLog[]>(loadLogs)
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [showAddMealModal, setShowAddMealModal] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showMobileMoreMenu, setShowMobileMoreMenu] = useState(false)

  // Security Lock State
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return !!(settings.isLockEnabled && settings.pinHash)
  })
  const lastActiveTimeRef = useRef<number>(Date.now())

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  }, [logs])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    document.documentElement.dataset.theme = settings.theme
  }, [settings])

  // Auto-lock on app minimize / visibility change or inactivity
  useEffect(() => {
    if (!settings.isLockEnabled || !settings.pinHash) {
      setIsLocked(false)
      return
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastActiveTimeRef.current = Date.now()
        // If 0 minutes (immediate lock), lock right away
        if ((settings.autoLockMinutes ?? 1) === 0) {
          setIsLocked(true)
        }
      } else {
        const inactiveDurationMs = Date.now() - lastActiveTimeRef.current
        const timeoutMs = (settings.autoLockMinutes ?? 1) * 60 * 1000
        if (inactiveDurationMs >= timeoutMs) {
          setIsLocked(true)
        }
      }
    }

    const handleUserActivity = () => {
      lastActiveTimeRef.current = Date.now()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('touchstart', handleUserActivity, { passive: true })
    window.addEventListener('mousemove', handleUserActivity, { passive: true })
    window.addEventListener('keydown', handleUserActivity, { passive: true })

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('touchstart', handleUserActivity)
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
    }
  }, [settings.isLockEnabled, settings.pinHash, settings.autoLockMinutes])

  const day = Math.min(10, Math.max(1, settings.currentDay))
  const log = logs.find((l) => l.dayNumber === day) || logs[day - 1]
  const plan = trainingPlan[day - 1]
  const currentScore = readiness(log, settings.waterTargetMl)

  const updateLog = (fn: (current: DailyLog) => DailyLog) => {
    setLogs((all) => all.map((l) => (l.dayNumber === day ? fn(l) : l)))
  }

  const toggleChecklist = (id: string) => {
    updateLog((l) => ({
      ...l,
      checklist: l.checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    }))
  }

  const addWater = (amount: number) => {
    updateLog((l) => ({
      ...l,
      hydrationMl: Math.max(0, l.hydrationMl + amount)
    }))
  }

  const toggleWorkout = () => {
    updateLog((l) => ({
      ...l,
      workout: {
        title: l.workout?.title || plan.title,
        completed: !l.workout?.completed
      }
    }))
  }

  const setMetric = (key: 'energy' | 'mood' | 'stress' | 'soreness', value: number) => {
    updateLog((l) => ({ ...l, [key]: value }))
  }

  const handleSaveQuickMeal = (meal: MealEntry) => {
    updateLog((l) => ({
      ...l,
      meals: [...l.meals, meal]
    }))
  }

  const exportData = () => {
    const data = JSON.stringify(
      { version: 1, exportedAt: new Date().toISOString(), settings, logs },
      null,
      2
    )
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `readiness-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file: File | undefined) => {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (parsed.logs && Array.isArray(parsed.logs)) setLogs(parsed.logs)
      if (parsed.settings) setSettings({ ...defaultSettings, ...parsed.settings })
      alert('Nhập dữ liệu sao lưu thành công!')
    } catch {
      alert('Tệp sao lưu không hợp lệ!')
    }
  }

  const resetData = async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu và ảnh lưu trữ cục bộ?')) return
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SETTINGS_KEY)
    await clearPhotos()
    setLogs(seededLogs)
    setSettings(defaultSettings)
    setIsLocked(false)
    alert('Đã xóa toàn bộ dữ liệu thành công.')
  }

  const appTitle = settings.privacyMode ? 'Daily Wellness Tracker' : settings.title

  // If locked, render LockScreen
  if (isLocked && settings.pinHash) {
    return (
      <LockScreen
        storedPinHash={settings.pinHash}
        enableBiometrics={settings.enableBiometrics ?? true}
        appTitle={appTitle}
        onUnlock={() => setIsLocked(false)}
      />
    )
  }

  // If viewing Landing Page
  if (showLanding) {
    return (
      <LandingPage
        onEnterApp={() => {
          localStorage.setItem(LANDING_SEEN_KEY, 'true')
          setShowLanding(false)
        }}
      />
    )
  }

  return (
    <div className="app-shell">
      {/* Sidebar for Desktop */}
      <aside className="sidebar">
        <div className="brand" onClick={() => setShowLanding(true)} style={{ cursor: 'pointer' }} title="Xem trang giới thiệu Landing Page">
          <AppLogo size={38} showText subtitle="Local-First · Sẵn Sàng 10 Ngày" />
        </div>

        <nav className="sidebar-nav">
          {TABS.map((t) => (
            <button
              className={`sidebar-nav-btn ${tab === t.id ? 'active' : ''}`}
              key={t.id}
              onClick={() => setTab(t.id)}
            >
              <span className="sidebar-icon">{t.icon}</span>
              <span className="sidebar-label">{t.label}</span>
            </button>
          ))}
          <button
            className="sidebar-nav-btn"
            onClick={() => setShowLanding(true)}
            style={{ marginTop: '10px', color: 'var(--primary)' }}
          >
            <span className="sidebar-icon">✦</span>
            <span className="sidebar-label">Trang giới thiệu</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="privacy-chip">● Bộ nhớ cục bộ</div>
          <small>Ảnh và thông tin không rời khỏi máy của bạn.</small>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-title-group">
            <small className="eyebrow">{appTitle}</small>
            <h1>{TABS.find((t) => t.id === tab)?.label || tab}</h1>
          </div>

          <div className="top-actions">
            <button
              className="icon-btn"
              onClick={() => setShowLanding(true)}
              title="Xem Trang Giới Thiệu (Landing Page)"
            >
              ✦
            </button>

            {settings.isLockEnabled && settings.pinHash && (
              <button
                className="lock-now-btn"
                onClick={() => setIsLocked(true)}
                title="Khóa ứng dụng ngay lập tức"
              >
                🔒
              </button>
            )}

            <button
              className="theme-toggle-btn"
              onClick={() =>
                setSettings((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))
              }
              title={settings.theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            >
              {settings.theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              className="primary compact topbar-add-btn"
              onClick={() => setShowAddMealModal(true)}
            >
              ＋ Ghi bữa ăn
            </button>
          </div>
        </header>

        {/* 10-Day Horizontal Arc Selector */}
        <DaySelector
          currentDay={day}
          logs={logs}
          waterTarget={settings.waterTargetMl}
          onSelectDay={(d) => setSettings((s) => ({ ...s, currentDay: d }))}
        />

        {/* Dynamic Views */}
        {tab === 'Today' && (
          <TodayView
            log={log}
            plan={plan}
            day={day}
            score={currentScore}
            settings={settings}
            toggleChecklist={toggleChecklist}
            addWater={addWater}
            toggleWorkout={toggleWorkout}
            updateLog={updateLog}
            setMetric={setMetric}
            onExercise={setSelectedExercise}
            onOpenAddMeal={() => setShowAddMealModal(true)}
          />
        )}

        {tab === '10-Day Plan' && (
          <PlanView
            currentDay={day}
            logs={logs}
            waterTarget={settings.waterTargetMl}
            onSelectDay={(d) => setSettings((s) => ({ ...s, currentDay: d }))}
            onNavigateToTraining={() => setTab('Training')}
          />
        )}

        {tab === 'Meals' && (
          <MealsView
            logs={logs}
            currentDay={day}
            setLogs={setLogs}
            onAddMeal={() => setShowAddMealModal(true)}
          />
        )}

        {tab === 'Training' && (
          <TrainingView
            day={day}
            plan={plan}
            log={log}
            toggleWorkout={toggleWorkout}
            updateLog={updateLog}
            onExercise={setSelectedExercise}
          />
        )}

        {tab === 'Journal' && (
          <JournalView
            logs={logs}
            day={day}
            updateLog={updateLog}
            setMetric={setMetric}
          />
        )}

        {tab === 'Insights' && (
          <InsightsView logs={logs} settings={settings} />
        )}

        {tab === 'Settings' && (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
            exportData={exportData}
            importData={importData}
            resetData={resetData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {TABS.slice(0, 5).map((t) => (
          <button
            key={t.id}
            className={`mobile-nav-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="mobile-nav-icon">{t.icon}</span>
            <small>{t.id === '10-Day Plan' ? 'Lộ trình' : t.label}</small>
          </button>
        ))}
        <button
          className={`mobile-nav-btn ${tab === 'Insights' || tab === 'Settings' ? 'active' : ''}`}
          onClick={() => setShowMobileMoreMenu(true)}
        >
          <span className="mobile-nav-icon">⋯</span>
          <small>Thêm</small>
        </button>
      </nav>

      {/* Mobile More Sheet */}
      {showMobileMoreMenu && (
        <div
          className="mobile-sheet-backdrop"
          onClick={() => setShowMobileMoreMenu(false)}
        >
          <div className="mobile-sheet animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-head">
              <h3>Mục bổ sung</h3>
              <button onClick={() => setShowMobileMoreMenu(false)}>✕</button>
            </div>
            <div className="mobile-sheet-items">
              <button
                className={tab === 'Training' ? 'active' : ''}
                onClick={() => {
                  setTab('Training')
                  setShowMobileMoreMenu(false)
                }}
              >
                <span>⚡</span> Tập luyện chi tiết & Kegel
              </button>
              <button
                className={tab === 'Insights' ? 'active' : ''}
                onClick={() => {
                  setTab('Insights')
                  setShowMobileMoreMenu(false)
                }}
              >
                <span>📊</span> Thống kê & Xu hướng 10 ngày
              </button>
              <button
                className={tab === 'Settings' ? 'active' : ''}
                onClick={() => {
                  setTab('Settings')
                  setShowMobileMoreMenu(false)
                }}
              >
                <span>⚙</span> Cài đặt & Sao lưu dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Meal Modal */}
      {showAddMealModal && (
        <MealModal
          day={day}
          onClose={() => setShowAddMealModal(false)}
          onSave={handleSaveQuickMeal}
        />
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  )
}

export default App
