# Little Days V2 — Phase Files

This folder is designed to be handed directly to an AI coding agent such as Antigravity.

Start with:

`00_ANTIGRAVITY_MASTER_EXECUTION_GUIDE.md`

Then execute every phase in numeric order.

## Phase Map

| File | Purpose |
|---|---|
| `01_PHASE_00_AUDIT_AND_STABILIZE.md` | Audit current code and establish a safe foundation |
| `02_PHASE_01_DATA_AND_COUPLE_PROFILE.md` | Couple profile, optional personalization, remove hard-coding |
| `03_PHASE_02_GAME_STATE_ARCHITECTURE.md` | Progression, inventory, quests, rewards, adventure model |
| `04_PHASE_03_WORLD_MAP_V2.md` | Living map, time-of-day, location registry |
| `05_PHASE_04_BUILDING_INTERIORS.md` | Unique game-like interiors for all buildings |
| `06_PHASE_05_CHARACTER_SYSTEM.md` | Chiikawa/Usagi state, abilities, bond, dialogue |
| `07_PHASE_06_AUDIO_VOICE_V2.md` | Shared audio manager, BGM, ambience, SFX, vocalization |
| `08_PHASE_07_PUZZLE_PROTOTYPE.md` | First 3 polished levels and engine validation |
| `09_PHASE_08_CAMPAIGN_30_LEVELS.md` | Full 30-level story campaign |
| `10_PHASE_09_BUILDING_UPGRADES_AND_ECONOMY.md` | Real rewards, inventory, visual upgrades |
| `11_PHASE_10_COUPLE_FEATURES.md` | Memories, letters, dates, endless couple mode |
| `12_PHASE_11_PRIVACY_BACKUP_AND_MIGRATION.md` | Local-first privacy, backup, V1→V2 migration |
| `13_PHASE_12_POLISH_PERFORMANCE_ACCESSIBILITY.md` | Performance, responsive, accessibility, PWA review |
| `14_PHASE_13_RELEASE_GITHUB_PAGES.md` | Production validation and release gate |

## Important

Do not give all files to the agent as one giant instruction and ask it to implement everything at once.

Recommended workflow:

1. Give it the master guide.
2. Give it the current phase file.
3. Let it inspect and implement only that phase.
4. Require the phase report.
5. Review.
6. Move to the next phase.

This avoids giant rewrites and makes regressions much easier to identify.
