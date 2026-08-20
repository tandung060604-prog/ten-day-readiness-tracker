import type { CoupleProfile } from './types'

export const DEMO_COUPLE_PROFILE: CoupleProfile = {
  version: 1,
  id: 'demo-couple-profile',
  title: 'Tổ Ấm Của Chúng Mình',
  player1: {
    id: 'p1',
    displayName: 'Haru',
    nickname: 'Haru',
    avatarCharacter: 'chiikawa',
    genderTag: 'BẠN NAM',
    roleTitle: 'Người Giữ Lửa Tổ Ấm',
    favoriteColor: '#ff8da1',
    favoriteFoods: ['Bánh Pudding', 'Dâu Tây', 'Trà Ấm'],
    bio: 'Chăm chỉ, ấm áp và luôn sẵn sàng chuẩn bị mọi điều tốt nhất.'
  },
  player2: {
    id: 'p2',
    displayName: 'Mai Trang',
    nickname: 'Em Yêu',
    avatarCharacter: 'usagi',
    genderTag: 'BẠN NỮ',
    roleTitle: 'Năng Lượng Siêu Cấp',
    favoriteColor: '#ffd166',
    favoriteFoods: ['Hải Sản', 'Bánh Ngọt', 'Trà Sữa'],
    bio: 'Đáng yêu, tràn đầy năng lượng và yêu thích những chuyến phiêu lưu.'
  },
  relationshipStartDate: '2026-06-11',
  importantDates: [
    {
      id: 'd-anniversary',
      title: 'Ngày Kỷ Niệm Yêu Nhau',
      date: '2026-06-11',
      category: 'anniversary',
      countdown: false,
      icon: '💖',
      notes: 'Khởi đầu hành trình tình yêu ngọt ngào của hai bạn.'
    },
    {
      id: 'd-trip-nhatrang',
      title: 'Chuyến Bay Biển Nha Trang',
      date: '2026-08-27',
      category: 'trip',
      countdown: true,
      icon: '✈️',
      notes: 'Kỳ nghỉ biển cùng nhau sau 10 ngày sẵn sàng.'
    }
  ],
  homeCity: 'Hà Nội',
  timezone: 'Asia/Ho_Chi_Minh',
  favoritePlaces: [
    { id: 'place-1', name: 'Bãi Biển Nha Trang', city: 'Nha Trang' },
    { id: 'place-2', name: 'Quán Cà Phê Mùa Thu', city: 'Hà Nội' }
  ],
  favoriteFoods: ['Dâu tây ngọt', 'Bánh pudding', 'Súp gà ấm', 'Hải sản nướng'],
  favoriteSongs: ['SECRET · Say Hi', 'Lofi Study Chill'],
  coupleGoals: [
    { id: 'g1', title: 'Hoàn thành 10 ngày sẵn sàng', targetDate: '2026-08-26', completed: false },
    { id: 'g2', title: 'Chụp 100 bức ảnh kỷ niệm Nha Trang', targetDate: '2026-08-30', completed: false }
  ],
  privacy: {
    storageMode: 'local',
    maskSensitiveData: false,
    enablePinLock: false
  },
  onboardingCompleted: true,
  createdAt: '2026-06-11T00:00:00.000Z',
  updatedAt: '2026-08-20T00:00:00.000Z'
}
