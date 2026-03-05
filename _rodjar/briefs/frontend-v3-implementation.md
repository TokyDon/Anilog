# Frontend Implementation Brief — Anílog v3 Design System

## Status
Prototype approved. Implement v3 "Clean Modern" design system into the React Native (Expo SDK 55) app.

---

## Overview

The current app uses a "Field Naturalist" aesthetic (warm parchment, brass, amber). This is being replaced entirely with a **clean, modern digital interface** — neutral cool grey base, white surfaces, and all colour coming exclusively from game content (type chips and rarity badges).

The HTML prototype lives at: `_rodjar/prototype/prototype.html`

---

## Design Tokens to Implement

Replace `src/constants/colors.ts` entirely with:

```ts
export const colors = {
  // Backgrounds
  bg:          '#F1F4F9',
  surface:     '#FFFFFF',
  surface2:    '#F8FAFC',

  // Borders
  border:      '#E2E8F0',
  borderStrong:'#CBD5E1',

  // Text
  text1:       '#0F172A',
  text2:       '#475569',
  text3:       '#94A3B8',
  textInverse: '#FFFFFF',

  // Accent (intentionally neutral — no colour favouritism)
  accent:      '#64748B',
  accentSoft:  '#F1F5F9',
  accentDeep:  '#334155',

  // Device chrome
  bezel:       '#1E293B',
  navDark:     '#0F172A',

  // Rarity
  rarity: {
    common:   '#94A3B8',
    uncommon: '#22C55E',
    rare:     '#6366F1',
    // glossy = animated amber→pink→indigo gradient (see AnimonCard)
  },

  // Semantic
  success: '#22C55E',
  error:   '#EF4444',
  warning: '#EAB308',

  // Overlays
  overlayDark: 'rgba(15,23,42,0.60)',
} as const;
```

Replace `src/constants/typography.ts` entirely with:

```ts
export const typography = {
  fontFamily: {
    // UI font
    body:       'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium',
    bodySemiBold:'PlusJakartaSans_600SemiBold',
    bodyBold:   'PlusJakartaSans_700Bold',
    bodyExtra:  'PlusJakartaSans_800ExtraBold',
    // Data / labels / accession numbers
    mono:       'SpaceMono_400Regular',
    monoBold:   'SpaceMono_700Bold',
  },
  fontSize: {
    xs:    9,
    sm:    10,
    base:  13,
    md:    14,
    lg:    16,
    xl:    20,
    '2xl': 26,
    '3xl': 28,
    '4xl': 36,
  },
  lineHeight: {
    tight:  1.1,
    normal: 1.5,
    label:  1.3,
  },
  letterSpacing: {
    squeezed: -0.5,
    normal:    0,
    label:     0.5,
    wide:      1.2,
    widest:    2.0,
  },
} as const;
```

### Font Installation

Install via expo-google-fonts:
```
npx expo install @expo-google-fonts/plus-jakarta-sans
```
Space Mono is already installed (keep it).

Load in `src/app/_layout.tsx` (or wherever fonts are loaded):
```ts
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
```

---

## Type System Changes

Update `src/constants/typeSystem.ts` — replace the real-world taxonomy types (mammal, bird, etc.) with the fantasy elemental types from the prototype. These are the types that provide all colour in the UI:

```ts
export const ANIMON_TYPES = [
  'fire', 'water', 'grass', 'electric', 
  'ice', 'dragon', 'psychic', 'bug', 
  'steel', 'ground', 'rock', 'light',
] as const;

export const TYPE_DEFINITIONS = {
  fire:     { label: 'Fire',     color: '#EF4444', textColor: '#FFFFFF' },
  water:    { label: 'Water',    color: '#3B82F6', textColor: '#FFFFFF' },
  grass:    { label: 'Grass',    color: '#22C55E', textColor: '#FFFFFF' },
  electric: { label: 'Electric', color: '#EAB308', textColor: '#0F172A' },
  ice:      { label: 'Ice',      color: '#06B6D4', textColor: '#FFFFFF' },
  dragon:   { label: 'Dragon',   color: '#8B5CF6', textColor: '#FFFFFF' },
  psychic:  { label: 'Psychic',  color: '#EC4899', textColor: '#FFFFFF' },
  bug:      { label: 'Bug',      color: '#84CC16', textColor: '#0F172A' },
  steel:    { label: 'Steel',    color: '#64748B', textColor: '#FFFFFF' },
  ground:   { label: 'Ground',   color: '#D97706', textColor: '#FFFFFF' },
  rock:     { label: 'Rock',     color: '#78716C', textColor: '#FFFFFF' },
  light:    { label: 'Light',    color: '#F59E0B', textColor: '#0F172A' },
};
```

