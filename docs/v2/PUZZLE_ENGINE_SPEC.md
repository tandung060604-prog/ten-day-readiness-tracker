# LITTLE DAYS V2 — PUZZLE ENGINE SPECIFICATION

## 1. Engine Decision & Rationale

### Choice: Hardware-Accelerated React/DOM Component Engine
- **Evaluation**: For the 7x7 and 8x8 match-3 board with smooth grid transitions, CSS transforms (`translate3d`, `scale`), and squash-and-stretch particle overlays, React/DOM delivers >60 FPS performance across mobile devices with zero bundle overhead (~0 kB extra compared to +1.2MB for Phaser/Pixi).
- **Architecture**: All match logic, cascades, and blockers are decoupled in a pure TypeScript domain module (`puzzleEngine.ts`) that is completely UI-agnostic and 100% unit-testable.

---

## 2. Match-3/4/5 Rules & Tile Types

### Canonical Tile Palette
| Tile ID | Visual Icon | Theme |
|---|---|---|
| `heart` | 💖 | Chiikawa Love & Recovery |
| `carrot` | 🥕 | Usagi Energy & Workout |
| `flower` | 🌸 | Sakura Bloom & Peace |
| `star` | ⭐ | Milestone & Starlight |
| `shell` | 🐚 | Nha Trang Coastal Sea |
| `strawberry` | 🍓 | Sweet Dessert Feast |

### Special Tiles
| Special Type | Creation Condition | Activation Effect |
|---|---|---|
| `rocket_row` | Match 4 horizontally | Clears the entire horizontal row |
| `rocket_col` | Match 4 vertically | Clears the entire vertical column |
| `rainbow` | Match 5 in a straight line or T/L shape | Clears all tiles of matching color |

### Blocker Types
| Blocker ID | Name | Hits Required | Behavior |
|---|---|---|---|
| `crate` | Wooden Crate | 1 hit (adjacent match) | Clears upon any adjacent tile match |
| `ice` | Frozen Layer | 1 hit (matching encased tile) | Traps tile until matched |

---

## 3. Companion Ability Integrations

### Chiikawa: Memory Spark
- **Cost**: 20 Energy
- **Effect**: Scans the board for the highest scoring move and automatically swaps it, or converts 2 random non-matching tiles into matching pairs.

### Usagi: Carrot Rocket
- **Cost**: 25 Energy
- **Effect**: Fires a high-velocity rocket across the target row or column, instantly destroying blockers and harvesting tiles.

---

## 4. Game Feel & Accessibility
- **Squash and Stretch**: Tiles scale down (`0.85`) on swap and bounce (`1.15 ➔ 1.0`) on match.
- **Combo Banners**: Dynamic floating toasts ("Ngọt Ngào! ✨", "Tuyệt Đỉnh! 🔥", "Siêu Cấp! 🌈") based on cascade count.
- **Reduced Motion Support**: When `prefers-reduced-motion` is active, tile transitions use instant fade cuts instead of translation slides.
