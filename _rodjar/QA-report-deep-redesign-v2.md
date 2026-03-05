# QA Report — Deep Redesign V2
**Date:** 2026-03-05  
**Branch:** `feature/deep-redesign-v2`  
**QA Agent:** QA Tester  
**Design spec:** `_rodjar/design-spec-v2.md`  
**Pre-implementation design score:** 9.0/10 (63/70)

---

## Overall Verdict

**CONDITIONAL PASS**

TypeScript is clean, the web bundle compiles, and the core naturalist aesthetic is present. The AnimonCard specimen label strip — the most important signature element — is well-executed. However, the implementation contains a cluster of medium-to-critical issues: the camera screen breaks the token system with untokenized "generic gold" gradient colors that were explicitly named as rejected defaults in the design spec; the LED glow physics are absent from the TabBar; the RarityBadge stamp depth is incomplete; and the Detail screen's specimen ID block deviates from spec in a way that changes its entire character. Microinteractions defined in the spec are not implemented. The implementation score (47/70 = 6.7/10) versus the design score (63/70 = 9.0/10) represents a meaningful execution gap. Fix the HIGH bugs before this branch merges.

---

## 1. TypeScript

**CLEAN — 0 errors**

```
npx tsc --noEmit
TSC_EXIT: 0
```

No type errors on the branch.

---

## 2. Web Bundle

**PASS — compiled successfully**

```
web bundles (2):
  _expo/static/css/web-09209626809a662e57a94f11586cb2e3.css (8.2KB)
  _expo/static/js/web/entry-880fa7d4d70390480005792bb93493a3.js (2.3MB)

EXIT: 0
```

Both the CSS and JS bundles compiled without errors.

---

## 3. Refactoring-UI Score (Implementation)

> Spec design score before implementation: **63/70 = 9.0/10**
> Implementation score: **47/70 = 6.7/10**

### Principle 1 — Visual Hierarchy: 7/10

The four-level ink scale (`inkBlack` → `inkBrown` → `inkFaded` → `inkGhost`) is correctly established in the token system and applied throughout most of the app. The AnimonCard specimen label hierarchy is exemplary: species name (Space Mono italic, inkBlack) > accession number (xs, inkFaded) > region (xs, inkFaded, right-aligned). The forestFloor header / specimenCream body contrast creates a strong screen-level hierarchy.

**Deductions:** The stat chips on the Discover screen lack the individual `insetPanel` background and `inkRule` border specified in the design. As implemented, they are bare stacked-text units inside a shared `parchment` row with no individual delineation. The value and label do not pop apart from each other with the physical gravity the spec intended (-1). Section rule labels in `index.tsx` use `letterSpacing: label` (0.5) instead of `widest` (2.0) per spec, reducing their authority (-0.5). Rounding to 7.

### Principle 2 — Spacing & Sizing: 8/10

4pt grid is followed throughout. Card heights are hard-coded at specification values: 210px full card, 140px compact card. Internal padding values are consistent: 8px (card interior), 12px (panel interior), 16px (screen edge), 20px (screen headers), 24px (between sections). The 65%/35% card zone split creates consistent visual mass regardless of card width variation.

**Deductions:** `sectionRuleStyles.wrap` in `milestones.tsx` uses `gap: 10` rather than 8 or 12 (-0.5). Minor but technically off the 4pt grid.

### Principle 3 — Typography: 7/10

Three-family system (Playfair Display, DM Sans, Space Mono) is cleanly separated with zero role overlap. Playfair handles species names and screen titles. DM Sans handles body and UI labels. Space Mono handles all data readouts, accession numbers, and tab labels. The modular size scale (10→48) is referenced correctly throughout.

**Deductions:** Section rule labels in `index.tsx` use `typography.letterSpacing.label` (0.5) instead of `widest` (2.0) as specified — these should feel like engraved field journal dividers (-0.5). The screen title "Field Log" in `index.tsx` applies `fontStyle: 'italic'` to `typography.fontFamily.heading` (the non-italic font alias) rather than `typography.fontFamily.headingItalic`. These map to the same underlying font face, so it technically works, but the alias explicitly exists to be paired with italic and is not being used (-0.5). Camera screen `statusText` uses `fontSize: 13` (hardcoded) rather than `typography.fontSize.base` (which IS 13, so visually identical — but the token reference is missing). Minor.

