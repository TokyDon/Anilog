# Anílog Design Prototype

## How to Open

Open `prototype.html` in any browser. No server needed — just double-click the file.

Recommended: Chrome or Edge for best font rendering.

## What's Inside

**6 Phone Frame Screens:**
1. Discover — feed of AnimonCards with search, section headers
2. Anílog Collection — personal specimen grid with rarity filter tabs
3. Milestones — 5-tier curator progression with real progress bars
4. Profile — user hero, stats row, settings list
5. Camera — viewfinder with scanning reticle, shutter, flash/location buttons
6. Animon Detail — full specimen record with stats, habitat, log entry

**Component Library** (below frames):
- AnimonCard Full (210px, Specimen Label Strip)
- AnimonCard Compact (140px, accession overlay)
- RarityBadge × 4 variants (with shimmer on Glossy)
- TypeTagChip × 10 types
- SectionHeader
- StatCard
- SearchBar
- ProfileAvatar × 3 sizes
- MilestoneTier × 3 states
- EmptyState

Each component has an HTML comment block listing its `Props`, `Tokens`, and `Notes` — this is the brief for the Frontend Developer when converting to React Native components.

## Decisions That Are Locked

These design decisions are confirmed and baked into the running app code:

1. **Design token names** — `specimenCream`, `inkBrown`, `amberResin`, etc. are the authoritative system
2. **Specimen Label Strip** as the signature element on all AnimonCard Full instances
3. **Playfair Display / DM Sans / Space Mono** type trio
4. **Forest floor + amber + parchment** as the naturalist domain colour world
5. **Rarity system** — common=lichenGray, uncommon=forestMid, rare=cobalt, glossy=amberResin+shimmer

## Open Questions (answer before next implementation sprint)

See the "Open Design Questions" section at the bottom of prototype.html:

- **Q1** — Image treatment (illustration / photo / silhouette?)
- **Q2** — Tab icons (Unicode / SVG / icon library?)
- **Q3** — Camera purpose (AI scan / manual / both?)
- **Q4** — Microinteraction priority (which 4 interactions first?)
- **Q5** — Discover screen scope (map / community feed / nearby?)

## How the Design Review Cycle Works

1. Owner opens prototype.html in browser
2. Owner reviews each screen and notes feedback
3. Owner answers open questions above
4. **Only then** does the Frontend Developer make changes to the app code
5. QA Tester verifies the app matches the approved prototype
6. If it doesn't match → back to Frontend Developer
