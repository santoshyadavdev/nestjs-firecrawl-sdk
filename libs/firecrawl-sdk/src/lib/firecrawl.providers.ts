import type { Provider } from '@nestjs/common';
import { Firecrawl } from '@mendable/firecrawl-js';
import {
  getFirecrawlClientToken,
  getFirecrawlServiceToken,
} from './firecrawl.constants';
import type {
  FirecrawlModuleAsyncOptions,
  FirecrawlModuleOptions,
  FirecrawlOptionsFactory,
} from './firecrawl.interfaces';
import { FirecrawlService } from './firecrawl.service';

/**
 * Create a Firecrawl client instance from module options.
 */
export function createFirecrawlClient(
  options: FirecrawlModuleOptions
): Firecrawl {
  return new Firecrawl({
    apiKey: options.apiKey,
    apiUrl: options.apiUrl,
    timeoutMs: options.timeoutMs,
    maxRetries: options.maxRetries,
    backoffFactor: options.backoffFactor,
  });
}

/**
 * Build the client + service providers for a synchronous registration.
 */
export function createFirecrawlProviders(
  options: FirecrawlModuleOptions
): Provider[] {
  const clientToken = getFirecrawlClientToken(options.name);
  const serviceToken = getFirecrawlServiceToken(options.name);

  const clientProvider: Provider = {
    provide: clientToken,
    useValue: createFirecrawlClient(options),
  };

  const serviceProvider: Provider = {
    provide: serviceToken,
    useValue: new FirecrawlService(clientProvider.useValue as Firecrawl),
  };

  return [clientProvider, serviceProvider];
}

/**
 * Build the client + service providers for an asynchronous registration.
 */
export function createFirecrawlAsyncProviders(
  options: FirecrawlModuleAsyncOptions
): Provider[] {
  const optionsToken = `FIRECRAWL_ASYNC_OPTIONS_${options.name ?? 'default'}`;
  const clientToken = getFirecrawlClientToken(options.name);
  const serviceToken = getFirecrawlServiceToken(options.name);

  const clientProvider: Provider = {
    provide: clientToken,
    useFactory: (resolvedOptions: FirecrawlModuleOptions) =>
      createFirecrawlClient(resolvedOptions),
    inject: [optionsToken],
  };

  const serviceProvider: Provider = {
    provide: serviceToken,
    useFactory: (client: Firecrawl) => new FirecrawlService(client),
    inject: [clientToken],
  };

  return [
    ...createAsyncOptionsProviders(optionsToken, options),
    clientProvider,
    serviceProvider,
  ];
}

/**
 * Build the provider(s) that resolve {@link FirecrawlModuleOptions} for async
 * registration (useFactory / useClass / useExisting).
 */
function createAsyncOptionsProviders(
  optionsToken: string,
  options: FirecrawlModuleAsyncOptions
): Provider[] {
  if (options.useFactory) {
    return [
      {
        provide: optionsToken,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      },
    ];
  }

  const inject = [
    (options.useExisting ?? options.useClass) as NonNullable<
      FirecrawlModuleAsyncOptions['useClass']
    >,
  ];

  const providers: Provider[] = [
    {
      provide: optionsToken,
      useFactory: (factory: FirecrawlOptionsFactory) =>
        factory.createFirecrawlOptions(),
      inject,
    },
  ];

  if (options.useClass) {
    providers.push({
      provide: options.useClass,
      useClass: options.useClass,
    });
  }

  return providers;
}
