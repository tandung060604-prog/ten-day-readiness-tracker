import { useEffect, useRef, useState } from 'react'
import { YouTubeBGMPlayer } from './components/common/YouTubeBGMPlayer'
import { MealModal } from './components/modals/MealModal'
import { ExerciseModal } from './components/modals/ExerciseModal'
import { LockScreen } from './components/security/LockScreen'
import { LandingPage } from './views/LandingPage'
import { MealsView } from './views/MealsView'
import { TrainingView } from './views/TrainingView'
import { JournalView } from './views/JournalView'
import { SettingsView } from './views/SettingsView'
import { LoveHospitalView } from './views/LoveHospitalView'
import { SplashScreen } from './game/components/SplashScreen'
import { OrientationPrompt } from './game/components/OrientationPrompt'
import { WorldMap } from './game/components/WorldMap'
import { TopHUD } from './game/components/TopHUD'
import { BottomHUD } from './game/components/BottomHUD'
import { InventoryModal } from './game/components/InventoryModal'
import { BuildingModuleModal } from './game/components/BuildingModuleModal'
import { TransitionSystem } from './game/systems/TransitionSystem'
import { audioSystem } from './game/systems/GameAudioSystem'
import { HomeInterior } from './components/interiors/HomeInterior'
import { WaterFountainInterior } from './components/interiors/WaterFountainInterior'
import { SleepHavenInterior } from './components/interiors/SleepHavenInterior'
import { RestaurantInterior } from './components/interiors/RestaurantInterior'
import { AirportInterior } from './components/interiors/AirportInterior'
import { BeachAdventureInterior } from './components/interiors/BeachAdventureInterior'
import { PhotoStudioInterior } from './components/interiors/PhotoStudioInterior'
import { QuestSquareInterior } from './components/interiors/QuestSquareInterior'
import { defaultSettings, seededLogs, trainingPlan } from './data/plan'
import { readiness } from './utils/readiness'
import { CoupleSetupModal } from './components/onboarding/CoupleSetupModal'
import { GameDevToolsModal } from './components/dev/GameDevToolsModal'
import { AudioSubtitleToast } from './components/audio/AudioSubtitleToast'
import { LevelAndXPModal } from './components/common/LevelAndXPModal'
import { DayTimelineBar } from './components/common/DayTimelineBar'
import { CurrencyAndQuickStartModal } from './components/common/CurrencyAndQuickStartModal'
import { useGameState } from './context/GameStateContext'
import { getItemDefinition } from './domain/game/itemCatalog'
import { coupleProfileRepository } from './storage/coupleProfileRepository'
import { getRelationshipDays } from './domain/couple/selectors'
import type { AppSettings, DailyLog, Exercise, MealEntry } from './types'
import type { GameStats, InventoryItem, LocationId, TransitionType } from './game/types'
import type { CoupleProfile } from './domain/couple/types'

