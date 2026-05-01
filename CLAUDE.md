# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR (http://localhost:5173)
npm run build     # TypeScript check + Vite production build
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

No test framework is configured.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **React Router DOM v7** for client-side routing
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — imported in `src/index.css`, no `tailwind.config.js`
- **Lucide React** for icons
- **localStorage** for all data persistence (key: `launchos_data`)
- **Vercel** for deployment — `vercel.json` rewrites all non-API paths to `/index.html` for SPA routing

## Architecture

### Entry & Routing
`index.html` → `src/main.tsx` → `src/App.tsx`

Routes:
- `/` → `Dashboard.tsx`
- `/projeto/:id` → `ProjectDetail.tsx`
- `/tarefas-do-dia` → `TodayTasks.tsx`
- `/configuracoes` → `Settings.tsx`
- `*` → redirect to `/`

### Global State (`src/contexts/AppContext.tsx`)
Single context with:
- `projects` — full project list with CRUD (`addProject`, `updateProject`, `deleteProject`)
- `theme` / `toggleTheme` — `'light' | 'dark'`, persisted in localStorage, applied via `document.documentElement.setAttribute('data-theme', 'dark')` or removing the attribute
- `toasts` / `showToast` / `removeToast` — notification stack, auto-dismiss at 3.5s
- `isSearchOpen` / `setIsSearchOpen` — global ⌘K search modal state
- `exportData` / `importData` — JSON backup/restore
- Auto-save with 500ms debounce on every project change

### Data Layer (`src/utils/storage.ts`)
Direct `localStorage` reads/writes with key `launchos_data`. Shape matches `AppData` from `src/types/index.ts`.

Initialization: `AppContext` reads from localStorage on mount. Falls back to `defaultProject` (PetLife AI demo) if empty.

### Types (`src/types/index.ts`)
Core entities:
- `Project` — top-level entity with metadata, phases, metrics
- `Phase` — ordered group of tasks within a project
- `Task` — has status, priority, difficulty, steps, notes
- `Step` — sub-item inside a task (checklist step)
- `AppData` — full persistence shape: `{ projects, settings: { theme, defaultCurrency }, lastUpdated }`

Enums:
- `ProductType`: `'saas' | 'software' | 'marketplace' | 'info-produto' | 'curso' | 'mentoria' | 'outro'`
- `ProjectStatus`: `'ideia' | 'desenvolvimento' | 'pre-lancamento' | 'ativo' | 'pausado' | 'arquivado'`
- `TaskStatus`: `'pendente' | 'em-progresso' | 'concluido' | 'bloqueado'`
- `Priority`: `'critica' | 'alta' | 'media' | 'baixa'`

### Helpers (`src/utils/helpers.ts`)
- `generateId()`, `now()`, `formatDate()`, `formatCurrency()`
- Progress calculators: `getProjectProgress`, `getPhaseProgress`, `getPhaseStatus`
- Task aggregators: `getProjectTaskCounts`, `getNextTask`, `getPriorityTasks`, `getAllInProgressTasks`
- Launch helpers: `getDaysUntilLaunch`, `getNextLaunchProject`, `getThisWeekCompleted`
- Label maps: `STATUS_LABELS`, `STATUS_COLORS`, `TYPE_LABELS`, `PRIORITY_LABELS`, `PRIORITY_COLORS`, `DIFFICULTY_LABELS`
- Constants: `CURRENCIES`, `PLATFORMS`

### Templates (`src/data/templates.ts`)
Four pre-built phase/task templates selectable in the new project wizard:

| Template | Phases | Tasks | Description |
|---|---|---|---|
| `infoProductTemplate` | 6 | 17 | Info produto low ticket: produto → checkout → e-mail → legal → tráfego → lançamento |
| `softwareTemplate` | 6 | 21 | Software/SaaS completo: MVP → monetização → landing → legal/LGPD → tráfego → lançamento |
| `saasTemplate` | 3 | 4 | SaaS simplificado para validação rápida |
| `courseTemplate` | 2 | 3 | Curso online: conteúdo + plataforma |
| `blankTemplate` | 0 | 0 | Em branco |