---

## Component Changes

### 1. `TypeTagChip` — full rewrite
The current "inset/recessed bevel" naturalist style is replaced with **solid vivid filled pills**:
- Solid background = type colour
- White text (dark for electric/bug/light)
- Fully rounded (borderRadius: 99)
- No border
- Two sizes: sm (px:8, py:2, fontSize:9) and md (px:10, py:3, fontSize:10)

### 2. `RarityBadge` — full rewrite
Replace the naturalist badge with dot + label style:
- A 5px dot + uppercase label, both in rarity colour
- Background is a soft tint of the rarity colour (10% opacity)
- Fully rounded pill shape
- Font: Space Mono, 8px, bold, uppercase
- Glossy: animated gradient text (amber → pink → indigo) + pulsing dot

### 3. `AnimonCard` — full rewrite
The "Specimen Label Strip" is replaced with a **Dark Footer Strip** — this is the v3 signature:

**Full card (default):**
- Total height: 220px
- Image area: flex:1, type-derived gradient background (see gradient map below), centred placeholder emoji at 22% opacity brightened
- Rarity pill: absolute position, top-right of image area
- Dark footer strip: `background: navDark (#0F172A)`, padding 8px 12px 10px
  - Left: animon name (14px bold white), species (9px Space Mono italic, 40% white), type chips row
  - Right: accession (8px Space Mono, 28% white), region (9px, 45% white)

**Compact card:**
- Total height: 150px
- Same structure but footer is more compact (10px bold name + chips row)

**Gradient map** (derive from primary type):
```
fire / psychic → linear(140deg, #7F1D1D, #831843, #1E1B4B)
rock / water   → linear(140deg, #1C1917, #1C3B5C)
bug / light    → linear(140deg, #1A2E05, #713F12)
ground / steel → linear(140deg, #431407, #1E293B)
ice / dragon   → linear(140deg, #0C4A6E, #3B0764)
grass / water  → linear(140deg, #052E16, #0C4A6E)
water (solo)   → linear(140deg, #1E3A8A, #0C4A6E)
ground (solo)  → linear(140deg, #431407, #78350F)
default        → linear(140deg, #1E293B, #0F172A)
```

**NEW prop: `showPhoto?: boolean`** — if true, render user's `animon.photoUrl`; if false (default), show AI card art / gradient. This is for the detail screen toggle. Cards in collection and logbook always show AI art (showPhoto defaults false).

### 4. NEW: `SocialPost` component

`src/components/ui/SocialPost.tsx`

Props:
```ts
interface SocialPostProps {
  user: { name: string; handle: string; avatarGradient: string[] };
  timeAgo: string;
  location: string;
  text: React.ReactNode;  // can include bold spans
  embeddedCard?: Animon;
  likeCount: number;
  commentCount: number;
  canTrade?: boolean;     // show Trade CTA if true
  onTrade?: () => void;
}
```

Layout:
- White surface, bottom border
- Header: 36px circle avatar (gradient), name (13px bold), handle/time/location (9px Space Mono, text3)
- Body text: 13px text2, line height 1.55
- Embedded card: AnimonCard compact variant
- Actions row: ♥ count, 💬 count, and if canTrade: "⇄ Offer Trade" pill (accentSoft bg, accent text, fully rounded)

### 5. NEW: `LogbookEntry` component

`src/components/ui/LogbookEntry.tsx`

Props:
```ts
interface LogbookEntryProps {
  animon?: Animon;
  captured: boolean;
  captureCount?: number;  // stamp count
}
```

Layout (96px tall, 3-column grid):
- Gradient image area (type-derived if captured, default dark if not)
- If uncaptured: apply 65% greyscale + 35% opacity
- If captured: stamp badge (top-right, 22px circle, accent bg, count)
- Dark label strip: animon name OR "???" if uncaptured (8px bold white, truncated)

### 6. `TabBar` — full rewrite

Remove all naturalist aesthetic (brass rule, rivets, amber LED, dark bezel). New design:

