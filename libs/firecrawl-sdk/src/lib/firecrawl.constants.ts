/**
 * The name used for the default (unnamed) Firecrawl client.
 */
export const FIRECRAWL_DEFAULT_CLIENT = 'default';

/**
 * Injection token holding the resolved module options.
 */
export const FIRECRAWL_MODULE_OPTIONS = 'FIRECRAWL_MODULE_OPTIONS';

/**
 * Prefix used to build per-client injection tokens.
 */
const FIRECRAWL_CLIENT_TOKEN_PREFIX = 'FIRECRAWL_CLIENT';

/**
 * Build the injection token for a named Firecrawl client.
 *
 * @param name Optional client name. Falls back to the default client.
 */
export function getFirecrawlClientToken(
  name: string = FIRECRAWL_DEFAULT_CLIENT
): string {
  return `${FIRECRAWL_CLIENT_TOKEN_PREFIX}_${name}`;
}

/**
 * Build the injection token for a named FirecrawlService.
 *
 * @param name Optional client name. Falls back to the default client.
 */
export function getFirecrawlServiceToken(
  name: string = FIRECRAWL_DEFAULT_CLIENT
): string {
  return `FIRECRAWL_SERVICE_${name}`;
}
