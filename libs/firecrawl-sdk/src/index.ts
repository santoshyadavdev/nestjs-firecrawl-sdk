export { FirecrawlModule } from './lib/firecrawl.module.js';
export { FirecrawlService } from './lib/firecrawl.service.js';
export {
  InjectFirecrawl,
  InjectFirecrawlClient,
} from './lib/firecrawl.decorators.js';
export {
  FIRECRAWL_DEFAULT_CLIENT,
  getFirecrawlClientToken,
  getFirecrawlServiceToken,
} from './lib/firecrawl.constants.js';
export type {
  FirecrawlModuleOptions,
  FirecrawlModuleAsyncOptions,
  FirecrawlOptionsFactory,
} from './lib/firecrawl.interfaces.js';

// Re-export the underlying SDK so consumers get types without a second import.
export { Firecrawl } from '@mendable/firecrawl-js';
export type { Firecrawl as FirecrawlClient } from '@mendable/firecrawl-js';
