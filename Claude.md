# CLAUDE.md — Gym Tracker Frontend

## Project overview
Mobile-first React web app for tracking gym workouts. Dark theme, orange accent. Used on a phone browser during workouts. Backend is a .NET 9 REST API deployed on Render with Supabase PostgreSQL.

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui for base components
- React Query (@tanstack/react-query) for all server state
- React Router for navigation
- Recharts for progress graphs
- Axios for HTTP
- lucide-react for icons
- date-fns for date formatting

## Design system
| Token | Value |
|---|---|
| Background | #0A0A0A |
| Surface (cards) | #141414 |
| Surface elevated | #1C1C1C |
| Border | #2A2A2A |
| Primary | #FF6B35 |
| Primary dim | #FF6B3520 |
| Text primary | #FFFFFF |
| Text secondary | #888888 |
| Success | #00FF87 |
| Danger | #FF4444 |

- Border radius: 12px cards, 8px inputs, 999px pills
- Font: system font stack
- No white backgrounds anywhere

## Mobile first rules
- All layouts for 390px width first
- Touch targets minimum 44px
- Bottom navigation for main routes
- No hover-only interactions
- Number inputs use `inputMode="decimal"` or `inputMode="numeric"`
- Font size minimum 16px on inputs to prevent iOS zoom

## Auth
- Token stored in localStorage as `gym_token`
- Username stored in localStorage as `gym_username`
- Token expires after 24 hours — on 401 clear both and redirect to `/login`
- No refresh token endpoint exists — user must log in again
- Axios interceptor attaches Bearer token to every request

## Error handling
Two error shapes from the API:
- Most errors: `{ "message": "string" }` — status 400, 401, 404, 500
- Validation errors: `{ "errors": { "fieldName": ["msg"] }, "status": 422 }` — status 422
Handle both shapes in a global Axios response interceptor and show toast notifications.

## API base URL
From `import.meta.env.VITE_API_URL`

## Pages and routes
| Route | Page |
|---|---|
| `/login` | Login |
| `/register` | Register |
| `/` | Dashboard |
| `/schedule` | Weekly schedule |
| `/sessions/new` | Create session |
| `/sessions/:id` | Log workout (most important) |
| `/exercises` | Exercise library |
| `/exercises/:id/progress` | Progress graph |
| `/templates` | Templates list |
| `/templates/new` | Create template |
| `/templates/:id` | Template detail + edit |
| `/calendar` | Calendar — schedule sessions |
| `/profile` | Profile + logout |

## Key API facts
- `scheduledDate` on sessions is optional (nullable)
- `personalBest` on exercises is `null` if no sets logged, `0` on progress endpoint if no sets
- `muscleGroup` on `SessionExerciseDto` is nullable
- Sets use `sessionExerciseId` in the URL — NOT `exerciseId`
- Template exercises have `templateExerciseId` — NOT `exerciseId` for delete/reorder
- Reorder endpoint exists: `PUT /api/templates/:id/exercises/reorder` with `{ items: [{ templateExerciseId, orderIndex }] }`
- 422 validation shape is different from other errors

## Animations
- Page transitions: `animate-fadeIn` on route change
- Cards mount: `animate-scaleIn`
- Bottom sheets: `animate-slideUp`
- Set logged: `animate-flash` green on the set row
- New PB: `animate-pbPulse` on PB badge
- Button press: `active:scale-95 transition-transform`
- Skeleton loaders: `animate-shimmer` while loading
- All animations under 300ms

## Build order
1. Auth (login, register)
2. Bottom navigation
3. Dashboard
4. Exercise library
5. **Log workout session** ← most important, get this perfect
6. New session
7. Weekly schedule
8. Templates
9. Progress graphs
10. Calendar
11. Profile
````

---

### Updated Claude Code prompt
````
Build a mobile-first React gym tracking web app. Follow CLAUDE.md exactly for design system, patterns, and build order.

## Auth setup
- Axios instance in `src/api/client.ts` reading `VITE_API_URL`
- Request interceptor: attach `Authorization: Bearer <token>` from localStorage `gym_token`
- Response interceptor: on 401 clear `gym_token` and `gym_username` from localStorage and redirect to `/login`
- Handle two error shapes:
  - `{ message: string }` for 400/401/404/500
  - `{ errors: { [field]: string[] }, status: 422 }` for validation errors
  Show toast for both

## API files in `src/api/`

**`auth.ts`**
- `register(username, email, password)` → `POST /api/auth/register`
- `login(email, password)` → `POST /api/auth/login`
- Both return `{ token: string, username: string }`
- On success store token in `localStorage.gym_token` and username in `localStorage.gym_username`

**`exercises.ts`**
- `getAll()` → `GET /api/exercises` → `ExerciseDto[]`
- `getById(id)` → `GET /api/exercises/:id` → `ExerciseDto`
- `create(data)` → `POST /api/exercises`
- `update(id, data)` → `PUT /api/exercises/:id`
- `delete(id)` → `DELETE /api/exercises/:id`
- `getProgress(id)` → `GET /api/exercises/:id/progress` → `ExerciseProgressDto`

**`sessions.ts`**
- `getAll(from?, to?)` → `GET /api/sessions`
- `getById(id)` → `GET /api/sessions/:id` → `SessionDetailDto`
- `create(data)` → `POST /api/sessions` — `scheduledDate` is optional
- `complete(id)` → `PATCH /api/sessions/:id/complete`
- `delete(id)` → `DELETE /api/sessions/:id`
- `addExercise(sessionId, exerciseId, orderIndex)` → `POST /api/sessions/:id/exercises`
- `removeExercise(sessionId, sessionExerciseId)` → `DELETE /api/sessions/:id/exercises/:sessionExerciseId`

