# 🚀 Futuristic Cyberpunk Blogr — Architecture Plan

## Current State
The project is a bare Next.js 16 App Router scaffold with:
- Prisma connected to a Supabase PostgreSQL database (connection string already in `.env`)
- Tailwind CSS v4 configured
- No pages, components, or DB schema yet

---

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database ORM | Prisma → Supabase PostgreSQL |
| Auth | Simple env-var password + `iron-session` cookie |
| Markdown Editor | `@uiw/react-md-editor` |
| Markdown Renderer | `react-markdown` + `remark-gfm` |
| Animations | `framer-motion` (layout-level AnimatePresence) |
| Icons | `lucide-react` |

---

## Database Schema

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  slug      String    @unique
  status    String    @default("draft")  // "draft" | "published"
  likes     Int       @default(0)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  comments  Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userName  String
  content   String
  createdAt DateTime @default(now())
}
```

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout with AnimatePresence + dark mode
│   ├── page.tsx                ← Home: glassmorphism blog card grid
│   ├── globals.css             ← Cyberpunk theme, grid overlay, neon utilities
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx        ← Post detail: Markdown, Like, Comments
│   └── admin/
│       ├── layout.tsx          ← Admin layout with auth guard
│       ├── login/
│       │   └── page.tsx        ← Cyberpunk login form
│       ├── page.tsx            ← Dashboard: post list, toggle, delete
│       └── posts/
│           ├── new/
│           │   └── page.tsx    ← Create post with MDEditor
│           └── [id]/
│               └── edit/
│                   └── page.tsx ← Edit post with MDEditor
├── components/
│   ├── Navbar.tsx              ← Neon-styled navigation
│   ├── GridBackground.tsx      ← Digital blueprint grid overlay
│   ├── BlogCard.tsx            ← Glassmorphism card with neon hover
│   ├── LikeButton.tsx          ← Optimistic UI like button
│   ├── CommentSection.tsx      ← Comment list + submission form
│   └── PageTransition.tsx      ← Framer Motion wrapper component
├── lib/
│   ├── prisma.ts               ← Prisma client singleton (exists)
│   ├── auth.ts                 ← iron-session helpers, login/logout actions
│   └── actions.ts              ← Server Actions: likes, comments, post CRUD
└── middleware.ts               ← Protect /admin/* routes
```

---

## Design System — Cyberpunk Aesthetics

### Glassmorphism Cards
```css
background: rgba(255,255,255,0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(0,242,255,0.2);
```

### Neon Accents
- **Cyan** `#00f2ff` — primary glow, borders, active states
- **Violet** `#7000ff` — secondary glow, hover states
- Drop-shadow: `drop-shadow(0 0 8px #00f2ff)`

### Grid Overlay (Digital Blueprint)
```css
background-image: 
  linear-gradient(rgba(0,242,255,0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0,242,255,0.05) 1px, transparent 1px);
background-size: 40px 40px;
```

### Micro-interactions
- Cards: `hover:scale-[1.02]` + neon border glow intensifies
- Buttons: `hover:drop-shadow(0 0 12px #00f2ff)` + scale
- Like button: pulse animation on click + optimistic count update

---

## Authentication Flow

- `iron-session` encrypts a cookie with `SESSION_SECRET`
- No DB needed for auth — just compare against `ADMIN_PASSWORD` env var
- `middleware.ts` checks session cookie on all `/admin/*` routes
- Unauthenticated requests redirect to `/admin/login`

---

## New Dependencies to Install

```bash
npm install framer-motion lucide-react react-markdown remark-gfm iron-session @uiw/react-md-editor
```

---

## Key Design Decisions

1. **Auth**: `iron-session` encrypts a cookie with `SESSION_SECRET`. No DB needed for auth.
2. **Server Actions**: All mutations use Next.js Server Actions — no separate API routes needed.
3. **Optimistic UI**: `LikeButton.tsx` uses `useOptimistic` (React 19 built-in) to instantly update count.
4. **Framer Motion + App Router**: A `PageTransition.tsx` client component wraps children in `motion.div`.
5. **MDEditor**: Wrapped in `'use client'` with `dynamic(() => import(...), { ssr: false })`.
