# GymTracker — Frontend

A mobile-first React web app for tracking gym workouts. Log sessions, track sets and weight, monitor exercise progress, and manage reusable workout templates — all from your phone.

This is the frontend half of the Gym Tracker project. It connects to an ASP.NET Core 9 REST API backed by a Supabase PostgreSQL database.

---

## Why I built this

I was tracking workouts in the Notes app — lists of numbers that were impossible to compare across sessions. I wanted something purpose-built that I'd actually use between sets, so I built it myself. It also gave me a real reason to build a proper full-stack project rather than a tutorial clone.

---

## Live Demo

gym-tracker-frontend-azure.vercel.app

> The backend runs on Render's free tier and may take ~30s to wake on first request.

---

## Features

**Auth** — Register with email confirmation, login with inline error feedback, forgot/reset password via email link, auto-logout on token expiry.

**Workout Logging** — Create sessions, add exercises from the library, log sets (weight + reps) with auto-incrementing set numbers, edit sets inline, personal best detection with a visual badge.

**Dashboard** — Weekly scheduled vs. completed overview, recent sessions list.

**Exercise Library** — Browse, search, and filter by muscle group. Create, edit, and delete exercises. Personal best shown per exercise.

**Progress Tracking** — Line chart of weight over time per exercise, with personal best and session count.

**Templates** — Create reusable workout templates with default sets/reps per exercise, reorder exercises, and start a session directly from a template.

**Schedule & Calendar** — Weekly and monthly views of all sessions.

**Profile** — 6 switchable accent colour themes applied instantly via a CSS variable.

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5 |
| Build tool | Vite |
| Routing | React Router v7 |
| Server state | TanStack React Query v5 |
| HTTP | Axios |
| Styling | Tailwind CSS v3 |
| UI primitives | Radix UI (Dialog, Sheet) |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── api/          # Axios modules, one per resource. client.ts holds the
│                 # instance, auth interceptor, and global error handling.
├── hooks/        # React Query hooks wrapping the API layer — one file
│                 # per resource, plus a custom module-level toast hook.
├── pages/        # 16 page components, one per route.
├── components/   # BottomNav, ProtectedRoute, SkeletonCard, and a small
│   └── ui/       # set of reusable primitives (Button, Input, Card, etc.)
├── types/        # TypeScript interfaces matching every API response DTO.
└── lib/          # theme.ts (CSS variable), utils.ts (cn() helper)
```

Data flow: `api/` handles HTTP → `hooks/` wraps with React Query → `pages/` consume hooks and own local UI state.

---

## What I Learned

**TypeScript at scale** pays off once the codebase grows. Having API response interfaces defined in one place meant mismatches surfaced at compile time, not at runtime in the browser.

**A proper API layer is worth the separation.** A centralised Axios instance with interceptors for auth headers, 401 handling, and error formatting meant every page got consistent behaviour without repeating that logic anywhere.

**Auth flows have real edge cases.** The detail that bit me: a global 401 interceptor can't blindly redirect to `/login` when the login endpoint itself returns a 401. I had to check the request URL and let those errors stay inline on the form instead.

**React Query replaced a lot of messy `useEffect` code.** Writing a small query hook per resource and composing them in pages is a pattern I'll carry forward.

**Mobile-first is a different discipline.** 44px touch targets, bottom navigation, inputs sized to avoid iOS zoom — these need to be decisions from the start, not retrofitted later.

**Error handling needs a clear strategy.** The backend returns two different error shapes; deciding which layer handles each (interceptor for generic errors, form for 422 validation) kept the UI logic clean.

---

## Challenges and Solutions

**Global interceptor vs. inline login errors** — The 401 redirect is right for expired sessions but wrong when it's the login endpoint returning bad credentials. Fixed by checking `error.config.url` in the interceptor and skipping the redirect for auth routes.

**Log workout complexity** — The session screen manages exercises, sets, edit forms, and PB animations simultaneously. Keeping React Query responsible for server state and local state responsible for UI-only concerns (which row is editing, flash animations) was what made it manageable.

**Nested resource cache invalidation** — Sets live inside session exercises, which live inside sessions. After any mutation, being explicit about which queries to invalidate prevented stale data showing up in the UI.

**Dynamic theming** — Six colour themes work by updating a single CSS custom property on the document root. Every Tailwind `primary-*` class references that variable, so switching is instant with no React re-renders.

---

## Running Locally

```bash
git clone https://github.com/lukasregulla/GymTracker-Frontend
cd GymTracker-Frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=https://gymbackend-yreu.onrender.com
```

```bash
npm run dev   # http://localhost:5173
```

You can point `VITE_API_URL` at the hosted backend to skip running the API locally.

---

## Future Improvements

- Rest timer between sets
- Swipe to delete sets on mobile
- Offline support for the logging screen
- CSV export of workout history

---

## Screenshots


---

## Related

- **Backend repository:** [→ Add link]
- Built with [React](https://react.dev) · [TanStack Query](https://tanstack.com/query) · [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com) · API on [Render](https://render.com) · Database on [Supabase](https://supabase.com)
