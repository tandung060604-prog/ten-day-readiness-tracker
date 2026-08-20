# ECONOMY & REWARDS ARCHITECTURE — LITTLE DAYS V2

## 1. Virtual Currencies (100% Non-Monetized)

| Currency | Icon | Source | Purpose |
|---|---|---|---|
| **Hearts (Tim Yêu Thương)** | 💖 | Daily couple habits, water logs, check-ins | Building upgrades, bond miracles |
| **Stars (Ngôi Sao Phiêu Lưu)** | ⭐ | 30 Puzzle campaign stages (max 90 ⭐) | Building upgrade gates, chapter unlocks |
| **Coins (Xu Hạnh Phúc)** | 🪙 | Town quests, stage first-clears, streak bonuses | Market shopping, upgrade materials |
| **Travel Tickets (Vé Du Lịch)** | 🎫 | Chapter completions, travel milestones | Nha Trang souvenir perks, special scenes |

*Strict Rule: Zero real-money in-app purchases or pay-to-win mechanics.*

---

## 2. 7 Authoritative Item Categories

1. **Building Materials (`building_materials`)**:
   - `item_sakura_wood`, `item_granite_stone`, `item_gold_nails`, `item_home_blueprint`, `item_town_crest`.
2. **Ingredients (`ingredients`)**:
   - `item_wheat_flour`, `item_sakura_seed`, `item_strawberry`, `item_pure_spring_water`.
3. **Decorations (`decorations`)**:
   - `item_hearth_lamp`, `item_sakura_bonsai`, `item_windchime`.
4. **Memory Collectibles (`memory_collectibles`)**:
   - `item_polaroid_first_day`, `item_love_letter_bundle`.
5. **Puzzle Boosters (`puzzle_boosters`)**:
   - `item_booster_hammer`, `item_booster_moves`.
6. **Souvenirs (`souvenirs`)**:
   - `item_hon_mun_coral_charm`, `item_sunset_trophy`.
7. **Event Items (`event_items`)**:
   - `item_endless_couple_ring`.

---

## 3. Anti-Exploit & Zero-Negative Rules
- Items must be genuinely earned and consumed.
- No duplicate reward exploits on stage replays.
- LocalStorage state persistence is atomic.
