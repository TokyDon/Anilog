# Task Brief: QA — Deep Redesign V2 Verification
**Assigned to:** QA Tester  
**Priority:** HIGH  
**Date:** 2026-03-05  
**Branch:** `feature/deep-redesign-v2`

---

## CONTEXT

This redesign was triggered by the product owner calling the previous version "not professional", "generic", and having "weird UI quirks". A new design was produced with:
- Domain exploration: 8 naturalist concepts, specimen-label signature element, domain-named colour tokens (`specimenCream`, `inkBlack`, `amberResin`, `forestFloor`, `instrumentBrass`)
- Design score: 9.0/10 against refactoring-ui principles before implementation
- UX/UI Designer confirmed 3 skills were invoked: `interface-design`, `refactoring-ui`, `microinteractions`

## YOUR TASKS

### 1. TypeScript Check
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
git checkout feature/deep-redesign-v2
npx tsc --noEmit 2>&1
```
Must be 0 errors. If there are any errors, raise them as bugs.

### 2. Web Bundle Check
Start the dev server and verify web bundle compiles without errors:
```powershell
cd "C:\Users\james\Documents\VS Code\Anílog"
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
```
Then start expo web (background) and check for "Web Bundled X modules" (should be 1200+).

### 3. Design Quality Audit

Read the following files to understand the design intent:
- `_rodjar/design-spec-v2.md` — the spec written by UX/UI Designer
- `src/constants/colors.ts` — the new colour tokens
- `src/constants/typography.ts` — typography

Then audit the implementation against the spec. Check each component:

**AnimonCard** (`src/components/ui/AnimonCard.tsx`):
- [ ] Does the "Typed Specimen Label Strip" signature appear? (Space Mono italic species name, accession number, region in a cream strip at card base)
- [ ] Does the compact variant have a fixed height (should be ~140px)?
- [ ] Are there NO inline hex strings — all colours via tokens?
- [ ] Does the full variant have proper image zone with specimen tint?

**TabBar** (`src/components/layout/TabBar.tsx`):
- [ ] Does it feel like physical device hardware (not just colored boxes)?
- [ ] Is the camera button visually prominent (raised disc or similar)?
- [ ] Are inactive tabs meaningfully de-emphasised vs active?

**RarityBadge** (`src/components/ui/RarityBadge.tsx`):
- [ ] Does it feel stamped/embossed (not just a flat coloured pill)?

**TypeTagChip** (`src/components/ui/TypeTagChip.tsx`):
- [ ] Does it feel inset/recessed?

**Screens** (read each file):
- `src/app/(tabs)/index.tsx` — does it use `specimenCream`, `inkBlack`, `forestFloor` etc.? Proper hierarchy?
- `src/app/(tabs)/anilog.tsx` — filter chips inset? Grid consistent?
- `src/app/(tabs)/milestones.tsx` — milestone rows look like they belong to the design language?
- `src/app/(tabs)/profile.tsx` — profile data rendered with proper hierarchy?
- `src/app/camera.tsx` — scanner aesthetic matches device language?
- `src/app/animon/[id].tsx` — specimen label visible? Data uses Space Mono / `inkAmber`?

### 4. UI Quirk Audit

Look specifically for:
- Mixed token and inline hex colour references (should be 0)
- Inconsistent spacing (should follow 4pt grid: 4/8/12/16/24/32/48/64)
- Any `emoji` being used as a primary UI element (emojis acceptable for content, not UI icons)
- Duplicate component code (the earlier index.tsx had duplicate code - verify fixed)
- Missing imports / unused imports

### 5. Refactoring-UI Score

Score the implementation against the 7 refactoring-ui principles (0-10 each):
1. Visual Hierarchy
2. Spacing & Sizing
3. Typography
4. Color
5. Shadows & Depth
6. Borders
7. Components & Patterns

Total score / 70.

---

## DELIVERABLE

Write your findings to `_rodjar/QA-report-deep-redesign-v2.md`:

```markdown
# QA Report — Deep Redesign V2
Date: [date]
Branch: feature/deep-redesign-v2

## Overall Verdict
PASS / CONDITIONAL PASS / FAIL

## TypeScript
CLEAN (0 errors) or [list errors]

## Web Bundle
[X modules bundled] or FAILED

## Design Quality Score (Refactoring-UI)
[breakdown] / 70 = [X/10]

## Signature Element Check
- Specimen label strip in AnimonCard: PRESENT / MISSING
- Physical device TabBar: PRESENT / MISSING / PARTIAL

## Issues Found
### [B-XXX] Title  
Severity: High/Medium/Low  
File: [path]  
Description: [what's wrong]  
Expected: [what it should be]

## Final Assessment
[summary]
```

Also update `_rodjar/BACKLOG.md` with QA result.
