# BUILDING INTERACTION MATRIX — LITTLE DAYS V2

| Building ID | Scene Component | Key Focal Interaction | Primary Data Store | SFX / Audio Hook | Companion Action |
|---|---|---|---|---|---|
| `home` | `HomeInterior` | Living room sofa check-in & photo frame | `CoupleProfile`, `DayLog` | Hearth fireplace & chime | Chiikawa reads on couch |
| `quests` | `QuestSquareInterior` | Quest notice board & streak chest claim | `GameState` (Quests, Currencies) | Town fanfare & chest open | Usagi bounces by noticeboard |
| `gym` | `TrainingView` (Dojo) | Workout routine checklist & rest stopwatch | `DayLog.workout` | Motivational whistle & workout finish | Coach Usagi celebratory dance |
| `water` | `WaterFountainInterior` | Animated fountain fill (0-100%) + Quick pour | `DayLog.waterMl`, `waterTargetMl` | Water bubbling & splash chime | Chiikawa splashes water |
| `sleep` | `SleepHavenInterior` | 4-7-8 Breathing relaxation & bedtime log | `DayLog.metrics`, `SleepEntry` | Nocturnal windchime & deep breath tone | Chiikawa sleeps under blanket |
| `journal` | `JournalView` (Memory Library) | Storybook memory reader & capsule lock | `DayLog.notes`, `journals` | Page turn & antique clock tick | Chiikawa reads with glasses |
| `album` | `PhotoStudioInterior` | Polaroid corkboard & Memory of the Month | `CoupleProfile.photos`, `DayLog.photos` | Polaroid shutter click | Usagi takes camera snapshot |
| `market` | `MealsView` (Little Market) | Shopping basket picker & meal plan | `DayLog.meals`, `FridgeInventory` | Basket rustle & register bell | Chiikawa balances apple |
| `restaurant` | `RestaurantInterior` | Random date idea generator & romantic wishlist | `CoupleProfile.preferences`, `datePlans` | Wine clink & soft jazz | Chiikawa/Usagi serve sparkling drink |
| `airport` | `AirportInterior` | Departure flight board & packing checklist | `DayLog.packingItems`, `tripConfig` | Airport chime & suitcase roll | Usagi rolls suitcase |
| `beach` | `BeachAdventureInterior` | Adventure map readiness & beach goals | `DayLog.checklist`, `readinessScore` | Ocean waves & tropical breeze | Chiikawa in straw hat |
| `settings` | `SettingsView` (Town Hall) | Personal profile personalization & privacy vault | `UserSettings`, `CoupleProfile` | Clocktower chime & gear shift | Chiikawa mayor stamp |
| `hospital` | `LoveHospitalView` (Love Clinic) | Cycle calendar & boyfriend care guide | `menstrualLogs`, `UserSettings.privacy` | Herbal tea kettle & gentle rain | Chiikawa brings warm tea |