### Principle 4 — Color: 6/10

The token system itself (`colors.ts`) is the strongest element of the entire codebase. Domain-named tokens, full rarity scale, structured amber/forest/ink scales — this is the 10/10 design work. Where the tokens are used, they're used correctly.

**Deductions:** The camera screen shutter button gradient uses `['#D4AF37', '#FFD700', '#B8860B', '#FFD700', '#D4AF37']` — these are classic generic gold/yellow colors and include `#FFD700` (CSS `gold`), not amber. The design spec explicitly rejected generic gold under "DEFAULT 2 — REJECTED" and named amberResin (#C6882A) and amberGlow (#E8B455) as the replacements. The shutter gradient visually reads as a gold ring, not an amber instrument dial. This is a direct violation of the design's most explicit rule (-2). The container `backgroundColor: '#0F0A05'` is not a token (closest is `deviceBezel: '#1A1510'`) (-0.5). The viewfinder overlay `rgba(0,0,0,0.48)` should use the warm `overlayDark (rgba(26,21,16,0.60))` — pure black flattens the instrumental warmth (-0.5). Milestones `TIER_COLORS: { Bronze: '#CD7F32', Silver: '#A8A9AD', Gold: '#F59E0B' }` are entirely outside the token system and use generic game-medal colors (-0.5). Profile/Detail screens use raw `rgba(245,240,232,0.xx)` opacity variants instead of named tokens (-0.5).

### Principle 5 — Shadows & Depth: 5/10

The border-only discipline for regular cards is correctly maintained. There are no floating drop shadows on cards. TypeTagChip has the correct inset bevel (white highlight on top, type color on bottom). AnimonCard compact accession tag uses `rgba(26,21,16,0.65)` dark overlay correctly.

**Deductions: The LED glow shadow is not implemented (-2).** The spec defines `{ shadowColor: amberGlow, shadowRadius: 5, shadowOpacity: 0.9, elevation: 3 }` for the active LED dot. This is the most physically-motivated shadow in the entire system — it *is* the thing that makes the tab bar feel like an instrument with real illuminated indicators. The current implementation silently replaces the glow with `opacity: 1` after a comment noting "native shadow not reliable in a tab bar." Native shadow works on a `View` within a tab bar container — this should be re-attempted. RarityBadge is missing the asymmetric border depth (+1px top lighter, +2px bottom darker) that creates the stamp-pressed-into-paper feel (-1). The stamp impression reads as a flat pill with a border, not a rubber stamp. Camera result card uses `shadowColor: '#000'` inline rather than a token.

### Principle 6 — Borders: 7/10

`inkRule` is used consistently across cards, panels, separators, and form elements throughout all screens. AnimonCard border treatment by rarity is implemented correctly (1px `inkRule` for common, 1.5px `forestMid` for uncommon, cobalt wrapper for rare, gradient wrapper for glossy). The `ruleColor` → `inkRule` rename from the spec's token test is in place.

**Deductions:** The Detail screen ID strip deviates significantly from the spec. Spec says: `backgroundColor: cardStock` (cream), `borderColor: inkRule` (inkRule line on cream surface = herbarium label). Implementation: `backgroundColor: deviceBezel` (near-black), `borderColor: instrumentBrass`. This transforms the component from a "specimen label pasted onto card stock" into a "dark instrument panel readout" — it changes the design vocabulary of the component. The amber `inkAmber` text color is correct for a dark background, but the background colour itself deviates (-1). Section rule in `milestones.tsx` uses a centered symmetric layout (line | label | line) rather than the left-justified "partially filled field journal line" (label | line-to-edge) used in `index.tsx` — inconsistent implementation of the same component (-0.5).

### Principle 7 — Components & Patterns: 7/10

AnimonCard is the strongest component in the codebase. Both full and compact variants exactly match the spec. The specimen label strip (inkRule separator, Space Mono italic species, accession number, TypeTagChips, region) is present and correct in the full card. The compact accession tag overlay (dark overlay, amberFaint Space Mono text, top-right corner) is precisely implemented. RarityBadge asymmetric borderRadius (2/4/2/4) is present. TypeTagChip inset treatment is correct.

**Deductions:** Camera shutter button design breaks the amber system with generic gold gradient (-0.5). Detail screen stats grid uses `deviceBezel` background and `borderRadius: 12` instead of the specified `forestFloor` + `borderRadius: 4` (-0.5). The instrument-panel stat cells should have the authority of the deep forest green — they currently blend with the dark surround. Microinteractions defined in the spec are entirely absent (-1): no stamp animation on new capture, no LED switch animation in tab bar, no scanner reticle lock-on animation. These were defined with specificity and represent real physical-world moments with no implementation. Milestones achieves a generic Bronze/Silver/Gold tier system using medal colors (`#CD7F32` etc.) — this is game-UI language that undermines the field naturalist concept (-0.5).

### Total Score: 47 / 70 = 6.7/10

| Principle | Pre-design | Implementation | Delta |
|---|---|---|---|
| Visual Hierarchy | 9 | 7 | -2 |
| Spacing & Sizing | 9 | 8 | -1 |
| Typography | 9 | 7 | -2 |
| Color | 10 | 6 | -4 |
| Shadows & Depth | 8 | 5 | -3 |
| Borders | 9 | 7 | -2 |
| Components & Patterns | 9 | 7 | -2 |
| **Total** | **63** | **47** | **-16** |

---

## 4. Signature Element Check

| Element | Spec location | Status | Notes |
|---|---|---|---|
| Specimen label strip in AnimonCard (full) | §6.1 | ✅ PRESENT | inkRule separator, Space Mono italic species, right-aligned accession, TypeTagChips + region — correctly implemented |
| Accession tag in AnimonCard (compact) | §6.1 | ✅ PRESENT | Top-right dark overlay, Space Mono `amberFaint` text — correct |
| RarityBadge stamp impression | §6.3 | ⚠️ PARTIAL | Asymmetric borderRadius present; stamp depth via asymmetric borderWidth ABSENT |
| TypeTagChip inset/recessed band | §6.4 | ✅ PRESENT | White highlight top border, type color bottom/side borders, neutral fill |
| Specimen ID block (Detail screen) | §7.4 | ⚠️ PARTIAL | Present, but on dark `deviceBezel` background instead of cream `cardStock` — changes design vocabulary |
| TabBar LED indicators | §6.2 | ⚠️ PARTIAL | LED dots present; amber glow shadow (the actual "LED bleed") is absent |

**Signature elements present (complete):** 2/6  
**Signature elements partial:** 3/6  
**Signature elements absent:** 1/6  

The most critical signature element (specimen label strip) is correctly implemented. Two others are present but incomplete in ways that reduce their distinctiveness.

---

## 5. Issues Found

---

### [B-QA2-001] Camera shutter gradient uses generic gold colors, not amber tokens
**Severity: HIGH**  
**File:** `src/app/camera.tsx` lines 188–189  
**Description:** The shutter button gradient uses `['#D4AF37', '#FFD700', '#B8860B', '#FFD700', '#D4AF37']`. `#FFD700` is CSS `gold`, `#D4AF37` is standard metallic gold. The design spec §1.3 ("Named Defaults Rejected") explicitly describes rejecting `gold (too metallic)` in favour of `amberResin (#C6882A)`. The shutter button is a primary UI element and the camera screen's focal point.  
**Expected:** Gradient using `colors.amberResin` + `colors.amberGlow` + `colors.amberFaint` e.g. `[colors.amberDeep, colors.amberResin, colors.amberGlow, colors.amberResin, colors.amberDeep]`

---

### [B-QA2-002] TabBar LED glow shadow absent
**Severity: HIGH**  
**File:** `src/components/layout/TabBar.tsx` lines 178–183  
**Description:** The active LED dot has `opacity: 1` with a comment "native shadow not reliable in a tab bar". The spec defines `shadowColor: amberGlow, shadowRadius: 5, shadowOpacity: 0.9, elevation: 3` as the physically-motivated light bleed of an actual LED illuminating. Without this, the tab bar looks like colored dots rather than a glowing instrument panel. Native shadow is available on Views in React Native — this should be re-attempted.  
**Expected:** `ledActive` style adds `shadowColor: colors.amberGlow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 3`

---

### [B-QA2-003] Camera screen uses untokenized inline hex `#0F0A05` for container background
**Severity: MEDIUM**  
**File:** `src/app/camera.tsx` line 254  
**Description:** `backgroundColor: '#0F0A05'` is a near-black value not present in the token system. Closest token is `deviceBezel: '#1A1510'` or `deviceBody: '#2A2318'`.  
**Expected:** `backgroundColor: colors.deviceBezel`

---

### [B-QA2-004] Camera viewfinder overlay uses pure black `rgba(0,0,0,0.48)` instead of `overlayDark`
**Severity: MEDIUM**  
**File:** `src/app/camera.tsx` line 261  
**Description:** The overlay on the viewfinder is pure black at 48% opacity. The token `overlayDark` is defined as `rgba(26,21,16,0.60)` — the dark walnut color used across the system. Pure black creates a colder, flatter overlay that reduces the warm instrument feel of the camera screen.  
**Expected:** `backgroundColor: colors.overlayDark`

---

### [B-QA2-005] Flash icon uses emoji ⚡ as UI element
**Severity: MEDIUM**  
**File:** `src/app/camera.tsx` line 199  
**Description:** `<Text style={styles.flashIcon}>⚡</Text>` renders an emoji as a primary interactive button icon. The task brief explicitly flags "emoji as primary UI element" as a quirk hunt target. The tab bar and camera screen both explicitly comment "not emoji" for their icons. The flash button is inconsistent.  
**Expected:** Use a Unicode text symbol or SVG icon consistent with the instrument vocabulary. E.g., `⚡` could be replaced with a text character like `✦` or a thin stroke SVG icon.

---

### [B-QA2-006] Location pin emoji 📍 used in camera result card
**Severity: MEDIUM**  
**File:** `src/app/camera.tsx` line 235  
**Description:** `<Text style={styles.resultRegion}>📍 {MOCK_RESULT.region}</Text>` uses the location pin emoji as a UI affordance. Same issue as B-QA2-005. The result card is part of the camera's instrument interface, not free text content.  
**Expected:** Use a text character (e.g., `▲` or `◉`) consistent with design vocabulary, or simply the region text without a decorative prefix.

---

### [B-QA2-007] Milestones tier colors use inline hex outside token system
**Severity: MEDIUM**  
**File:** `src/app/(tabs)/milestones.tsx` line 36  
**Description:** `const TIER_COLORS = { Bronze: '#CD7F32', Silver: '#A8A9AD', Gold: '#F59E0B' }` defines three colors not in the token system. These are standard game-medal colors (Bronze/Silver/Gold) which introduce an entirely different design language. `Gold: '#F59E0B'` is close to amber but is visually a different hue system.  
**Expected:** Either map tiers to existing tokens (`rarity.common` → bronze equivalent, `forestMid` → silver, `amberResin` → gold) OR add named tokens (`tierBronze`, `tierSilver`, `tierGold`) to `colors.ts` with domain-appropriate values. The Bronze/Silver/Gold naming is also generic game vocabulary rather than naturalist vocabulary — consider `Specimen`, `Collector`, `Naturalist` as tier names.

---

### [B-QA2-008] AnimonCard glossy shimmer uses inline hex array instead of token references
**Severity: MEDIUM**  
**File:** `src/components/ui/AnimonCard.tsx` lines 134, 230  
**Description:** `colors={['#C6882A', '#E8B455', '#D4A040', '#F5E4B5', '#C6882A']}` The first, second, and fifth values correspond exactly to existing tokens (`colors.amberResin`, `colors.amberGlow`, `colors.amberFaint`). The third value `#D4A040` has no token equivalent. Using raw hex strings rather than token references makes the gradient invisible to future token refactors.  
**Expected:** `colors={[colors.amberResin, colors.amberGlow, '#D4A040', colors.amberFaint, colors.amberResin]}` and add a named token for `#D4A040` (e.g., `amberMid: '#D4A040'`).

---

### [B-QA2-009] AnimonCard glossy label strip background `#F2E8C8` not tokenized
**Severity: LOW**  
**File:** `src/components/ui/AnimonCard.tsx` line 160  
**Description:** `'#F2E8C8'` is used as the glossy card label strip background (slightly warmer cream for "gold-leaf sizing" reference). The intent is documented in a comment but the value is not a token.  
**Expected:** Add `goldSizing: '#F2E8C8'` (or similar) to `colors.ts` and reference it here.

---

### [B-QA2-010] AnimonCard rare double-rule border uses inline rgba values
**Severity: LOW**  
**File:** `src/components/ui/AnimonCard.tsx` lines 439, 445  
**Description:** `borderColor: 'rgba(42,75,138,0.40)'` — this is `colors.rarity.rare` (`#2A4B8A`) at 40% opacity. TypeTagChip uses a helper `hexToRgba()` function for exactly this pattern. AnimonCard should use the same approach.  
**Expected:** `borderColor: hexToRgba(colors.rarity.rare, 0.40)` or inline the `hexToRgba` helper.

---

### [B-QA2-011] RarityBadge missing stamp-depth via asymmetric border widths
**Severity: MEDIUM**  
**File:** `src/components/ui/RarityBadge.tsx` lines 57–62  
**Description:** The spec (§6.3) defines stamp impression depth via asymmetric borders: `borderTopWidth: 1` (lighter/highlight), `borderBottomWidth: 2` (rarity color darker, heavier). The implementation uses flat `borderWidth: 1` on all sides. Without this, the badge reads as a flat border label, not a rubber stamp impression.  
**Expected:** 
```tsx
borderTopWidth: 1,
borderBottomWidth: 2,
borderLeftWidth: 1,
borderRightWidth: 1,
```
And the corresponding color split: top border uses the rarity color at 40% opacity (lighter, as if the stamp lifted off the surface there), bottom uses 80% (where the stamp made contact with more pressure).

---

### [B-QA2-012] Detail screen Specimen ID block uses `deviceBezel` instead of `cardStock`
**Severity: MEDIUM**  
**File:** `src/app/animon/[id].tsx` lines ~226–237  
**Description:** The spec defines the Specimen ID block as: `backgroundColor: cardStock, borderColor: inkRule, borderRadius: 4` — a cream herbarium label. The implementation uses `backgroundColor: colors.deviceBezel` (near-black), `borderColor: colors.instrumentBrass`, `borderRadius: 8`. This inverts the component from a "cream paper label with ink markings" to a "dark instrument display panel". The text color (`inkAmber`) makes sense on dark but loses the herbarium card metaphor entirely.  
**Expected:** `backgroundColor: colors.cardStock, borderColor: colors.inkRule, borderRadius: 4`. With the cream background, `idLabel` should use `inkFaded` (already correct) and `idValue` should switch to `colors.inkBlack` (dark ink on cream paper — the herbarium label).

---

### [B-QA2-013] Detail screen stats grid uses `deviceBezel` instead of `forestFloor`
**Severity: LOW**  
**File:** `src/app/animon/[id].tsx`  
**Description:** Spec says stats cells use `backgroundColor: forestFloor` (`#1A3020` — deep forest green). Implementation uses `colors.deviceBezel` (`#1A1510` — near-black). Both are dark, but `forestFloor` provides the characteristic forest-floor authority described in the domain exploration. The borderRadius is also 12 vs spec's 4.  
**Expected:** `backgroundColor: colors.forestFloor, borderRadius: 4`

---

### [B-QA2-014] Discover screen section rule labels use wrong letterSpacing
**Severity: LOW**  
**File:** `src/app/(tabs)/index.tsx`  
**Description:** `sectionRuleLabel.letterSpacing` uses `typography.letterSpacing.label` (0.5). The spec §7.1 says: `Space Mono, 10px, inkFaded, letterSpacing: widest (2.0)`. At 0.5 spacing the section labels feel like metadata. At 2.0 spacing they feel like engraved field journal headings.  
**Expected:** `letterSpacing: typography.letterSpacing.widest`

---

### [B-QA2-015] Discover screen stat chips deviate from spec (missing insetPanel individual cells)
**Severity: LOW**  
**File:** `src/app/(tabs)/index.tsx`  
**Description:** Spec §7.1 defines stat chips as: individual chips with `backgroundColor: insetPanel`, `borderWidth: 1`, `borderColor: inkRule`, `borderRadius: 4`, in a horizontal ScrollView with `gap: 8`. Implementation presents stacked-text units in a shared `parchment` bar with `justifyContent: 'space-around'`. The individual chip borders are absent — the data cells have no physical delineation.  
**Expected:** Each stat chip should have its own `backgroundColor: colors.insetPanel`, `borderWidth: 1`, `borderColor: colors.inkRule`, `borderRadius: 4`, with horizontal padding 12px.

---

### [B-QA2-016] Multiple screens use inline rgba for opacity variants of token colors
**Severity: LOW**  
**Files:**   
- `src/app/(tabs)/profile.tsx` lines 60, 221, 350: `rgba(17,34,14,0.55)`, `rgba(245,240,232,0.60)`, `rgba(245,240,232,0.75)`  
- `src/app/animon/[id].tsx` lines 196, 203, 220, 224  
**Description:** These opacity variants of `inkInverse` (`#F2EDD7`) and `forestFloor` are scattered as raw rgba strings. While the hex components are derived from token values, they bypass the token system.  
**Expected:** Either define opacity variants as tokens (e.g., `inkInverseFaded: 'rgba(242,237,215,0.60)'`) or use a helper function. At minimum document these as intentional alpha compositions of existing tokens.

---

### [B-QA2-017] Milestones SectionRule uses symmetric centered decoration, inconsistent with Discover
**Severity: LOW**  
**File:** `src/app/(tabs)/milestones.tsx`  
**Description:** The SectionRule component in milestones.tsx renders a symmetric `line | label | line` pattern (two flanking rules). In `index.tsx`, SectionRule renders `label | line-to-right-edge` (left-aligned label, single extending rule). Spec §7.1 defines the left-label-plus-extending-rule pattern. Two different implementations of the same design element.  
**Expected:** Both screens should share the same SectionRule component. Extract the `index.tsx` implementation (correct per spec) into a shared component.

---

### [B-QA2-018] Milestones achievement data contains unused `emoji` field
**Severity: LOW (code quality)**  
**File:** `src/app/(tabs)/milestones.tsx` lines 28–33  
**Description:** Each achievement object has an `emoji` field (`🎯`, `🗺️`, `🔮`, `✨`, `💯`, `🌎`) that is never referenced in the render code. The implementation uses `◆/◇` text symbols for the achievement icon instead. The emoji field is dead code.  
**Expected:** Remove the `emoji` property from the ACHIEVEMENTS array or render it. Note: if rendered, these emoji would be UI-as-emoji violations — so remove is the correct action.

---

### [B-QA2-019] Microinteractions from spec not implemented
**Severity: MEDIUM (scope gap)**  
**File:** N/A — all screens  
**Description:** The design spec defines four microinteractions in §8. None are implemented:
1. **Capture Stamp** — RarityBadge stamp animation (scale from 0.5 → 1.05 → 1.0, rotate, amber flush) on new specimen addition
2. **Scanner Reticle Lock-On** — reticle brackets close, status text changes, scan line pauses, SCAN button pulses when confidence threshold crossed
3. **Tab LED Activation** — LED scale/color/shadow animate as a physical switch (currently static onChange, no transition)
4. **Glossy Card Shimmer Reveal** — first-time shimmer entry animation  

These are not regressions (they were not in a prior version), but they represent a 16-point gap between the design spec's animation intent and the implementation. The reticle lock-on animation in particular is a key moment of scanner feedback.  
**Expected:** Implement as specified in §8. Priority order: (3) LED activation (easiest, highest visibility), (2) scanner reticle lock-on (core UX moment), (1) capture stamp (novel delight), (4) shimmer reveal (polish).

---

### [B-QA2-020] Profile hero overlay uses inline rgba instead of token
**Severity: LOW**  
**File:** `src/app/(tabs)/profile.tsx` line 60  
**Description:** `{ backgroundColor: 'rgba(17,34,14,0.55)' }` is an approximation of `forestFloor` at reduced opacity. The token `overlayDark` (`rgba(26,21,16,0.60)`) is close but uses a different base (warm walnut vs forest floor).  
**Expected:** Either use `colors.overlayDark` or define `overlayForest: 'rgba(26,48,32,0.55)'` (forest floor at 55% opacity) as a named token.

---

## 6. Inline Hex Audit Summary

| File | Violations | Severity |
|---|---|---|
| `src/app/camera.tsx` | `#0F0A05`, `#3A3530`, `#2C2416`, `#D4AF37`, `#FFD700`, `#B8860B`, `rgba(0,0,0,0.48)`, `rgba(255,255,255,0.08)`, `rgba(244,225,176,0.15)`, `rgba(255,255,255,0.20)`, `shadowColor: '#000'` | HIGH (shutter gradient), MEDIUM (overlay), LOW (others) |
| `src/app/(tabs)/milestones.tsx` | `#CD7F32`, `#A8A9AD`, `#F59E0B` | MEDIUM |
| `src/components/ui/AnimonCard.tsx` | `#C6882A`, `#E8B455`, `#D4A040`, `#F5E4B5` (shimmer), `#F2E8C8` (glossy label), `rgba(42,75,138,0.40)` | MEDIUM (shimmer), LOW (others) |
| `src/app/(tabs)/profile.tsx` | `rgba(17,34,14,0.55)`, `rgba(245,240,232,0.60)`, `rgba(245,240,232,0.75)` | LOW |
| `src/app/animon/[id].tsx` | `rgba(26,18,8,0.88)`, `rgba(0,0,0,0.50)`, `rgba(245,240,232,0.80)`, `rgba(26,18,8,0.70)`, `rgba(255,255,255,0.15)` | LOW |

**Total inline color violations: 24**  
**Zero inline hex in:** `colors.ts`, `typography.ts`, `RarityBadge.tsx`, `TabBar.tsx`, `EmptyState.tsx`, `anilog.tsx` ✅  

---

## 7. Design Quality Assessment

### What the implementation gets right

- **AnimonCard specimen label strip** is the most precise execution of the spec in the entire codebase. Full card and compact variants both correctly implement the herbarium label metaphor. The horizontal rule separator, Space Mono italic species, right-aligned accession number, and region text are all present. This is what a well-executed signature element looks like.
- **TypeTagChip inset treatment** is correctly implemented. The white highlight on the top border and type-color darkening on the bottom border creates a genuine recessed feeling without any shadow.
- **Color token system** is excellent. The domain-derived names (`specimenCream`, `inkBlack`, `amberResin`, `forestFloor`) pass the token test from the spec. If all these tokens were used correctly throughout, the color score would be 9+.
- **TabBar structure** has the correct skeleton: dark deviceBezel base, 2px brass top rule, rivet detail at left and right, Unicode symbols (not emoji) for tab icons. The foundation is right.
- **Three-font system** is consistently applied. Playfair for species/titles, DM Sans for UI/body, Space Mono for data readouts. The hierarchy is clear and consistent.

### Where the implementation falls short

**The camera screen is the weakest screen.** It breaks the amber token discipline with generic gold shutter gradient colors that are the precise visual pattern the spec rejected by name. The flash button is emoji. The location pin is emoji. The viewfinder overlay is pure black rather than the warm walnut dark. This is the most frequently-used screen in the app (every capture starts here) and it has the highest density of violations.

**The depth system is incomplete.** Two of the most physically-motivated depth effects in the spec — the LED glow bleed on the active tab and the rubber stamp impression on RarityBadge — are absent. The tab bar specifically feels like it has colored dots rather than illuminated indicators as a result.

**The Detail screen breaks the herbarium label metaphor.** The Specimen ID block and stats grid were specified on light cream (`cardStock`) and forest green (`forestFloor`) respectively. Both render on near-black `deviceBezel` instead. For the ID block, this converts a "cream label pinned below a specimen" into a "dark readout panel" — a functionally different design language. The herbarium label is the entire signature of this product.

**Generic tier system undermines the milestones concept.** Bronze/Silver/Gold with medal hex colors is the default game-achievement vocabulary. The design spec spent considerable effort naming and rejecting defaults. An achievement tier system using field naturalist vocabulary (`Specimen`, `Collector`, `Naturalist`) with colors from the domain palette would reinforce the brand.

---

## 8. Final Assessment

The `feature/deep-redesign-v2` branch scores **47/70 (6.7/10)** on implementation versus **63/70 (9.0/10)** on the original design. The gap comes from execution, not concept. The core design vocabulary is established and the AnimonCard signature element — the single most important component — is correctly implemented. The architecture, tokens, and typography system are a solid foundation.

The branch is in CONDITIONAL PASS state: TypeScript is clean, web bundle compiles, the naturalist aesthetic is recognisably present. However, the camera screen token violations, absent LED glow, incomplete RarityBadge depth, and deviating Detail screen ID block are concrete issues that reduce the "genuinely professional app with unique craft" standard required. The microinteractions gap is larger scope but represents the difference between an app with a designed identity and an app that feels alive.

**Before merge, fix:** B-QA2-001 (HIGH — camera shutter colors), B-QA2-002 (HIGH — LED glow shadow), B-QA2-005, B-QA2-006 (emoji UI in camera), B-QA2-012 (ID block background).  
**Post-merge / next sprint:** Microinteractions (B-QA2-019), milestones tier system (B-QA2-007), remaining MEDIUM issues.