**`sets.ts`**
- `logSet(sessionId, sessionExerciseId, data)` → `POST /api/sessions/:sessionId/exercises/:sessionExerciseId/sets`
- `updateSet(sessionId, sessionExerciseId, setId, data)` → `PUT /api/sessions/:sessionId/exercises/:sessionExerciseId/sets/:setId`
- `deleteSet(sessionId, sessionExerciseId, setId)` → `DELETE /api/sessions/:sessionId/exercises/:sessionExerciseId/sets/:setId`

**`templates.ts`**
- `getAll()` → `GET /api/templates`
- `getById(id)` → `GET /api/templates/:id` → `TemplateDetailDto`
- `create(data)` → `POST /api/templates` — fields: `name`, `description?`, `dayOfWeek?`
- `update(id, data)` → `PUT /api/templates/:id`
- `delete(id)` → `DELETE /api/templates/:id`
- `addExercise(templateId, data)` → `POST /api/templates/:id/exercises` — fields: `exerciseId`, `defaultSets`, `defaultReps`, `orderIndex`
- `removeExercise(templateId, templateExerciseId)` → `DELETE /api/templates/:id/exercises/:templateExerciseId`
- `reorder(templateId, items)` → `PUT /api/templates/:id/exercises/reorder` — `{ items: [{ templateExerciseId, orderIndex }] }`

**`dashboard.ts`**
- `getWeek()` → `GET /api/dashboard/week` → `WeeklyDashboardDto`
- `getRecent(count?)` → `GET /api/dashboard/recent?count=5`

## TypeScript types in `src/types/index.ts`
````typescript
export interface ExerciseDto {
  id: number
  name: string
  muscleGroup: string
  notes: string
  personalBest: number | null
}

export interface ExerciseProgressDto {
  exerciseId: number
  exerciseName: string
  personalBest: number  // 0 if no sets, not null
  history: ProgressPointDto[]
}

export interface ProgressPointDto {
  date: string
  bestWeight: number
  totalReps: number
  totalSets: number
}

export interface TemplateDto {
  id: number
  name: string
  description: string
  dayOfWeek: string
}

export interface TemplateDetailDto extends TemplateDto {
  exercises: TemplateExerciseDto[]
}

export interface TemplateExerciseDto {
  templateExerciseId: number
  exerciseId: number
  exerciseName: string
  muscleGroup: string
  orderIndex: number
  defaultSets: number
  defaultReps: number
}

export interface SessionDto {
  id: number
  scheduledDate: string | null
  isCompleted: boolean
  completedAt: string | null
  notes: string
  templateId: number | null
  templateName: string | null
}

export interface SessionDetailDto extends SessionDto {
  exercises: SessionExerciseDto[]
}

export interface SessionExerciseDto {
  sessionExerciseId: number
  exerciseId: number
  exerciseName: string
  muscleGroup: string | null
  orderIndex: number
  sets: SetDto[]
}

export interface SetDto {
  id: number
  setNumber: number
  weightKg: number
  reps: number
  isPersonalBest: boolean
  loggedAt: string
}

export interface WeeklyDashboardDto {
  weekStart: string
  weekEnd: string
  totalScheduled: number
  totalCompleted: number
  sessions: SessionDto[]
}
````

## React Query hooks in `src/hooks/`

Create one hook file per resource. Example pattern:
````typescript
// useExercises.ts
export const useExercises = () => useQuery({
  queryKey: ['exercises'],
  queryFn: exercisesApi.getAll,
  staleTime: 1000 * 60 * 5
})

export const useCreateExercise = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: exercisesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercises'] })
  })
}
````

## Log workout page — build this first and get it perfect

Route: `/sessions/:id`

This is the most used screen. A user has their phone in their hand between sets and needs to log quickly.

Layout:
- Header: back button, session date, template name, complete button (orange, top right)
- Scrollable list of exercises
- Each exercise card (#141414) shows:
  - Exercise name (bold, white)
  - Muscle group (small, #888888)
  - Sets listed below: "Set 1 — 80kg × 8" with green PB badge if isPersonalBest
  - "+ Add set" button at bottom of each exercise card
- Tapping "+ Add set" expands an inline form:
  - Weight input (large, `inputMode="decimal"`, placeholder "kg")
  - Reps input (large, `inputMode="numeric"`, placeholder "reps")  
  - Set number auto-increments from last set
  - "Log Set" button (full width, orange)
  - After logging: animate-flash green on the new set row, clear form, keep expanded for next set
  - If new set is a PB: animate-pbPulse on the PB badge
- Complete workout button at bottom: full width orange, asks for confirmation, calls PATCH complete, redirects to dashboard

## Design rules
- All backgrounds #0A0A0A
- Cards #141414 with 1px #2A2A2A border
- Primary buttons: bg-primary (#FF6B35), text white, rounded-xl, h-12 minimum
- Inputs: bg-surface2 (#1C1C1C), border #2A2A2A, text white, rounded-lg
- PB badge: bg-success/20 text-success text-xs px-2 py-0.5 rounded-full animate-pbPulse when new
- Active nav item: text-primary
- Inactive nav item: text-text-secondary
- Skeleton: bg-surface2 animate-shimmer rounded-lg
- Never use hover: prefix without also using active: for mobile

## Bottom navigation
Fixed to bottom, 5 items: Dashboard, Schedule, Log (centre, larger orange icon), Exercises, Profile
Log button in centre is elevated with orange background circle.