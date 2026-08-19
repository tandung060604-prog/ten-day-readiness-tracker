import { useEffect, useRef, useState } from 'react'
import { YouTubeBGMPlayer } from './components/common/YouTubeBGMPlayer'
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
import { SplashScreen } from './game/components/SplashScreen'
import { WorldMap } from './game/components/WorldMap'
import { TopHUD } from './game/components/TopHUD'
import { BottomHUD } from './game/components/BottomHUD'
import { InventoryModal } from './game/components/InventoryModal'
import { BuildingModuleModal } from './game/components/BuildingModuleModal'
import { TransitionSystem } from './game/systems/TransitionSystem'
import { audioSystem } from './game/systems/GameAudioSystem'
import { defaultSettings, seededLogs, trainingPlan } from './data/plan'
import { readiness } from './utils/readiness'
import type { AppSettings, DailyLog, Exercise, MealEntry } from './types'
import type { GameStats, InventoryItem, LocationId, TransitionType } from './game/types'

const STORAGE_KEY = 'ten-day-readiness-v1'
const SETTINGS_KEY = 'ten-day-readiness-settings-v1'

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'strawberries',
    name: 'Dâu Tây Ngọt Lành',
    icon: '🍓',
    description: 'Trái cây vitamin bổ sung năng lượng sạch cho buổi tập.',
    count: 12,
    category: 'food'
  },
  {
    id: 'pudding',
    name: 'Bánh Pudding Sữa',
    icon: '🍮',
    description: 'Món tráng miệng ngọt ngào bé Chiikawa cực kỳ yêu thích.',
    count: 5,
    category: 'food'
  },
  {
    id: 'gold_star',
    name: 'Ngôi Sao Kỷ Luật',
    icon: '⭐',
    description: 'Huy hiệu hoàn thành 100% checklist ngày.',
    count: 10,
    category: 'special'
  },
  {
    id: 'love_ribbon',
    name: 'Dây Ruy Băng Tình Yêu',
    icon: '🎀',
    description: 'Biểu tượng kỷ niệm ngày yêu nhau 11/06 của Dũng & Em Yêu.',
    count: 1,
    category: 'souvenir'
  },
  {
    id: 'beach_shell',
    name: 'Vỏ Sò Biển Nha Trang',
    icon: '🐚',
    description: 'Quà lưu niệm chuẩn bị cho chuyến bay 27/08.',
    count: 3,
    category: 'decoration'
  }
]

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
  // Game Scene States: 'splash' -> 'map' | 'module'
  const [gameScene, setGameScene] = useState<'splash' | 'map' | 'module'>('splash')
  const [currentLocation, setCurrentLocation] = useState<LocationId | 'map'>('map')
  const [showLanding, setShowLanding] = useState<boolean>(false)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [activeTransition, setActiveTransition] = useState<{ type: TransitionType; isActive: boolean }>({
    type: 'cloud',
    isActive: false
  })

  // Tracker Engine State
  const [logs, setLogs] = useState<DailyLog[]>(loadLogs)
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [showAddMealModal, setShowAddMealModal] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [inventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY)
  const [isHudHidden, setIsHudHidden] = useState(false)

  // Security Lock State
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return !!(settings.isLockEnabled && settings.pinHash)
  })
  const lastActiveTimeRef = useRef<number>(Date.now())

  // Persist logs & settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  }, [logs])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    document.documentElement.dataset.theme = settings.theme
  }, [settings])

  // Auto-lock on inactivity
  useEffect(() => {
    if (!settings.isLockEnabled || !settings.pinHash) {
      setIsLocked(false)
      return
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastActiveTimeRef.current = Date.now()
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
        title: plan.title,
        completed: !l.workout?.completed
      }
    }))
  }

  const setMetric = (key: 'energy' | 'mood' | 'stress' | 'soreness', value: number) => {
    updateLog((l) => ({
      ...l,
      [key]: value
    }))
  }

  const handleAddMeal = (meal: MealEntry) => {
    updateLog((l) => ({ ...l, meals: [...l.meals, meal] }))
    setShowAddMealModal(false)
  }

  const exportData = () => {
    const data = { logs, settings, exportDate: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `LittleDays_Backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        if (parsed.logs && Array.isArray(parsed.logs)) {
          setLogs(parsed.logs)
        }
        if (parsed.settings) {
          setSettings((prev) => ({ ...prev, ...parsed.settings }))
        }
        alert('Đã nhập dữ liệu Little Days thành công! ✨')
      } catch {
        alert('File dữ liệu không đúng định dạng.')
      }
    }
    reader.readAsText(file)
  }

  const resetData = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại dữ liệu về mặc định không?')) {
      setLogs(seededLogs)
      setSettings(defaultSettings)
    }
  }

  // Cinematic Transition Helper
  const triggerTransition = (type: TransitionType, nextLocation: LocationId | 'map') => {
    audioSystem.playTransitionSFX(type)
    setActiveTransition({ type, isActive: true })

    setTimeout(() => {
      setCurrentLocation(nextLocation)
      setGameScene(nextLocation === 'map' ? 'map' : 'module')
      setTimeout(() => {
        setActiveTransition({ type, isActive: false })
      }, 350)
    }, 450)
  }

  // Handle Splash Screen enter
  const handleEnterFromSplash = () => {
    triggerTransition('cloud', 'map')
  }

  // Handle building clicked on World Map
  const handleSelectBuilding = (locationId: LocationId, transition: TransitionType) => {
    triggerTransition(transition, locationId)
  }

  // Love days counter
  const loveStart = new Date('2026-06-11T00:00:00')
  const nowDate = new Date()
  const loveDays = Math.max(0, Math.floor((nowDate.getTime() - loveStart.getTime()) / 86400000))

  // Game Stats for Top HUD
  const completedDays = logs.filter((l) => l.checklist.every((c) => c.done)).length
  const gameStats: GameStats = {
    hearts: 12520 + loveDays * 10,
    stars: completedDays * 864 + 200,
    gems: logs.filter((l) => l.workout?.completed).length * 125 + 500,
    energy: 60,
    energyMax: 60,
    level: 28 + completedDays,
    levelProgress: Math.min(100, currentScore),
    loveDays,
    day,
    maxDays: 10
  }

  return (
    <div className="game-app-root">
      {/* Background BGM Player */}
      <YouTubeBGMPlayer />

      {/* Cinematic Transition Overlay */}
      <TransitionSystem type={activeTransition.type} isActive={activeTransition.isActive} />

      {/* Security PIN Lock Screen */}
      {isLocked && settings.pinHash && (
        <LockScreen
          storedPinHash={settings.pinHash}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Classic Landing Page Overlay (Optional view) */}
      {showLanding ? (
        <LandingPage onEnterApp={() => setShowLanding(false)} />
      ) : gameScene === 'splash' ? (
        /* 1. Splash Screen Scene */
        <SplashScreen onEnterGame={handleEnterFromSplash} />
      ) : (
        /* 2. Main Game World Scene */
        <div className={`game-canvas-container ${isHudHidden && currentLocation === 'map' ? 'hud-auto-hidden' : ''}`}>
          {/* Top HUD */}
          <div className={`hud-top-wrapper ${isHudHidden && currentLocation === 'map' ? 'hud-slide-up' : ''}`}>
            <TopHUD
              stats={gameStats}
              onOpenSettings={() => triggerTransition('gear', 'settings')}
              onOpenHome={() => triggerTransition('heart', 'home')}
              onOpenQuests={() => triggerTransition('cloud', 'quests')}
            />
          </div>

          {/* Main Stage: World Map or Active Building Module */}
          <main className="game-viewport">
            {currentLocation === 'map' ? (
              <WorldMap
                onSelectBuilding={handleSelectBuilding}
                loveDays={loveDays}
                onDragStateChange={(isMoving) => setIsHudHidden(isMoving)}
              />
            ) : (
              <BuildingModuleModal
                locationId={currentLocation}
                onBackToMap={() => triggerTransition('cloud', 'map')}
              >
                {/* 1. Home Module (TodayView & Couple Hero) */}
                {currentLocation === 'home' && (
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
                    onExercise={(e) => setSelectedExercise(e)}
                    onOpenAddMeal={() => setShowAddMealModal(true)}
                  />
                )}

                {/* 2. Quests Module */}
                {currentLocation === 'quests' && (
                  <PlanView
                    currentDay={day}
                    logs={logs}
                    waterTarget={settings.waterTargetMl}
                    onSelectDay={(d) => setSettings((s) => ({ ...s, currentDay: d }))}
                    onNavigateToTraining={() => triggerTransition('cloud', 'gym')}
                  />
                )}

                {/* 3. Gym / Workout Module */}
                {currentLocation === 'gym' && (
                  <TrainingView
                    day={day}
                    plan={plan}
                    log={log}
                    onExercise={(e) => setSelectedExercise(e)}
                    toggleWorkout={toggleWorkout}
                    updateLog={updateLog}
                  />
                )}

                {/* 4. Hydration Water Module */}
                {currentLocation === 'water' && (
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
                    onExercise={(e) => setSelectedExercise(e)}
                    onOpenAddMeal={() => setShowAddMealModal(true)}
                  />
                )}

                {/* 5. Sleep Center Module */}
                {currentLocation === 'sleep' && (
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
                    onExercise={(e) => setSelectedExercise(e)}
                    onOpenAddMeal={() => setShowAddMealModal(true)}
                  />
                )}

                {/* 6. Journal Library Module */}
                {currentLocation === 'journal' && (
                  <JournalView
                    logs={logs}
                    day={day}
                    updateLog={updateLog}
                    setMetric={setMetric}
                  />
                )}

                {/* 7. Album Memories Module */}
                {currentLocation === 'album' && (
                  <InsightsView
                    logs={logs}
                    settings={settings}
                  />
                )}

                {/* 8. Market & Nutrition Module */}
                {currentLocation === 'market' && (
                  <MealsView
                    logs={logs}
                    currentDay={day}
                    setLogs={setLogs}
                    onAddMeal={() => setShowAddMealModal(true)}
                  />
                )}

                {/* 9. Restaurant Date Module */}
                {currentLocation === 'restaurant' && (
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
                    onExercise={(e) => setSelectedExercise(e)}
                    onOpenAddMeal={() => setShowAddMealModal(true)}
                  />
                )}

                {/* 10. Airport Module */}
                {currentLocation === 'airport' && (
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
                    onExercise={(e) => setSelectedExercise(e)}
                    onOpenAddMeal={() => setShowAddMealModal(true)}
                  />
                )}

                {/* 11. Beach Adventure Module */}
                {currentLocation === 'beach' && (
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
                    onExercise={(e) => setSelectedExercise(e)}
                    onOpenAddMeal={() => setShowAddMealModal(true)}
                  />
                )}

                {/* 12. Town Hall Settings Module */}
                {currentLocation === 'settings' && (
                  <SettingsView
                    settings={settings}
                    setSettings={setSettings}
                    exportData={exportData}
                    importData={importData}
                    resetData={resetData}
                  />
                )}
              </BuildingModuleModal>
            )}
          </main>

          {/* Bottom Dock HUD */}
          <div className={`hud-bottom-wrapper ${isHudHidden && currentLocation === 'map' ? 'hud-slide-down' : ''}`}>
            <BottomHUD
              currentLocation={currentLocation}
              onNavigate={(loc) => triggerTransition('cloud', loc)}
              onOpenInventory={() => setIsInventoryOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddMealModal && (
        <MealModal
          day={day}
          onClose={() => setShowAddMealModal(false)}
          onSave={handleAddMeal}
        />
      )}

      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        items={inventoryItems}
      />
    </div>
  )
}

export default App
