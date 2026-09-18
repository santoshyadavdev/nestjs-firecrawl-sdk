import { Module } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';
import type {
  FirecrawlModuleAsyncOptions,
  FirecrawlModuleOptions,
} from './firecrawl.interfaces.js';
import {
  createFirecrawlAsyncProviders,
  createFirecrawlProviders,
} from './firecrawl.providers.js';

/**
 * NestJS module wrapping the Firecrawl JS SDK.
 *
 * Use {@link forRoot} / {@link forRootAsync} to configure the default (or a
 * named) client at the application root, and {@link forFeature} /
 * {@link forFeatureAsync} to register additional named clients.
 */
@Module({})
export class FirecrawlModule {
  /**
   * Register a Firecrawl client synchronously.
   *
   * @param options Client options. Set `isGlobal: true` to make the client
   * available application-wide without re-importing the module.
   */
  static forRoot(options: FirecrawlModuleOptions = {}): DynamicModule {
    const providers = createFirecrawlProviders(options);

    return {
      module: FirecrawlModule,
      global: options.isGlobal,
      providers,
      exports: providers,
    };
  }

  /**
   * Register a Firecrawl client asynchronously (e.g. using ConfigService).
   *
   * @param options Async options (useFactory / useClass / useExisting).
   */
  static forRootAsync(options: FirecrawlModuleAsyncOptions): DynamicModule {
    const providers = createFirecrawlAsyncProviders(options);

    return {
      module: FirecrawlModule,
      global: options.isGlobal,
      imports: options.imports ?? [],
      providers: [...providers, ...(options.extraProviders ?? [])],
      exports: providers,
    };
  }

  /**
   * Register an additional named Firecrawl client synchronously.
   *
   * @param options Client options. Provide a unique `name` per client.
   */
  static forFeature(options: FirecrawlModuleOptions = {}): DynamicModule {
    const providers = createFirecrawlProviders(options);

    return {
      module: FirecrawlModule,
      providers,
      exports: providers,
    };
  }

  /**
   * Register an additional named Firecrawl client asynchronously.
   *
   * @param options Async options. Provide a unique `name` per client.
   */
  static forFeatureAsync(
    options: FirecrawlModuleAsyncOptions
  ): DynamicModule {
    const providers = createFirecrawlAsyncProviders(options);

    return {
      module: FirecrawlModule,
      imports: options.imports ?? [],
      providers: [...providers, ...(options.extraProviders ?? [])],
      exports: providers,
    };
  }
}
