# LITTLE DAYS V2 — COUPLE PROFILE SCHEMA SPECIFICATION

**Schema Version:** 1.0  
**Phase:** Phase 01 — Data Model & Couple Profile  
**Storage Target:** `localStorage['little_days_couple_profile_v1']` / IndexedDB (`couple_profile`)

---

## 1. Schema Definition (TypeScript)

```typescript
export type MascotCharacter = 'chiikawa' | 'usagi' | 'hachiware' | 'momonga' | 'kurimanju' | 'rakko'

export interface PersonProfile {
  id: string
  displayName: string
  nickname: string
  avatarCharacter: MascotCharacter
  birthday?: string // ISO 8601 Date: YYYY-MM-DD
  genderTag?: string // e.g. 'BẠN NAM', 'BẠN NỮ', 'BẠN ĐỒNG HÀNH'
  roleTitle?: string // e.g. 'Người Giữ Lửa Tổ Ấm', 'Năng Lượng Siêu Cấp'
  favoriteColor?: string // Hex color string, e.g. '#ff8da1'
  favoriteFoods?: string[]
  bio?: string
}

export type ImportantDateCategory = 'anniversary' | 'birthday' | 'trip' | 'milestone' | 'custom'

export interface ImportantDate {
  id: string
  title: string
  date: string // ISO 8601 Date: YYYY-MM-DD
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
  targetDate?: string // ISO 8601 Date: YYYY-MM-DD
  completed: boolean
}

export interface PrivacyPreferences {
  storageMode: 'local'
  maskSensitiveData: boolean
  enablePinLock: boolean
}

export interface CoupleProfile {
  version: number // Schema version: 1
  id: string
  title: string
  player1: PersonProfile
  player2: PersonProfile
  relationshipStartDate?: string // ISO 8601 Date: YYYY-MM-DD
  importantDates: ImportantDate[]
  homeCity?: string
  timezone?: string
  favoritePlaces?: PlaceReference[]
  favoriteFoods?: string[]
  favoriteSongs?: string[]
  coupleGoals?: CoupleGoal[]
  privacy: PrivacyPreferences
  onboardingCompleted: boolean
  createdAt: string // ISO 8601 Timestamp
  updatedAt: string // ISO 8601 Timestamp
}
```

---

## 2. Example JSON Payload

```json
{
  "version": 1,
  "id": "profile-1724123456789",
  "title": "Tổ Ấm Của Haru & Mai Trang",
  "player1": {
    "id": "p1",
    "displayName": "Haru",
    "nickname": "Haru",
    "avatarCharacter": "chiikawa",
    "genderTag": "BẠN NAM",
    "roleTitle": "Người Giữ Lửa Tổ Ấm",
    "favoriteColor": "#ff8da1",
    "favoriteFoods": ["Bánh Pudding", "Dâu Tây", "Trà Ấm"],
    "bio": "Chăm chỉ, ấm áp và luôn sẵn sàng chuẩn bị mọi điều tốt nhất."
  },
  "player2": {
    "id": "p2",
    "displayName": "Mai Trang",
    "nickname": "Em Yêu",
    "avatarCharacter": "usagi",
    "genderTag": "BẠN NỮ",
    "roleTitle": "Năng Lượng Siêu Cấp",
    "favoriteColor": "#ffd166",
    "favoriteFoods": ["Hải Sản", "Bánh Ngọt", "Trà Sữa"],
    "bio": "Đáng yêu, tràn đầy năng lượng và yêu thích những chuyến phiêu lưu."
  },
  "relationshipStartDate": "2026-06-11",
  "importantDates": [
    {
      "id": "d-anniversary",
      "title": "Ngày Kỷ Niệm Yêu Nhau",
      "date": "2026-06-11",
      "category": "anniversary",
      "countdown": false,
      "icon": "💖",
      "notes": "Khởi đầu hành trình tình yêu ngọt ngào của hai bạn."
    },
    {
      "id": "d-trip-nhatrang",
      "title": "Chuyến Bay Biển Nha Trang",
      "date": "2026-08-27",
      "category": "trip",
      "countdown": true,
      "icon": "✈️",
      "notes": "Kỳ nghỉ biển cùng nhau sau 10 ngày sẵn sàng."
    }
  ],
  "homeCity": "Hà Nội",
  "timezone": "Asia/Ho_Chi_Minh",
  "favoritePlaces": [
    { "id": "place-1", "name": "Bãi Biển Nha Trang", "city": "Nha Trang" }
  ],
  "favoriteFoods": ["Dâu tây", "Pudding", "Hải sản"],
  "favoriteSongs": ["SECRET · Say Hi"],
  "coupleGoals": [
    { "id": "g1", "title": "Hoàn thành 10 ngày sẵn sàng", "targetDate": "2026-08-26", "completed": false }
  ],
  "privacy": {
    "storageMode": "local",
    "maskSensitiveData": false,
    "enablePinLock": false
  },
  "onboardingCompleted": true,
  "createdAt": "2026-06-11T00:00:00.000Z",
  "updatedAt": "2026-08-20T10:00:00.000Z"
}
```
