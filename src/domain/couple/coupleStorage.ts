import type {
  AnsweredQuestion,
  BucketListItem,
  LoveLetter,
  MemoryCapsule
} from './coupleFeatures'

const KEYS = {
  ANSWERED_QUESTIONS: 'little_days_v2_answered_questions',
  LOVE_LETTERS: 'little_days_v2_love_letters',
  MEMORY_CAPSULES: 'little_days_v2_memory_capsules',
  BUCKET_LIST: 'little_days_v2_bucket_list'
}

export const coupleStorage = {
  // ── 1. Questions ──
  loadAnsweredQuestions(): Record<number, AnsweredQuestion> {
    try {
      const raw = localStorage.getItem(KEYS.ANSWERED_QUESTIONS)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  },
  saveAnsweredQuestion(answer: AnsweredQuestion): void {
    try {
      const current = this.loadAnsweredQuestions()
      current[answer.questionId] = answer
      localStorage.setItem(KEYS.ANSWERED_QUESTIONS, JSON.stringify(current))
    } catch { /* ignore */ }
  },

  // ── 2. Love Letters ──
  loadLoveLetters(): LoveLetter[] {
    try {
      const raw = localStorage.getItem(KEYS.LOVE_LETTERS)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },
  saveLoveLetter(letter: LoveLetter): void {
    try {
      const current = this.loadLoveLetters()
      const index = current.findIndex(l => l.id === letter.id)
      if (index >= 0) {
        current[index] = letter
      } else {
        current.unshift(letter)
      }
      localStorage.setItem(KEYS.LOVE_LETTERS, JSON.stringify(current))
    } catch { /* ignore */ }
  },

  // ── 3. Memory Capsules ──
  loadMemoryCapsules(): MemoryCapsule[] {
    try {
      const raw = localStorage.getItem(KEYS.MEMORY_CAPSULES)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },
  saveMemoryCapsule(capsule: MemoryCapsule): void {
    try {
      const current = this.loadMemoryCapsules()
      const index = current.findIndex(c => c.id === capsule.id)
      if (index >= 0) {
        current[index] = capsule
      } else {
        current.unshift(capsule)
      }
      localStorage.setItem(KEYS.MEMORY_CAPSULES, JSON.stringify(current))
    } catch { /* ignore */ }
  },

  // ── 4. Bucket List ──
  loadBucketList(): BucketListItem[] {
    try {
      const raw = localStorage.getItem(KEYS.BUCKET_LIST)
      if (raw) return JSON.parse(raw)

      // Initial defaults
      const defaults: BucketListItem[] = [
        { id: 'b_1', title: 'Ngắm hoàng hôn biển Nha Trang cùng nhau', category: 'trips', isCompleted: false },
        { id: 'b_2', title: 'Cùng nhau tự tay nấu bữa tối nến lãng mạn', category: 'food', isCompleted: false },
        { id: 'b_3', title: 'Lặn ngắm rạn san hô Hòn Mun', category: 'experiences', isCompleted: false },
        { id: 'b_4', title: 'Chụp chung một bộ ảnh polaroid lưu giữ kỷ niệm 1 năm', category: 'places', isCompleted: false }
      ]
      return defaults
    } catch {
      return []
    }
  },
  saveBucketList(list: BucketListItem[]): void {
    try {
      localStorage.setItem(KEYS.BUCKET_LIST, JSON.stringify(list))
    } catch { /* ignore */ }
  }
}
