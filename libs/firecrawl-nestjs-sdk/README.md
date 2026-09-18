# @santoshyadavdev/firecrawl-nestjs

A NestJS wrapper around the [Firecrawl JS SDK](https://github.com/firecrawl/firecrawl/tree/main/apps/js-sdk) (`@mendable/firecrawl-js`). It lets you configure and inject a fully-typed Firecrawl client anywhere in your Nest application, with support for async configuration and multiple named clients.

## Installation

```bash
npm install @santoshyadavdev/firecrawl-nestjs @mendable/firecrawl-js
# or
pnpm add @santoshyadavdev/firecrawl-nestjs @mendable/firecrawl-js
```

`@nestjs/common`, `@nestjs/core`, `reflect-metadata`, and `rxjs` are peer dependencies and are expected to already exist in your Nest app.

## Quick start

Register the module at the root of your app:

```ts
import { Module } from '@nestjs/common';
import { FirecrawlModule } from '@santoshyadavdev/firecrawl-nestjs';

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
import { FirecrawlService, InjectFirecrawl } from '@santoshyadavdev/firecrawl-nestjs';

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

The service delegates the most common methods (`scrape`, `crawl`, `startCrawl`, `getCrawlStatus`, `map`, `search`, `batchScrape`, `startBatchScrape`). For the full SDK surface, use the underlying client:

```ts
this.firecrawl.client.extract({ urls: ['https://example.com'], prompt: '...' });
```

You can also inject the raw client directly:

```ts
import { Firecrawl, InjectFirecrawlClient } from '@santoshyadavdev/firecrawl-nestjs';

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
import { FirecrawlModule } from '@santoshyadavdev/firecrawl-nestjs';

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
import { FirecrawlModuleOptions, FirecrawlOptionsFactory } from '@santoshyadavdev/firecrawl-nestjs';

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

Run `nx test firecrawl-nestjs-sdk` to execute the unit tests via [Vitest](https://vitest.dev/).

## License

MIT
