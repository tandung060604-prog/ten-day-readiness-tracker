# PERSONALIZATION & PRIVACY POLICY — LITTLE DAYS V2

## 1. Core Principles & Philosophy
Little Days V2 is designed strictly as an **Offline-First, Zero-Tracking, Client-Side Application**. No personal relationship data, photos, diary entries, cycle records, or GPS coordinates are ever transmitted to third-party tracking servers or cloud databases.

---

## 2. Data Classification Matrix

| Data Classification | Examples | Storage Location | Privacy Protection |
|---|---|---|---|
| **Public / Static Assets** | Mascot audio, tile assets, story text | Bundle (`/assets`) | None needed |
| **Non-Sensitive Game State** | Town building tiers, coins, stars, puzzle progress | `localStorage` | Unencrypted / Structured JSON |
| **Personal Couple Profile** | Partner nicknames, relationship anniversary date | `localStorage` | Local only / Optional PIN gate |
| **Highly Sensitive Data** | Health & cycle logs, private journal entries, love letters | `localStorage` / Vault | Optional 4-digit PIN gate + AES-GCM 256-bit backup |
| **Location Data** | Current city / timezone | Memory / Settings | **Strictly Opt-in GPS (Default: Disabled)** |

---

## 3. Medical & Health Prediction Disclaimers
> [!IMPORTANT]
> All biological wellness calculations and cycle predictions provided in Little Days V2 are rough estimates calculated on device for personal tracking convenience.
> **Predictions are estimates and are not medical advice.**
> Never use this application as a substitute for professional medical guidance or clinical contraception.

---

## 4. GPS & Location Policy
- Precise device geolocation is **never accessed silently**.
- The application only queries GPS upon explicit user action (e.g. "Tải thời tiết hiện tại").
- Only city name and timezone are retained; exact latitude/longitude coordinates are discarded immediately after weather lookup.
