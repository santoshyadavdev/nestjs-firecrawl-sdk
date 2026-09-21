# @santoshyadavdev/firecrawl-sdk

A NestJS wrapper around the [Firecrawl JS SDK](https://github.com/firecrawl/firecrawl/tree/main/apps/js-sdk) (`@mendable/firecrawl-js`). It lets you configure and inject a fully-typed Firecrawl client anywhere in your Nest application, with support for async configuration and multiple named clients.

## Installation

```bash
npm install @santoshyadavdev/firecrawl-sdk @mendable/firecrawl-js
# or
pnpm add @santoshyadavdev/firecrawl-sdk @mendable/firecrawl-js
```

`@nestjs/common`, `@nestjs/core`, `reflect-metadata`, and `rxjs` are peer dependencies and are expected to already exist in your Nest app.

## Quick start

Register the module at the root of your app:

```ts
import { Module } from '@nestjs/common';
import { FirecrawlModule } from '@santoshyadavdev/firecrawl-sdk';

@Module({
  imports: [
    FirecrawlModule.forRoot({
      apiKey: process.env.FIRECRAWL_API_KEY,
      isGlobal: true, // optional: inject anywhere without re-importing
    }),
  ],
})
export class AppModule {}
```

Inject and use the service:

```ts
import { Injectable } from '@nestjs/common';
import { FirecrawlService, InjectFirecrawl } from '@santoshyadavdev/firecrawl-sdk';

@Injectable()
export class ScraperService {
  constructor(
    @InjectFirecrawl() private readonly firecrawl: FirecrawlService
  ) {}

  scrapePage(url: string) {
    return this.firecrawl.scrape(url, { formats: ['markdown'] });
  }

  crawlSite(url: string) {
    return this.firecrawl.crawl(url, { limit: 50 });
  }
}
```

The service delegates the most commonly used methods of the underlying [`@mendable/firecrawl-js`](https://www.npmjs.com/package/@mendable/firecrawl-js) client:

| Category   | Delegated methods                                                                        |
| ---------- | ---------------------------------------------------------------------------------------- |
| Scrape     | `scrape`, `parse`                                                                         |
| Crawl      | `crawl`, `startCrawl`, `getCrawlStatus`, `cancelCrawl`, `getCrawlErrors`, `getActiveCrawls` |
| Batch      | `batchScrape`, `startBatchScrape`, `getBatchScrapeStatus`, `cancelBatchScrape`           |
| Discovery  | `map`, `search`                                                                          |
| Extract    | `extract`                                                                                |
| Monitoring | `watcher`, `getConcurrency`, `getCreditUsage`, `getTokenUsage`                           |

For anything not delegated (agents, browser sessions, monitors, developer search, feedback, etc.), reach for the underlying client via `firecrawl.client`:

```ts
this.firecrawl.client.agent({ urls: ['https://example.com'], prompt: '...' });
```

## Usage examples

### Scrape

```ts
// Get markdown + a JSON extraction in one call.
const doc = await this.firecrawl.scrape('https://example.com', {
  formats: ['markdown', 'html'],
  onlyMainContent: true,
});
```

### Crawl (async with polling)

```ts
// Start a crawl and poll until it finishes.
const job = await this.firecrawl.crawl('https://example.com', {
  limit: 100,
  scrapeOptions: { formats: ['markdown'] },
});

// Or manage the lifecycle yourself.
const { id } = await this.firecrawl.startCrawl('https://example.com', { limit: 100 });
const status = await this.firecrawl.getCrawlStatus(id);
const errors = await this.firecrawl.getCrawlErrors(id);
await this.firecrawl.cancelCrawl(id);
```

### Batch scrape

```ts
const batch = await this.firecrawl.batchScrape(
  ['https://a.com', 'https://b.com'],
  { formats: ['markdown'] }
);

const { id } = await this.firecrawl.startBatchScrape(['https://a.com']);
const status = await this.firecrawl.getBatchScrapeStatus(id);
await this.firecrawl.cancelBatchScrape(id);
```

### Map & search

```ts
// Discover URLs on a site.
const { links } = await this.firecrawl.map('https://example.com', {
  includeSubdomains: true,
  limit: 500,
});

// Search the web and scrape each result.
const results = await this.firecrawl.search('firecrawl nestjs', {
  limit: 5,
  scrapeOptions: { formats: ['markdown'] },
});
```

### Extract structured data

```ts
const extracted = await this.firecrawl.extract({
  urls: ['https://example.com'],
  prompt: 'Extract the product name and price',
});
```

### Watch a job

```ts
const watcher = this.firecrawl.watcher(id, { kind: 'crawl' });
watcher.on('document', (doc) => console.log('scraped', doc));
watcher.on('done', (state) => console.log('finished', state.status));
watcher.on('error', (err) => console.error(err));
```

### Account usage

```ts
const concurrency = await this.firecrawl.getConcurrency();
const credits = await this.firecrawl.getCreditUsage();
const tokens = await this.firecrawl.getTokenUsage();
```

You can also inject the raw client directly:

```ts
import { Firecrawl, InjectFirecrawlClient } from '@santoshyadavdev/firecrawl-sdk';

@Injectable()
export class RawService {
  constructor(@InjectFirecrawlClient() private readonly client: Firecrawl) {}
}
```

## Async configuration

Configure the client using values resolved at runtime (e.g. from `@nestjs/config`):

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirecrawlModule } from '@santoshyadavdev/firecrawl-sdk';

@Module({
  imports: [
    FirecrawlModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.getOrThrow('FIRECRAWL_API_KEY'),
        timeoutMs: 30_000,
      }),
    }),
  ],
})
export class AppModule {}
```

`forRootAsync` also supports `useClass` and `useExisting` with a factory implementing `FirecrawlOptionsFactory`:

```ts
import { FirecrawlModuleOptions, FirecrawlOptionsFactory } from '@santoshyadavdev/firecrawl-sdk';

