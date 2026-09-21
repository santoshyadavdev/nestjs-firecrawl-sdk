## 0.1.0 (2026-09-21)

### Features

- **FirecrawlModule** with `forRoot`/`forRootAsync` for default or named client registration and `forFeature`/`forFeatureAsync` for additional named clients.
- **FirecrawlService** injectable wrapper exposing the raw `Firecrawl` client via `.client` and delegating common SDK methods:
  - `scrape` — scrape a single URL (preserves overloaded signatures)
  - `crawl` / `startCrawl` / `getCrawlStatus` / `cancelCrawl` / `getCrawlErrors` / `getActiveCrawls` — full crawl lifecycle
  - `batchScrape` / `startBatchScrape` / `getBatchScrapeStatus` / `cancelBatchScrape` — batch scrape operations
  - `map` — sitemap-aware URL discovery
  - `search` — web search with optional scraping
  - `extract` — structured data extraction via schema or prompt
  - `parse` — file parsing (PDF, docs, etc.)
  - `watcher` — event-based monitoring for crawl/batch jobs
  - `getConcurrency` / `getCreditUsage` / `getTokenUsage` — usage and billing info
- **Multi-client support** — register multiple named Firecrawl clients using the `name` option and `@InjectFirecrawl(name)` / `@InjectFirecrawlClient(name)` decorators.
- **`@InjectFirecrawl()`** decorator to inject `FirecrawlService` (default or named).
- **`@InjectFirecrawlClient()`** decorator to inject the raw `Firecrawl` SDK client directly.
- Re-exports `Firecrawl` class and `FirecrawlClient` type from `@mendable/firecrawl-js`.
- Environment variable fallback — options fall back to `FIRECRAWL_API_KEY` / `FIRECRAWL_API_URL` when not explicitly configured.