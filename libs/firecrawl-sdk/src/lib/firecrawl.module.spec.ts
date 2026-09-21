import { Test } from '@nestjs/testing';
import { Firecrawl } from '@mendable/firecrawl-js';
import { describe, expect, it } from 'vitest';
import { FirecrawlModule } from './firecrawl.module';
import { FirecrawlService } from './firecrawl.service';
import {
  InjectFirecrawl,
  InjectFirecrawlClient,
} from './firecrawl.decorators';
import {
  getFirecrawlClientToken,
  getFirecrawlServiceToken,
} from './firecrawl.constants';
import type {
  FirecrawlModuleOptions,
  FirecrawlOptionsFactory,
} from './firecrawl.interfaces';

describe('FirecrawlModule', () => {
  describe('forRoot', () => {
    it('provides a FirecrawlService bound to a Firecrawl client', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [FirecrawlModule.forRoot({ apiKey: 'test-key' })],
      }).compile();

      const service = moduleRef.get<FirecrawlService>(
        getFirecrawlServiceToken()
      );
      const client = moduleRef.get<Firecrawl>(getFirecrawlClientToken());

      expect(service).toBeInstanceOf(FirecrawlService);
      expect(client).toBeInstanceOf(Firecrawl);
      expect(service.client).toBe(client);
    });

    it('works with default options (no api key)', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [FirecrawlModule.forRoot()],
      }).compile();

      const service = moduleRef.get<FirecrawlService>(
        getFirecrawlServiceToken()
      );
      expect(service).toBeInstanceOf(FirecrawlService);
    });
  });

  describe('forRootAsync', () => {
    it('resolves options via useFactory', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          FirecrawlModule.forRootAsync({
            useFactory: (): FirecrawlModuleOptions => ({
              apiKey: 'async-key',
            }),
          }),
        ],
      }).compile();

      const service = moduleRef.get<FirecrawlService>(
        getFirecrawlServiceToken()
      );
      expect(service).toBeInstanceOf(FirecrawlService);
      expect(service.client).toBeInstanceOf(Firecrawl);
    });

    it('resolves options via useClass', async () => {
      class ConfigFactory implements FirecrawlOptionsFactory {
        createFirecrawlOptions(): FirecrawlModuleOptions {
          return { apiKey: 'class-key' };
        }
      }

      const moduleRef = await Test.createTestingModule({
        imports: [
          FirecrawlModule.forRootAsync({ useClass: ConfigFactory }),
        ],
      }).compile();

      const service = moduleRef.get<FirecrawlService>(
        getFirecrawlServiceToken()
      );
      expect(service).toBeInstanceOf(FirecrawlService);
    });
  });

  describe('named clients', () => {
    it('registers and isolates multiple named clients', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          FirecrawlModule.forRoot({ apiKey: 'a', name: 'tenant-a' }),
          FirecrawlModule.forFeature({ apiKey: 'b', name: 'tenant-b' }),
        ],
      }).compile();

      const a = moduleRef.get<Firecrawl>(getFirecrawlClientToken('tenant-a'));
      const b = moduleRef.get<Firecrawl>(getFirecrawlClientToken('tenant-b'));

      expect(a).toBeInstanceOf(Firecrawl);
      expect(b).toBeInstanceOf(Firecrawl);
      expect(a).not.toBe(b);
    });
  });

  describe('decorators', () => {
    it('inject decorators attach the correct token metadata', async () => {
      class Consumer {
        constructor(
          readonly service: FirecrawlService,
          readonly client: Firecrawl
        ) {}
      }

      InjectFirecrawl()(Consumer, undefined, 0);
      InjectFirecrawlClient('tenant-a')(Consumer, undefined, 1);

      const selfParams =
        Reflect.getMetadata('self:paramtypes', Consumer) ?? [];
      const tokens = selfParams.map((p: { param: string }) => p.param);

      expect(tokens).toContain(getFirecrawlServiceToken());
      expect(tokens).toContain(getFirecrawlClientToken('tenant-a'));
    });

    it('resolves injected named services/clients through DI', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          FirecrawlModule.forRoot({ apiKey: 'default' }),
          FirecrawlModule.forFeature({ apiKey: 'a', name: 'tenant-a' }),
        ],
      }).compile();

      const service = moduleRef.get<FirecrawlService>(
        getFirecrawlServiceToken()
      );
      const client = moduleRef.get<Firecrawl>(
        getFirecrawlClientToken('tenant-a')
      );

      expect(service).toBeInstanceOf(FirecrawlService);
      expect(client).toBeInstanceOf(Firecrawl);
    });
  });
});
