export { FirecrawlModule } from './lib/firecrawl.module';
export { FirecrawlService } from './lib/firecrawl.service';
export {
  InjectFirecrawl,
  InjectFirecrawlClient,
} from './lib/firecrawl.decorators';
export {
  FIRECRAWL_DEFAULT_CLIENT,
  getFirecrawlClientToken,
  getFirecrawlServiceToken,
} from './lib/firecrawl.constants';
export type {
  FirecrawlModuleOptions,
  FirecrawlModuleAsyncOptions,
  FirecrawlOptionsFactory,
} from './lib/firecrawl.interfaces';

// Re-export the underlying SDK so consumers get types without a second import.
export { Firecrawl } from '@mendable/firecrawl-js';
export type { Firecrawl as FirecrawlClient } from '@mendable/firecrawl-js';