const STORAGE_KEY = 'ten-day-readiness-v1'
const SETTINGS_KEY = 'ten-day-readiness-settings-v1'

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
  const [gameScene, setGameScene] = useState<'splash' | 'map' | 'module'>(() => {
    try {
      return sessionStorage.getItem('little_days_has_entered_game') === 'true' ? 'map' : 'splash'
    } catch {
      return 'splash'
    }
  })
  const [currentLocation, setCurrentLocation] = useState<LocationId | 'map'>('map')
  const [showLanding, setShowLanding] = useState<boolean>(false)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [activeTransition, setActiveTransition] = useState<{ type: TransitionType; isActive: boolean }>({
    type: 'cloud',
    isActive: false
  })

  // Authoritative Game State Engine
  const { state: gameState } = useGameState()
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false)

  // Tracker Engine State
  const [logs, setLogs] = useState<DailyLog[]>(loadLogs)
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [showAddMealModal, setShowAddMealModal] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [isHudHidden, setIsHudHidden] = useState(false)
  const [activeRole, setActiveRole] = useState<'chiikawa' | 'usagi'>('chiikawa')
  const [isLevelGuideOpen, setIsLevelGuideOpen] = useState(false)
  const [isStarterGuideOpen, setIsStarterGuideOpen] = useState(false)
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)

  // Toggle DevTools with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setIsDevToolsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Security Lock State
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return !!(settings.isLockEnabled && settings.pinHash)
  })
  const lastActiveTimeRef = useRef<number>(Date.now())

  // Couple Profile & Onboarding State
  const [profile, setProfile] = useState<CoupleProfile>(() => coupleProfileRepository.loadProfile())
  const [showSetupModal, setShowSetupModal] = useState<boolean>(() => !coupleProfileRepository.hasCustomProfile())

  const handleSetupComplete = (newProfile: CoupleProfile) => {
    coupleProfileRepository.saveProfile(newProfile)
    setProfile(newProfile)
    setShowSetupModal(false)
  }

  const handleSkipSetupToDemo = () => {
    const demo = coupleProfileRepository.resetToDemo()
    coupleProfileRepository.saveProfile(demo)
    setProfile(demo)
    setShowSetupModal(false)
  }

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

  // Handle Splash Screen enter with selected character and target location
  const handleEnterFromSplash = (role: 'chiikawa' | 'usagi', targetLoc: LocationId | 'map' = 'map') => {
    try {
      sessionStorage.setItem('little_days_has_entered_game', 'true')
    } catch { /* ignore */ }
    setActiveRole(role)
    triggerTransition('cloud', targetLoc)
  }

  // Handle building clicked on World Map
  const handleSelectBuilding = (locationId: LocationId, transition: TransitionType) => {
    triggerTransition(transition, locationId)
  }

  // Love days counter derived from CoupleProfile
  const loveDays = getRelationshipDays(profile)

  // Game Stats for Top HUD sourced directly from Authoritative Game State
  const gameStats: GameStats = {
    hearts: gameState.currencies.hearts,
    stars: gameState.currencies.stars,
    gems: gameState.currencies.coins,
    energy: 60,
    energyMax: 60,
    level: gameState.progression.level,
    levelProgress: Math.min(100, Math.floor((gameState.progression.xp / Math.max(1, gameState.progression.xpToNextLevel)) * 100)),
    loveDays,
    day,
    maxDays: 10
  }

  // Authoritative Inventory Items for InventoryModal
  const inventoryItems: InventoryItem[] = gameState.inventory.map((slot) => {
    const def = getItemDefinition(slot.itemId)
    let category: 'food' | 'souvenir' | 'decoration' | 'special' = 'special'
    if (def.category === 'food' || def.category === 'ingredients') {
      category = 'food'
    } else if (def.category === 'decorations') {
      category = 'decoration'
    } else if (def.category === 'souvenirs' || def.category === 'memories') {
      category = 'souvenir'
    }
    return {
      id: slot.itemId,
      name: def.name,
      icon: def.icon,
      description: def.description,
      count: slot.quantity,
      category
    }
  })

  return (
    <div className="app-container">
      {/* ── Fixed YouTube BGM Player ── */}
      <YouTubeBGMPlayer />

      {/* Cinematic Scene Transition Overlay */}
      <TransitionSystem
        type={activeTransition.type}
        isActive={activeTransition.isActive}
      />

      {/* Landscape Orientation Prompt for Mobile Devices */}
      <OrientationPrompt />

      {isLocked && settings.pinHash ? (
        <LockScreen
          storedPinHash={settings.pinHash}
          onUnlock={() => {
            lastActiveTimeRef.current = Date.now()
            setIsLocked(false)
          }}
        />
      ) : showLanding ? (
        <LandingPage onEnterApp={() => setShowLanding(false)} />
      ) : gameScene === 'splash' ? (
        /* 1. Splash Screen Scene */
        <SplashScreen onEnterGame={handleEnterFromSplash} profile={profile} />
      ) : (
        /* 2. Main Game World Scene */
        <div className={`game-canvas-container ${isHudHidden && currentLocation === 'map' ? 'hud-auto-hidden' : ''}`}>
          {/* Top HUD (Rendered only on Map) */}
          {currentLocation === 'map' && (
            <div className={`hud-top-wrapper ${isHudHidden ? 'hud-slide-up' : ''}`}>
              <TopHUD
                stats={gameStats}
                activeRole={activeRole}
                profile={profile}
                isTimelineOpen={isTimelineOpen}
                onToggleTimeline={() => setIsTimelineOpen((prev) => !prev)}
                onOpenSettings={() => triggerTransition('gear', 'settings')}
                onOpenHome={() => triggerTransition('heart', 'home')}
                onOpenQuests={() => triggerTransition('cloud', 'quests')}
                onOpenLevelGuide={() => setIsLevelGuideOpen(true)}
                onOpenCurrenciesGuide={() => setIsStarterGuideOpen(true)}
              />

              {/* 10-Day Observation Timeline Interactive Dropdown Drawer */}
              {isTimelineOpen && (
                <div className="day-timeline-dropdown animate-slide-up">
                  <DayTimelineBar
                    currentDay={day}
                    onSelectDay={(selectedDay) => {
                      setSettings((prev) => ({ ...prev, currentDay: selectedDay }))
                    }}
                  />
                </div>
              )}
            </div>
          )}

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
                {/* 1. Home Cottage Module */}
                {currentLocation === 'home' && (
                  <HomeInterior
                    log={log}
                    day={day}
                    score={currentScore}
                    settings={settings}
                    profile={profile}
                    updateLog={updateLog}
                    setMetric={setMetric}
                    onNavigateToBuilding={(bId) => triggerTransition('cloud', bId as LocationId)}
                  />
                )}

                {/* 2. Quest Square Module */}
                {currentLocation === 'quests' && (
                  <QuestSquareInterior
                    currentDay={day}
                    logs={logs}
                    waterTarget={settings.waterTargetMl}
                    onSelectDay={(d) => setSettings((s) => ({ ...s, currentDay: d }))}
                    onNavigateToTraining={() => triggerTransition('cloud', 'gym')}
                  />
                )}

                {/* 3. Training Gym / Dojo Module */}
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

                {/* 4. Magic Water Fountain Module */}
                {currentLocation === 'water' && (
                  <WaterFountainInterior
                    log={log}
                    waterTargetMl={settings.waterTargetMl}
                    addWater={addWater}
                    updateLog={updateLog}
                  />
                )}

                {/* 5. Sleep Haven Sanctuary Module */}
                {currentLocation === 'sleep' && (
                  <SleepHavenInterior
                    log={log}
                    updateLog={updateLog}
                    setMetric={setMetric}
                  />
                )}

                {/* 6. Memory Library Module */}
                {currentLocation === 'journal' && (
                  <JournalView
                    logs={logs}
                    day={day}
                    updateLog={updateLog}
                    setMetric={setMetric}
                  />
                )}

                {/* 7. Photo Scrapbook Studio Module */}
                {currentLocation === 'album' && (
                  <PhotoStudioInterior
                    logs={logs}
                    settings={settings}
                  />
                )}

                {/* 8. Little Market & Meals Module */}
                {currentLocation === 'market' && (
                  <MealsView
                    logs={logs}
                    currentDay={day}
                    setLogs={setLogs}
                    onAddMeal={() => setShowAddMealModal(true)}
                  />
                )}

                {/* 9. Candlelit Date Restaurant Module */}
                {currentLocation === 'restaurant' && (
                  <RestaurantInterior
                    profile={profile}
                  />
                )}

                {/* 10. Airport Terminal Module */}
                {currentLocation === 'airport' && (
                  <AirportInterior
                    profile={profile}
                  />
                )}

                {/* 11. Beach & Adventure Island Module */}
                {currentLocation === 'beach' && (
                  <BeachAdventureInterior
                    log={log}
                    day={day}
                    profile={profile}
                    toggleChecklist={toggleChecklist}
                  />
                )}

                {/* 12. Town Hall Settings & Vault Module */}
                {currentLocation === 'settings' && (
                  <SettingsView
                    settings={settings}
                    setSettings={setSettings}
                    profile={profile}
                    onUpdateProfile={(p) => {
                      coupleProfileRepository.saveProfile(p)
                      setProfile(p)
                    }}
                    exportData={exportData}
                    importData={importData}
                    resetData={resetData}
                  />
                )}

                {/* 13. Love Clinic (Wellness Cottage) Module */}
                {currentLocation === 'hospital' && (
                  <LoveHospitalView profile={profile} />
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

      {/* Onboarding Couple Setup Modal */}
      <CoupleSetupModal
        isOpen={showSetupModal}
        onComplete={handleSetupComplete}
        onSkipToDemo={handleSkipSetupToDemo}
      />

      {/* Floating Subtitle Toast for Speech & Narration Accessibility */}
      <AudioSubtitleToast />

      {/* Level and XP Progression Guide Modal */}
      <LevelAndXPModal
        isOpen={isLevelGuideOpen}
        onClose={() => setIsLevelGuideOpen(false)}
      />

      {/* Currencies & Quick Start Roadmap Guide Modal */}
      <CurrencyAndQuickStartModal
        isOpen={isStarterGuideOpen}
        onClose={() => setIsStarterGuideOpen(false)}
        onNavigateToBuilding={(loc) => triggerTransition('cloud', loc as LocationId)}
      />

      {/* Game State Dev Tools Modal */}
      <GameDevToolsModal
        isOpen={isDevToolsOpen}
        onClose={() => setIsDevToolsOpen(false)}
      />
    </div>
  )
}

export default App
