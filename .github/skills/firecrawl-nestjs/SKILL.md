---
name: firecrawl-nestjs
description: 'Use when integrating or using @santoshyadavdev/firecrawl-sdk in a NestJS app — registering FirecrawlModule (forRoot/forRootAsync/forFeature), injecting FirecrawlService or the raw Firecrawl client, configuring multiple named clients, or calling scrape/crawl/batchScrape/map/search/extract/parse/watcher/usage methods. Triggers on "firecrawl", "web scraping in nestjs", "crawl a site", "inject firecrawl".'
---

# Using @santoshyadavdev/firecrawl-sdk

A NestJS wrapper around the Firecrawl JS SDK (`@mendable/firecrawl-js`). It configures and injects a fully-typed Firecrawl client anywhere in a Nest app, with async config and multiple named clients.

## When to Use

- Registering `FirecrawlModule` in an app or feature module.
- Injecting `FirecrawlService` or the raw `Firecrawl` client.
- Scraping, crawling, batch scraping, mapping, searching, extracting, or parsing.
- Setting up multiple clients (e.g. per tenant or per feature).

## Install

```bash
pnpm add @santoshyadavdev/firecrawl-sdk @mendable/firecrawl-js
```

Peer deps expected in the app: `@nestjs/common`, `@nestjs/core`, `reflect-metadata`, `rxjs`.

## Register the module

Root registration (set `isGlobal: true` to inject anywhere without re-importing):

```ts
import { FirecrawlModule } from '@santoshyadavdev/firecrawl-sdk';

@Module({
  imports: [
    FirecrawlModule.forRoot({ apiKey: process.env.FIRECRAWL_API_KEY, isGlobal: true }),
  ],
})
export class AppModule {}
```

Async (e.g. with `@nestjs/config`):

```ts
FirecrawlModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    apiKey: config.getOrThrow('FIRECRAWL_API_KEY'),
    timeoutMs: 30_000,
  }),
});
```

Named / additional clients with `forFeature` / `forFeatureAsync` (each needs a unique `name`):

```ts
FirecrawlModule.forFeature({ name: 'docs', apiKey: process.env.FIRECRAWL_DOCS_API_KEY });
```

## Inject and use

```ts
import { FirecrawlService, InjectFirecrawl } from '@santoshyadavdev/firecrawl-sdk';

@Injectable()
export class ScraperService {
  constructor(
    @InjectFirecrawl() private readonly firecrawl: FirecrawlService,
    @InjectFirecrawl('docs') private readonly docs: FirecrawlService, // named client
  ) {}

  scrape(url: string) {
    return this.firecrawl.scrape(url, { formats: ['markdown'] });
  }
}
```

Inject the raw client when you need SDK methods not delegated by the service:

```ts
import { Firecrawl, InjectFirecrawlClient } from '@santoshyadavdev/firecrawl-sdk';

@Injectable()
export class RawService {
  constructor(@InjectFirecrawlClient() private readonly client: Firecrawl) {}
}
```

## FirecrawlService methods

| Category   | Methods |
| ---------- | ------- |
| Scrape     | `scrape`, `parse` |
| Crawl      | `crawl`, `startCrawl`, `getCrawlStatus`, `cancelCrawl`, `getCrawlErrors`, `getActiveCrawls` |
| Batch      | `batchScrape`, `startBatchScrape`, `getBatchScrapeStatus`, `cancelBatchScrape` |
| Discovery  | `map`, `search` |
| Extract    | `extract` |
| Monitoring | `watcher`, `getConcurrency`, `getCreditUsage`, `getTokenUsage` |

Anything else (agents, browser sessions, monitors, developer search, feedback) is reachable via `firecrawl.client`.

## Configuration options

`apiKey`, `apiUrl`, `timeoutMs`, `maxRetries`, `backoffFactor`, `name`, `isGlobal`. `apiKey`/`apiUrl` fall back to `FIRECRAWL_API_KEY` / `FIRECRAWL_API_URL`.

## Notes for contributors

- The library is CJS; internal relative imports omit file extensions.
- New delegated methods must use `Parameters<Firecrawl['x']>` / `ReturnType<Firecrawl['x']>`. For overloaded SDK methods (e.g. `scrape`), use a property typed as `Firecrawl['x']` instead — `Parameters<>` collapses to the last overload. Always add a matching mock + test in `firecrawl.service.spec.ts`.
- Run tests with `pnpm exec nx test firecrawl-sdk`.

See the library README at `libs/firecrawl-sdk/README.md` for full examples.
