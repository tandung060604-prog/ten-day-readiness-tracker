# PHASE 05 — CHIIKAWA AND USAGI CHARACTER SYSTEM

## Goal

Turn Chiikawa and Usagi from decorative mascots into living gameplay companions.

They must differ in personality, behavior and abilities, not just sprite/skin.

---

## Character State Machine

Support states such as:

- idle;
- walking;
- running;
- happy;
- sad;
- sleeping;
- eating;
- training;
- celebrating;
- thinking;
- surprised;
- hugging;
- interacting;
- victory.

Use a typed state model.

Do not scatter boolean flags like:

`isWalking`, `isSleeping`, `isHappy`, etc.

if they can create impossible combinations.

---

## Map Behavior

Characters should support:

- movement to selected building;
- idle near landmarks;
- waiting outside a door;
- following each other;
- random idle actions;
- sitting together;
- context reactions;
- celebration after reward.

Keep pathing simple. This is not an open-world navigation simulation.

---

# Chiikawa Role

Archetype:

**Support / Memory / Heart**

Characteristics:

- gentle;
- careful;
- emotionally expressive;
- supportive;
- memory-oriented.

Prototype abilities:

### Heart Shield
Protect an objective or reduce a negative effect.

### Memory Spark
Reveal a helpful tile/item.

### Tiny Courage
Provide one controlled comeback opportunity.

### Memory Magnet
Pull memory-related objectives closer.

### Flower Bloom
Create useful flower/booster tiles.

### Cozy Time
Pause or soften timed challenges.

Do not implement every ability in one phase if puzzle engine is not ready. Build definitions and hooks first.

---

# Usagi Role

Archetype:

**Energy / Chaos / Power**

Characteristics:

- fast;
- energetic;
- surprising;
- powerful;
- playful.

Prototype abilities:

### Ya-Haaa Burst
Clear a row and column.

### Carrot Rocket
Pierce blockers.

### Ura Rush
Increase combo reward temporarily.

### Bunny Jump
Swap two tiles.

### Crazy Merge
Instantly advance a merge group.

### Golden Carrot
Create a wildcard.

Use original animation/audio assets.

---

# Duo System

Add:

## Love Link Meter

Charge via:

- combos;
- objectives;
- complementary abilities;
- couple activity milestones.

When full:

# LITTLE DAYS MIRACLE

Possible effects:

- area clear;
- special tiles;
- extra moves;
- reward bonus;
- celebration animation.

The actual puzzle implementation lands in later phases; this phase creates the character/domain interfaces.

---

## Relationship/Bond Progression

`Couple Bond Level` is a game progression system, not a scientific measure of relationship quality.

Increase Bond from:

- completing couple quests;
- saving memories;
- dates;
- gameplay;
- achievements.

Unlock examples:

- Lv5: High Five
- Lv10: Sit Together
- Lv20: Hold Hands
- Lv30: Hug

Also unlock:

- poses;
- outfits;
- dialogue;
- decorations;
- special scenes.

---

## Dialogue System

Move dialogue to data/config.

Suggested model:

```ts
interface DialogueEvent {
  id: string
  speaker: CharacterId
  condition: DialogueCondition
  lines: string[]
  emotion: CharacterEmotion
  vocalization?: string
  animation?: CharacterState
  once?: boolean
}
```

Conditions may include:

- morning;
- night;
- birthday;
- anniversary;
- after workout;
- hydration completed;
- new memory;
- trip approaching;
- puzzle win;
- puzzle loss;
- returning after absence.

Dialogue must reflect personality differences.

---

## Asset Safety

Do not rip anime audio.

Do not claim official character assets are owned by this project.

Document every new external asset.

Prefer original/custom/fan-made assets with clearly documented usage.

---

## Tests

Test:

- state transitions;
- invalid transitions;
- bond unlock thresholds;
- Love Link charge rules;
- dialogue condition selection;
- character assignment from profile.

---

## Acceptance Criteria

- [ ] Characters use a typed state model.
- [ ] Chiikawa and Usagi have different gameplay identities.
- [ ] Dialogue is data-driven.
- [ ] Bond progression is real.
- [ ] Map and building scenes can trigger reactions.
- [ ] Hooks exist for puzzle abilities.
- [ ] No official voice cloning is used.
- [ ] Phase report exists.

---

## Required Output

Create:

- `docs/v2/V2_CHARACTER_SYSTEM.md`
- `docs/v2/CHARACTER_STATE_MACHINE.md`
- `docs/v2/reports/PHASE_05_REPORT.md`

Then stop.
