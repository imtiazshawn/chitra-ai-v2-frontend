# Coding Guidelines

## General

* Keep code simple, readable, and predictable.
* Prefer existing patterns over introducing new patterns.
* Don't over-engineer simple problems.
* Avoid unnecessary abstractions, wrappers, and helper functions.
* Don't write code just because "it might be useful later".
* Keep functions/components small and focused.
* Use meaningful, concise names.

## Comments

* Code should explain itself whenever possible.
* Avoid unnecessary comments.
* Never write long explanatory/AI-style comments.
* Use short comments only when they add real context. `// auth check`, `// fallback`, etc.
* Don't comment obvious code.

## React / Next.js

* Prefer Server Components by default.
* Fetch server-side data in Server Components when practical.
* Use Client Components only when interactivity, browser APIs, state, effects, or event handlers require them.
* Don't make an entire component `use client` unnecessarily.
* Avoid unnecessary `useEffect`.
* Don't use `useEffect` for derived values or simple data transformations.
* Keep client-side state minimal.
* Prefer URL/search params for shareable/filterable state when appropriate.

## API & Data Fetching

* Avoid unnecessary API calls.
* Don't fetch data in the client if the server can provide it directly.
* Don't call an internal API from a Server Component just to call another server function.
* Reuse existing fetching patterns and utilities.
* Handle loading, error, and empty states where needed.
* Don't refetch data without a reason.

## Performance

* Avoid premature optimization, but don't create obvious performance problems.
* Don't render large lists without proper consideration for pagination/virtualization.
* Avoid unnecessary re-renders.
* Don't use `useMemo` / `useCallback` everywhere. Use them only when they provide a real benefit.
* Optimize images using `next/image`.
* Avoid importing heavy libraries for simple tasks.
* Keep client-side JavaScript as small as practical.

## Components

* Prefer composition over giant components.
* Don't create a component for every few lines of JSX.
* Don't create generic components until reuse is actually needed.
* Keep UI, business logic, and data fetching reasonably separated.
* Avoid prop drilling when a simpler solution exists.

## TypeScript

* Don't use `any` unless there is a strong reason.
* Prefer proper types over type assertions.
* Avoid unnecessary interfaces/types.
* Keep types close to where they are used when they aren't shared.
* Don't duplicate types that can be inferred.

## Styling

* Follow the project's existing styling patterns.
* Avoid arbitrary values when existing design tokens/utilities are available.
* Don't duplicate classes unnecessarily.
* Keep responsive behavior intentional, not accidental.

## Vibe Coding Rules

* Don't blindly accept AI-generated code.
* Remove unused imports, variables, functions, and dependencies.
* Remove AI-generated boilerplate.
* Avoid overly defensive code without a real failure case.
* Don't add `try/catch` everywhere without handling the error meaningfully.
* Don't create unnecessary fallback logic.
* Match the surrounding code style.
* If a 10-line solution works, don't write 50 lines.
* **Human-readable > AI-generated-looking.**