@Injectable()
export class FirecrawlConfig implements FirecrawlOptionsFactory {
  createFirecrawlOptions(): FirecrawlModuleOptions {
    return { apiKey: process.env.FIRECRAWL_API_KEY };
  }
}

FirecrawlModule.forRootAsync({ useClass: FirecrawlConfig });
```

## Multiple named clients

Register additional clients with a unique `name` (useful for multi-tenant apps or different API keys per feature):

```ts
@Module({
  imports: [
    FirecrawlModule.forRoot({ apiKey: process.env.FIRECRAWL_API_KEY }),
    FirecrawlModule.forFeature({ apiKey: process.env.TENANT_A_KEY, name: 'tenant-a' }),
    FirecrawlModule.forFeatureAsync({
      name: 'tenant-b',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.getOrThrow('TENANT_B_KEY'),
      }),
    }),
  ],
})
export class AppModule {}
```

Inject a named client or service by passing the name to the decorator:

```ts
@Injectable()
export class MultiTenantService {
  constructor(
    @InjectFirecrawl('tenant-a') private readonly tenantA: FirecrawlService,
    @InjectFirecrawl('tenant-b') private readonly tenantB: FirecrawlService
  ) {}
}
```

## Configuration options

| Option          | Type              | Description                                                        |
| --------------- | ----------------- | ------------------------------------------------------------------ |
| `apiKey`        | `string \| null`  | Firecrawl API key. Falls back to `FIRECRAWL_API_KEY`.              |
| `apiUrl`        | `string \| null`  | API base URL. Falls back to `FIRECRAWL_API_URL` or the cloud URL.  |
| `timeoutMs`     | `number`          | Per-request timeout in milliseconds.                               |
| `maxRetries`    | `number`          | Max automatic retries for transient failures.                     |
| `backoffFactor` | `number`          | Exponential backoff factor between retries.                        |
| `name`          | `string`          | Unique name for registering/injecting multiple clients.           |
| `isGlobal`      | `boolean`         | Register the module globally (`forRoot`/`forRootAsync`).           |

## Running unit tests

Run `nx test firecrawl-sdk` to execute the unit tests via [Vitest](https://vitest.dev/).

## License

MIT
