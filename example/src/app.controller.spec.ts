import { Test, TestingModule } from '@nestjs/testing';
import { FirecrawlModule } from '@santoshyadavdev/firecrawl-nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        FirecrawlModule.forRoot({ apiKey: 'test-key' }),
        FirecrawlModule.forFeature({ name: 'docs', apiKey: 'test-key' }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
