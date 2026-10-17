# Ilish Bazar — Frontend

Bangla-first e-commerce storefront for fresh ilish (ইলিশ) and related products, built with Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit (RTK Query) and Framer Motion.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server (Turbopack). |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Run ESLint. |

## Project Structure

```
src/
├── app/                # App Router routes, layouts and error boundaries
│   ├── (auth)/         # Login / register route group
│   ├── (dashboard)/    # Authenticated dashboard route group
│   └── (user)/         # Public storefront route group
├── components/
│   ├── feedback/       # Empty, error and loading states
│   ├── layouts/        # Header, sidebar and footer
│   ├── shared/         # Cross-feature UI (logo, product image, ticker)
│   └── ui/             # Design-system primitives
├── features/           # Feature modules (auth, user, product, order, home)
│   └── <feature>/
│       ├── api/        # RTK Query endpoint definitions
│       ├── components/ # Feature components
│       ├── schemas/    # Zod schemas
│       ├── types/      # Feature types
│       └── utils/      # Feature helpers
├── lib/                # Framework-agnostic helpers (utils, site config)
├── redux/              # Store, API base, providers and shared Redux types
└── types/              # Shared domain types
```

## Conventions

- **Files & folders:** `kebab-case` (e.g. `product-card.tsx`).
- **Components:** `PascalCase` named exports (route files keep default exports).
- **Variables/functions:** `camelCase`; module-level constants use `SCREAMING_SNAKE_CASE`.
- **Types & interfaces:** `PascalCase` without `I`/`T` prefixes.
- **Feature imports:** use the `@/` alias.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [React](https://react.dev) 19
- [Redux Toolkit](https://redux-toolkit.js.org) + RTK Query
- [Tailwind CSS](https://tailwindcss.com) 4
- [Framer Motion](https://motion.dev)
- [Zod](https://zod.dev)
- [Base UI](https://base-ui.com) primitives
