# AGENTS.md — Agent Factory Platform

## Project Overview
企业级 AI Agent 生产管理平台 — 统一门户管理 Agent 从"出生"到"就业"的完整生命周期。

## Quick Map
- **Specs & PRD**: `.kiro/specs/agent-factory/` — requirements, design, domain analysis, tasks
- **Source Code**: `src/`
- **Architecture**: See `.kiro/specs/agent-factory/design.md` §1

## Tech Stack
- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 + shadcn/ui (oklch, purple primary, dark/light)
- Zustand (state) + Dexie.js (IndexedDB)
- React Flow (@xyflow/react, knowledge graphs)
- Recharts (charts) + Lucide React (icons)
- React Router v7

## Five Modules
1. **Dashboard** — Global overview, 5-layer architecture diagram, activity stream
2. **Ontology KB** — 6 knowledge domains (WMS/TMS/FMS/HRM/YMS/OMS), React Flow graph
3. **IDE** — Agent creation wizard, skills config, prompt editor, build/test
4. **MarketPlace** — 21 Agent catalog, search/filter, hiring workflow
5. **Runtime** — Deployed agents monitoring, Job Agency, Message Board, security

## Architecture Rules
1. **Feature-first structure**: `src/features/{module}/components/`
2. **Layered architecture**: types → services → stores → UI
3. **Provider pattern**: All data through Dexie.js services, ready for real API swap
4. **Mock-first**: V1 uses rich mock data based on real logistics scenarios
5. **Component limit**: < 300 lines per file, extract sub-components

## Key Files
- `src/components/layout/` — MainLayout, Sidebar, Header
- `src/shared/types/` — All TypeScript interfaces
- `src/shared/services/database.ts` — Dexie DB setup (4 partitions)
- `src/data/` — Mock data generators
- `src/stores/` — Zustand stores
- `src/styles/globals.css` — ITEM theme (oklch)

## Coding Conventions
- TypeScript strict mode, no `any`
- Chinese UI labels, English code comments
- Path aliases: @components, @features, @shared, @stores, @data
- Lucide icons throughout
- Default dark theme
