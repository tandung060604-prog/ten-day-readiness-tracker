# COUPLE LIFE FEATURES SPECIFICATION — LITTLE DAYS V2

## 1. Goal & Principles
Couple features in Little Days V2 are designed to preserve memories, spark daily conversations, reduce planning effort, and foster deep romantic intimacy without requiring server backends or invasive personal data.

---

## 2. Feature Directory & Building Locations

### 💬 1. Daily Couple Question (Ngôi Nhà Nhỏ / Sofa)
- **Prompt Library**: 30+ curated questions spanning Deep Conversations, Sweet Memories, Future Dreams, Gratitude, and Fun.
- **Rotation Engine**: Auto-rotates daily based on day of year.
- **Reward**: Answering grants **+15 Hearts (💖)**.
- **Storage**: LocalStorage persistence with favorite bookmarking.

### 💌 2. Love Letter Mailbox (Hòm Thư Trước Cổng)
- **Letter Composition**: Send letters to partner with title, romantic content, and timestamp.
- **Unsealing UX**: Wax-seal break animation with mascot squeaks.
- **Archive**: Dedicated mailbox tab preserving all heartfelt letters.

### ⏳ 3. Time-Locked Memory Capsules (Thư Viện Kỷ Niệm)
- **Lock Triggers**:
  - Specific Date (e.g. 2026-12-31)
  - Days Elapsed (e.g. 30, 100, 365 days)
  - Annual Anniversary
  - Partner's Birthday
- **Offline Evaluation**: Evaluated dynamically on client clock.

### 🎡 4. Date & Food Roulette (Nhà Hàng Ánh Nến)
- **Filters**: Romantic, Chill, Active, Food, Budget.
- **Indoor / Outdoor Toggle**: Filters suitable options based on weather.
- **Outputs**: Estimated costs (VND), descriptions, and iconic badges.

### 📝 5. Couple Bucket List (Thư Viện & Bãi Biển)
- **Categories**: Places to Visit, Food to Try, Experiences, Gifts, Trips.
- **Check-off Reward**: Confetti celebration, completion timestamp, and instant memory collectible generation.

### 🎂 6. Special Event & Milestone Engine
- Automatically triggers on Relationship Anniversaries (100 days, 1-year, etc.), Birthdays, Valentine's Day, Tết, and Christmas.
