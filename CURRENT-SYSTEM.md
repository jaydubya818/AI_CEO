# CURRENT-SYSTEM

## Repo shape
- Root repo is lightweight; active app lives in `web/`.
- Stack: Next.js 16, React 19, TypeScript, Tailwind 4, ESLint 9.
- No backend/API service, database, migrations, Docker, or multi-service runtime detected.
- No automated test suite or browser automation config detected.

## Current validation reality
- `web/npm install` succeeds.
- `web/npm run build` succeeds.
- `web/npm run lint` currently fails.

## Current known friction
1. **Lint blocker**: `web/app/page.tsx` triggers `react-hooks/set-state-in-effect` for synchronous `setState` calls inside an effect.
2. **Lint warning**: unused `Badge` import in `web/components/sections/OverviewSection.tsx`.
3. **Build warning**: Next.js infers workspace root from a higher-level lockfile (`/Users/jaywest/package-lock.json`), suggesting `turbopack.root` if you want that warning silenced.

## Best bounded real-validation targets
- dependency install
- lint
- production build
- dev-server startup
- homepage render
- query-param state behavior (`section`, `risk`, `decision`)
- basic UI smoke in a browser

## Not yet strong targets
- deep semantic validation of business logic
- backend/API validation
- test-suite validation (none present)
- strong visual regression confidence without browser automation
