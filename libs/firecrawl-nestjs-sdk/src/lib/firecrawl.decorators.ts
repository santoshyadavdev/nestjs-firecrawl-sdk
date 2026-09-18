import { Inject } from '@nestjs/common';
import {
  getFirecrawlClientToken,
  getFirecrawlServiceToken,
} from './firecrawl.constants.js';

/**
 * Inject a named {@link FirecrawlService}. Omit `name` for the default client.
 *
 * @example
 * ```ts
 * constructor(@InjectFirecrawl() private readonly firecrawl: FirecrawlService) {}
 * constructor(@InjectFirecrawl('tenant-a') private readonly fc: FirecrawlService) {}
 * ```
 */
export function InjectFirecrawl(name?: string): ParameterDecorator {
  return Inject(getFirecrawlServiceToken(name));
}

/**
 * Inject the underlying named Firecrawl client directly. Omit `name` for the
 * default client.
 *
 * @example
 * ```ts
 * constructor(@InjectFirecrawlClient() private readonly client: Firecrawl) {}
 * ```
 */
export function InjectFirecrawlClient(name?: string): ParameterDecorator {
  return Inject(getFirecrawlClientToken(name));
}
