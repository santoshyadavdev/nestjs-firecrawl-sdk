# Project Guidelines

This is an Nx monorepo that publishes `@santoshyadavdev/firecrawl-nestjs` — a NestJS wrapper around the Firecrawl JS SDK (`@mendable/firecrawl-js`).

## Architecture

- `libs/firecrawl-sdk/` — the published library.
  - `firecrawl.module.ts` — `FirecrawlModule` with `forRoot`/`forRootAsync` (default or named client) and `forFeature`/`forFeatureAsync` (additional named clients).
  - `firecrawl.service.ts` — `FirecrawlService`, an injectable that exposes the raw client via `.client` and delegates common methods (scrape, crawl, batch, map, search, extract, parse, watcher, usage).
  - `firecrawl.providers.ts` — builds client + service providers; the single place that maps module options to `new Firecrawl({...})`.
  - `firecrawl.decorators.ts` — `@InjectFirecrawl(name?)` (service) and `@InjectFirecrawlClient(name?)` (raw client).
  - `firecrawl.constants.ts` — token helpers keyed by client name; the default client name is `default`.
- `example/` — standalone NestJS app demonstrating real consumer usage.

## Conventions

- The library is ESM (`"type": "module"`); internal relative imports use explicit `.js` extensions.
- Delegated methods on `FirecrawlService` use `Parameters<Firecrawl['x']>` / `ReturnType<Firecrawl['x']>` so signatures track the SDK exactly. For overloaded SDK methods (e.g. `scrape`), use a property typed as `Firecrawl['x']` instead — `Parameters<>` collapses to the last overload. Follow these patterns when adding methods, and add a matching mock + test in `firecrawl.service.spec.ts`.
- Multiple clients are keyed by `name`; injection tokens come from `getFirecrawlClientToken` / `getFirecrawlServiceToken`.
- Don't hardcode API keys. Options fall back to `FIRECRAWL_API_KEY` / `FIRECRAWL_API_URL`.

## Build and Test

This repo uses **pnpm** and **Nx** (Node 24 in CI).

```bash
pnpm install --frozen-lockfile
pnpm exec nx run-many -t lint test build typecheck   # everything
pnpm exec nx test firecrawl-sdk               # library unit tests (Vitest)
```

## Usage

For guidance on consuming the library (module registration, injection, and the available `FirecrawlService` methods), use the `firecrawl-nestjs` skill in `.github/skills/`.