- Background: white (`surface`), 1px top border (`border`)
- Height: 72px + safe area bottom inset
- 5 items: Discover | Anílog | [FAB] | Logbook | Profile
- Inactive: icon + label in `text3`, no dot
- Active: icon + label in `accent` (#64748B) + 4px dot below icon in `accent`
- **Centre FAB** (camera):
  - 54px circle, lifted 18px above tab bar (negative marginTop)
  - Gradient: linear accent→accentDeep
  - White border: 2.5px
  - Box shadow: accent colour, elevation 8
  - Contains: SVG camera icon (white, 22×22) — NOT emoji, NOT text
  - Pressing navigates to `/camera`

Icons (use the same unicode chars as prototype):
```
Discover:  ⊞  (U+229E)
Anílog:    ◈  (U+25C8)
Logbook:   ◎  (U+25CE)
Profile:   ◐  (U+25D0)
```

**Tab route renaming**: `milestones` → `logbook`
- Rename `src/app/(tabs)/milestones.tsx` → `src/app/(tabs)/logbook.tsx`
- Update `_layout.tsx` tab registration accordingly

---

## Screen Changes

### `src/app/(tabs)/index.tsx` — Discover (Social Feed)

Replace current content with social feed layout:
- Screen header: "Discover" (26px bold), subtitle "Social Feed · Nearby Sightings" (Space Mono, 9px, text3)
- Search bar below header (white bg, border, 44px height, search icon + placeholder)
- ScrollView:
  - SocialPost components (fetch from mock data or store)
  - "Nearby Sightings" section label
  - Horizontal ScrollView of compact AnimonCards (116px wide)

### `src/app/(tabs)/anilog.tsx` — My Collection

- Screen header: "My Anílog" title, "{count} Specimens · {speciesCount} Species" subtitle
- Filter pills row (horizontal scroll, no scrollbar):
  - Active: accent bg, white text
  - Inactive: white bg with border, text3
  - Pills: "All {n}", "✦ Glossy {n}", "Rare {n}", "Uncommon {n}"
- Vertical list of full AnimonCards

### `src/app/(tabs)/logbook.tsx` — NEW (replaces milestones)

- Screen header: "Logbook" title, "{captured}/{total} Discovered" subtitle
- Filter pills: "All", "Canine", "Reptile", "Avian", "Insect" (taxonomy filter)
- 3-column grid of LogbookEntry components
- Undiscovered entries show greyscale + "???" name

### `src/app/(tabs)/profile.tsx` — Profile

- Hero section: dark gradient (navDark), centred avatar (72px circle, accent gradient, initials), name (20px bold white), handle (Space Mono, 11px, accent)
- Stats strip: 3 cells — Collected / Species / Logbook % — with big number + uppercase label
- Settings rows: icon + label + chevron, white bg, border between rows

### `src/app/animon/[id].tsx` (or equivalent detail screen)

- Hero: 210px type-gradient area, placeholder emoji, back button (pill overlay)
- Body (white surface):
  - Name block: 28px bold name, 12px Space Mono italic species, type chips
  - **Art/Photo Toggle**: segmented pill with "✦ AI Art" | "📷 My Photo" — controls `showPhoto` prop on a full AnimonCard rendered within
  - 2×2 stat grid: captures/sightings/distance/region
  - Detail rows: Habitat, First Seen, etc.
  - Trade CTA: accentSoft bg, accent border, "⇄ Offer for Trade" label

---

## App Shell (`src/app/_layout.tsx`)

- Set `<StatusBar style="dark" />` for light screens
- Update `backgroundColor` in expo config / splash to `#F1F4F9`

---

## Mock Data

Update any mock animon data to use the new type system keys (fire/water/grass/etc. instead of mammal/bird/etc.). Keep existing species names and accession IDs.

---

## Implementation Order

1. `src/constants/colors.ts` — token update
2. `src/constants/typography.ts` — token update + install Plus Jakarta Sans
3. `src/constants/typeSystem.ts` — update types
4. `TypeTagChip` — rewrite
5. `RarityBadge` — rewrite
6. `AnimonCard` — rewrite (both variants + showPhoto prop)
7. `TabBar` — rewrite (new design + Logbook route)
8. Rename milestones → logbook screen
9. NEW `SocialPost` component
10. NEW `LogbookEntry` component
11. Update all 4 tab screens
12. Update detail screen
13. Fix any TypeScript errors
14. Run dev build and do a visual pass

---

## Key Constraints

- Do NOT break existing data types in `src/types/`
- Do NOT change the routing structure beyond milestones→logbook rename
- Do NOT add new dependencies beyond `@expo-google-fonts/plus-jakarta-sans`
- All components must be exported from their barrel `index.ts`
- TypeScript strict mode — no `any` types
- The prototype HTML is the source of truth for all visual decisions

## Reference

Prototype: `_rodjar/prototype/prototype.html` — open in browser for visual reference at any time.
