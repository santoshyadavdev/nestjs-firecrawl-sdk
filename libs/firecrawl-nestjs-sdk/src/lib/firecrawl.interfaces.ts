import type { ModuleMetadata, Provider, Type } from '@nestjs/common';

/**
 * Options used to construct a Firecrawl client.
 *
 * Mirrors the constructor options of `@mendable/firecrawl-js` and adds an
 * optional `name` so multiple named clients can coexist in one application.
 */
export interface FirecrawlModuleOptions {
  /**
   * Firecrawl API key. Falls back to the `FIRECRAWL_API_KEY` environment
   * variable when omitted.
   */
  apiKey?: string | null;

  /**
   * Firecrawl API base URL. Falls back to `FIRECRAWL_API_URL` or the public
   * cloud endpoint when omitted.
   */
  apiUrl?: string | null;

  /**
   * Per-request timeout in milliseconds.
   */
  timeoutMs?: number;

  /**
   * Maximum number of automatic retries for transient failures.
   */
  maxRetries?: number;

  /**
   * Exponential backoff factor used between retries.
   */
  backoffFactor?: number;

  /**
   * Optional name for this client. Use it to register and inject multiple
   * Firecrawl clients (e.g. per tenant or per feature). Defaults to the
   * default client name.
   */
  name?: string;

  /**
   * Register the module globally so the client/service can be injected
   * anywhere without re-importing the module.
   */
  isGlobal?: boolean;
}

/**
 * Factory that produces {@link FirecrawlModuleOptions}.
 */
export interface FirecrawlOptionsFactory {
  createFirecrawlOptions():
    | Promise<FirecrawlModuleOptions>
    | FirecrawlModuleOptions;
}

/**
 * Async configuration for the Firecrawl module.
 */
export interface FirecrawlModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Optional name for this client, enabling multiple named clients.
   */
  name?: string;

  /**
   * Register the module globally.
   */
  isGlobal?: boolean;

  /**
   * Existing provider implementing {@link FirecrawlOptionsFactory}.
   */
  useExisting?: Type<FirecrawlOptionsFactory>;

  /**
   * Class provider implementing {@link FirecrawlOptionsFactory}.
   */
  useClass?: Type<FirecrawlOptionsFactory>;

  /**
   * Factory function returning the module options.
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<FirecrawlModuleOptions> | FirecrawlModuleOptions;

  /**
   * Dependencies to inject into the `useFactory` function.
   */
  inject?: any[];

  /**
   * Extra providers to register alongside the async options provider.
   */
  extraProviders?: Provider[];
}