`TEMPLATE_OPTIONS` is the array consumed by `NewProjectModal` step 3.

When adding a new `ProductType` value, update in three places: `src/types/index.ts` (union), `src/utils/helpers.ts` (`TYPE_LABELS`), and `src/components/modals/NewProjectModal.tsx` (`PRODUCT_TYPES` array).

### Pages

| Page | File | Purpose |
|---|---|---|
| `/` | `Dashboard.tsx` | 4 metric cards, project list sorted by progress, priority tasks |
| `/projeto/:id` | `ProjectDetail.tsx` | Tabs: Checklist / Visão Geral (Kanban) / Notas / Métricas |
| `/tarefas-do-dia` | `TodayTasks.tsx` | In-progress + critical tasks grouped by project |
| `/configuracoes` | `Settings.tsx` | Export/import JSON, data summary |

### Key Components

**Layout**
- `Sidebar.tsx` — fixed 220px left sidebar with nav, project list, search button, theme toggle (Sun/Moon)
- `Toast.tsx` — fixed bottom-right notification stack

**Dashboard**
- `MetricCard.tsx` — stat card with optional accent/warning color
- `ProjectCard.tsx` — project row with SVG progress ring, status border, urgency badge

**Project Detail tabs**
- `ChecklistTab.tsx` — overall progress bar + list of PhaseSections
- `PhaseSection.tsx` — collapsible phase header with mini progress bar + TaskItems
- `TaskItem.tsx` — expandable task row: checkbox, badges, StepList, status buttons, notes textarea
- `KanbanTab.tsx` — 4-column kanban with native mouse DnD (no library)
- `NotesTab.tsx` — free-text textarea with 1s debounce auto-save
- `MetricsTab.tsx` — URLs, pricing, revenue/conversions/visitors, computed conversion rate

**Modals**
- `NewProjectModal.tsx` — 3-step wizard: (1) name/type/status/tags, (2) pricing/platform/URL/date, (3) template selection
- `SearchModal.tsx` — ⌘K modal, real-time search across projects and tasks, keyboard nav (↑↓ Enter Esc)

## Theming

CSS custom properties define both themes in `src/index.css`:
- `:root` = light (default, warm off-white `#f5f4f0`)
- `[data-theme="dark"]` = dark (black `#0a0a0a`)

Variable naming convention: `--c-bg`, `--c-surface`, `--c-surface-dim`, `--c-surface-2`, `--c-border`, `--c-border-2`, `--c-text`, `--c-text-2`, `--c-muted`, `--c-muted-2`, `--c-muted-3`, `--c-accent`, `--c-accent-10`, `--c-amber`, `--c-danger`, `--c-overlay`.

All components use `style={{ color: 'var(--c-text)' }}` inline styles — Tailwind is used only for layout/spacing classes. Brand/semantic colors (status colors, priority colors) remain as hex constants in `helpers.ts` because they are theme-agnostic.

Theme is toggled via `toggleTheme()` from `useApp()` and persisted in `AppData.settings.theme`.

## TypeScript Config

Strict mode on. `noUnusedLocals` and `noUnusedParameters` enforced — unused imports/params cause build failures. Use `_prefix` for intentionally unused parameters.

## Design Tokens

Google Fonts: **Instrument Serif** (display/headings), **DM Mono** (labels/code/numbers), **DM Sans** (body).

Accent colors per theme — light: `#009c68` (green), dark: `#00d084`. Amber — light: `#b86e00`, dark: `#f59e0b`. Danger — light: `#c42b2b`, dark: `#ef4444`.

## Language

All UI text, form labels, enum labels, and data fields are in **Portuguese (pt-BR)**. Dates/numbers use `pt-BR` locale via `formatDate` / `formatCurrency` in `helpers.ts`.
