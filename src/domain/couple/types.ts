export type MascotCharacter = 'chiikawa' | 'usagi' | 'hachiware' | 'momonga' | 'kurimanju' | 'rakko'

export interface PersonProfile {
  id: string
  displayName: string
  nickname: string
  avatarCharacter: MascotCharacter
  birthday?: string // YYYY-MM-DD
  genderTag?: string // e.g. 'BẠN NAM', 'BẠN NỮ'
  roleTitle?: string
  favoriteColor?: string
  favoriteFoods?: string[]
  bio?: string
}

export type ImportantDateCategory = 'anniversary' | 'birthday' | 'trip' | 'milestone' | 'custom'

export interface ImportantDate {
  id: string
  title: string
  date: string // YYYY-MM-DD
  category: ImportantDateCategory
  countdown: boolean
  icon?: string
  notes?: string
}

export interface PlaceReference {
  id: string
  name: string
  city?: string
  notes?: string
}

export interface CoupleGoal {
  id: string
  title: string
  targetDate?: string
  completed: boolean
}

export interface PrivacyPreferences {
  storageMode: 'local'
  maskSensitiveData: boolean
  enablePinLock: boolean
}

export interface CoupleProfile {
  version: number
  id: string
  title: string // e.g. 'Tổ Ấm Của Haru & Mochi'
  player1: PersonProfile
  player2: PersonProfile
  relationshipStartDate?: string // YYYY-MM-DD
  importantDates: ImportantDate[]
  homeCity?: string
  timezone?: string
  favoritePlaces?: PlaceReference[]
  favoriteFoods?: string[]
  favoriteSongs?: string[]
  coupleGoals?: CoupleGoal[]
  privacy: PrivacyPreferences
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}
