# BUILDING UPGRADE SYSTEM SPECIFICATION — LITTLE DAYS V2

## 1. Goal & Philosophy
In Little Days V2, town buildings are not static backdrops — they visibly grow and evolve as the couple plays puzzle campaign levels and completes real-life relationship habits.

Each building supports **3 distinct tiers**:
- **Level 1 (Foundation)**: Basic rustic setup.
- **Level 2 (Cozy Renovation)**: Garden, balconies, enhanced perks, and warm aesthetics.
- **Level 3 (Grand Landmark)**: Luminous golden aura, landmark features, maximum perks, and eternal anniversary albums.

---

## 2. 3-Tier Upgrade Matrix

### 🏡 1. Ngôi Nhà Nhỏ (Cozy Cottage)
- **Lv.1: Nhà Gỗ Ấm Áp**: Sofa check-in, nhật ký tình yêu.
- **Lv.2: Vườn Hoa & Ban Công Đón Nắng**:
  - *Cost*: 250 Coins, 100 Hearts, 5 Stars, 4 Sakura Wood, 1 Home Blueprint.
  - *Perks*: +25% Hearts từ Sofa Check-in, Ban công ngắm sao, Vườn hoa nở.
- **Lv.3: Biệt Thự Tình Yêu Vĩnh Cửu**:
  - *Cost*: 600 Coins, 250 Hearts, 15 Stars, 10 Sakura Wood, 6 Granite Stone, 4 Gold Nails.
  - *Perks*: +50% Hearts toàn bộ hoạt động, Hào quang hoàng kim, Album 100 năm.

### ⚔️ 2. Quảng Trường Nhiệm Vụ (Town Square)
- **Lv.1: Bảng Gỗ Làng**: Bảng nhiệm vụ gỗ mộc mạc.
- **Lv.2: Quảng Trường Cờ Hoa**:
  - *Cost*: 300 Coins, 120 Hearts, 8 Stars, 6 Granite Stone, 2 Gold Nails.
  - *Perks*: Nhiệm vụ tuần đặc biệt, +20% Xu thưởng.
- **Lv.3: Đại Quảng Trường Hoàng Gia**:
  - *Cost*: 700 Coins, 300 Hearts, 20 Stars, 1 Town Crest, 12 Granite Stone.
  - *Perks*: Nhiệm vụ huyền thoại cặp đôi, +50% Xu & XP thưởng.

### 🛍️ 3. Khu Chợ Nhỏ (Little Market)
- **Lv.1: Quầy Hàng Rau Củ**: Mua bán nguyên liệu thô.
- **Lv.2: Tiệm Bánh & Nông Sản Tươi**:
  - *Cost*: 200 Coins, 80 Hearts, 6 Stars, 4 Sakura Wood, 2 Wheat Flour.
  - *Perks*: Mua bánh dâu tây, mở bán Búa Phép giải đố.
- **Lv.3: Đại Trung Tâm Thương Mại Đôi**:
  - *Cost*: 500 Coins, 200 Hearts, 18 Stars, 6 Gold Nails, 8 Granite Stone.
  - *Perks*: Giảm 20% giá mua vật phẩm, mở bán Cà Rốt Thêm Lượt.

---

## 3. Transaction Safety & Non-Negative Balance Rules
- **No Negative Balances**: Currencies (`coins`, `hearts`, `stars`) and materials cannot go below 0.
- **Atomic Execution**: All material deductions and tier promotions happen synchronously in `executeBuildingUpgrade`.
- **Celebration Trigger**: Confetti and mascot voice lines (`chiikawa_cheer` / `usagi_yaha`) play upon successful upgrade.
