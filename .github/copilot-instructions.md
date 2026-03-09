# Anílog — Copilot Workspace Instructions

## Notion
- **ONLY** use the `notion-Anilog` MCP server for all Notion operations in this workspace.
- **NEVER** use `notion-main` — that is the Cardinal Point workspace and must not be touched.
- If `notion-Anilog` tools are not available, stop and tell the user to reconnect the MCP server via Command Palette → "MCP: List Servers".

## GitHub
- Repo: `https://github.com/TokyDon/Anilog`
- `gh` CLI is authenticated as `TokyDon`
- All issues use labels: `P0`, `P1`, `P2`, `tech-debt`

## Stack
- Expo SDK 55, React Native, TypeScript, expo-router v3
- Design system: v3 Clean Modern (committed at `5daf043`)
- All screens are in `src/app/`, components in `src/components/`

## Notion — Confirmed State
- **Working config:** stdio type, `@notionhq/notion-mcp-server` via npx (NOT http — http hits wrong workspace)
- **Token:** stored in VS Code secret store via `.vscode/mcp.json` input — Anílog workspace only
- **Workspace:** `workspace_name: "Anílog"`, `workspace_id: "215daaca-aff7-817f-a1ce-0003a56f7b1f"`
- **Root page:** `🏡 Overview`, ID: `319daaca-aff7-8025-bd41-da8c4a4f959d`
- **Cardinal Point token (NEVER USE):** stored separately — do NOT use in this workspace
- **TODO:** User needs to create a workspace-specific `secret_` integration token at notion.com/my-integrations for reliability

## Current State (updated each session)
### Last completed (session ending March 9, 2026)
- ✅ All P0 issues (#1, #3–#7) and P1 issues (#12–#15) implemented on `feat/p1-features`
- ✅ UX restructure: Party tab (replaces Discover), tabs renamed Collection/Stamps, onboarding 5→7 steps
- ✅ White-page fix: partyStore manual AsyncStorage, `router.replace('/')`, font-loading screen
- ✅ Dev seed: Domestic Shorthair Cat "Biscuit" gifted to party on first load (`dev_seed_v1` flag)
- ✅ GitHub: #12–15 closed, #26 created+closed. Notion: Feature Registry Phase 2 → DONE, Screen Map updated
- ✅ Active branch: `feat/p1-features`, latest commit: `594b670` (pending push — tokens scrubbed)
- ✅ `.vscode/mcp.json` now uses VS Code `inputs` (no hardcoded token)
- ❌ `📱 Product Status` Notion page NOT YET CREATED

### Immediate next actions (pick up here)
1. Verify the cat "Biscuit" appears in the Party tab after clearing AsyncStorage (`dev_seed_v1`)
2. Start Phase 3 P0 dev — Issue #4 first (`AnimonScanResult` type), then #3 (Gemini service), then #1 (camera capture)
3. Create `📱 Product Status` Notion page under root `319daaca-aff7-8025-bd41-da8c4a4f959d`

### Key store rules
- **All Zustand stores use manual AsyncStorage pattern** — NO `zustand/middleware` (causes white page on web/React 19)
- AsyncStorage keys: `onboarding_complete`, `username`, `party_slots`, `achievements`, `dev_seed_v1`
- Collection store is NOT persisted — Supabase-backed, requires auth (Phase 3)
