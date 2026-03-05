# Task Brief: Fix HIGH + Key MEDIUM Bugs from QA Round 2
**Assigned to:** Frontend Developer  
**Priority:** HIGH  
**Date:** 2026-03-05  
**Branch:** `feature/deep-redesign-v2`

---

## CONTEXT

QA scored the implementation 6.7/10 vs the design spec's 9.0/10. There are 5 HIGH bugs and several high-impact MEDIUM bugs to fix. Fix all HIGH bugs and the MEDIUM bugs listed here before requesting another QA pass.

Read the full QA report first: `_rodjar/QA-report-deep-redesign-v2.md`
Read the design spec: `_rodjar/design-spec-v2.md`

---

## HIGH BUGS — All must be fixed

### B-QA2-001 — Camera shutter gradient uses generic gold (explicit design rejection)

**File:** `src/app/camera.tsx`

The shutter button uses `['#D4AF37', '#FFD700', '#B8860B', '#FFD700', '#D4AF37']` gradient colors including `#FFD700` (CSS gold). The design spec *explicitly* rejected generic gold as DEFAULT 2 and named `amberResin (#C6882A)` and `amberGlow (#E8B455)` as the correct amber.

**Fix:** Replace the shutter button gradient with:
```
colors: [colors.amberDeep, colors.amberResin, colors.amberGlow, colors.amberResin, colors.amberDeep]
```
Also fix the container `backgroundColor: '#0F0A05'` → `colors.deviceBezel`
Also fix the viewfinder overlay `rgba(0,0,0,0.48)` → `colors.overlayDark`

### B-QA2-002 — LED active glow shadow absent from TabBar

**File:** `src/components/layout/TabBar.tsx`

The active tab LED dot has `opacity: 1` but no glow shadow. The spec defines:
```
shadowColor: colors.amberGlow,
shadowRadius: 5,
shadowOpacity: 0.9,
elevation: 3,
```
on the active LED dot View. This is the key element that makes the tab bar feel like a real instrument panel with illuminated indicators.

**Fix:** Add the amber glow shadow to the active LED indicator View.

### B-QA2-005 — ⚡ emoji used as flash button UI

**File:** `src/app/camera.tsx`

The flash toggle button uses a `⚡` emoji as its icon. Emojis are not acceptable as interactive UI elements.

**Fix:** Replace the emoji with a Unicode character or text label. Use `'F'` for flash off and `'★F'` for flash on, or use the letter `F` with an overline: `'F̄'`. Alternatively use a simple line character or the platform-appropriate camera UI convention. Keep it simple — a styled `<Text>` with a descriptive letter is fine.

### B-QA2-006 — 📍 emoji used as location affordance

**File:** `src/app/camera.tsx`

The capture result card uses a `📍` emoji as a location marker.

**Fix:** Replace with a text character like `◉` or `⊙` styled in `amberResin`, or just the plain text "LOC" in Space Mono small caps. The pin emoji is jarring against the naturalist design language.

### B-QA2-012 — Detail screen Specimen ID block inverts herbarium metaphor

**File:** `src/app/animon/[id].tsx`

The Specimen ID block (containing the accession number, species ID, taxonomy) has:
- `backgroundColor: colors.deviceBezel` (near-black dark)
- `borderColor: colors.instrumentBrass`
This makes it look like a dark instrument panel, NOT a herbarium specimen label pasted onto card stock.

**Fix:** Change to:
- `backgroundColor: colors.cardStock` (cream card stock)
- `borderColor: colors.inkRule`
- Text colour: `colors.inkBlack` (not `colors.inkAmber` — inkAmber is for dark panels only)
- Accession number text: `colors.inkFaded` in Space Mono

---

## MEDIUM BUGS — Fix these too

### B-QA2-003 — Section rule labels use wrong letterSpacing

**Files:** `src/app/(tabs)/index.tsx`, other screens that have section rule labels

Section titles (e.g. "RECENTLY CAUGHT", "NEARBY ACTIVITY") should use `typography.letterSpacing.widest` (2.0) to feel like engraved field journal dividers. Currently using `typography.letterSpacing.label` (0.5).

**Fix:** Change `letterSpacing: typography.letterSpacing.label` → `typography.letterSpacing.widest` on section header Text elements.

### B-QA2-007 — Milestones tier colours use generic game-medal palette

**File:** `src/app/(tabs)/milestones.tsx`

The milestone tiers use `Bronze: '#CD7F32', Silver: '#A8A9AD', Gold: '#F59E0B'` — generic game UI medal colors that break the naturalist design language.

**Fix:** Map tiers to the correct token system:
- Bronze → `colors.inkFaded` (muted ink, early-stage)
- Silver → `colors.lichenGray` (lichen grey, mid-stage)  
- Gold → `colors.amberResin` (amber specimen — highest prestige in the naturalist world)
Or better still, use the rarity system: Bronze = common, Silver = uncommon, Gold = rare/glossy. Check the design spec for the recommended approach.

### B-QA2-009 — RarityBadge missing stamp depth

**File:** `src/components/ui/RarityBadge.tsx`

The stamp impression requires asymmetric border widths to create a physically pressed effect:
- `borderTopWidth: 1` (highlight, lighter border)
- `borderBottomWidth: 2` (shadow, same/darker border — creates sunk impression)

The current implementation has equal border widths on all sides, making it look flat.

**Fix:** Add asymmetric borderWidth to create the pressed/stamped depth. Top edge: 1px, Bottom edge: 2px. The top border color should be 1 step lighter than the rarity color (mix with white at 20%), the bottom border color should be 1 step darker (mix with black at 20%).

---

## AFTER FIXING

1. Run TypeScript check: `npx tsc --noEmit` — must be 0 errors
2. Start web server and verify bundle compiles
3. Commit: `fix: resolve HIGH + MEDIUM QA bugs from deep redesign v2`
4. Push to `feature/deep-redesign-v2`
5. Update `_rodjar/BACKLOG.md` with fix summary

---

## DO NOT

- Do NOT change the colour token definitions in `colors.ts`
- Do NOT modify `AnimonCard.tsx`, `TypeTagChip.tsx`, or `EmptyState.tsx` — they are fine
- Do NOT add new features or screens
- Do NOT change type system or typeSystem.ts
