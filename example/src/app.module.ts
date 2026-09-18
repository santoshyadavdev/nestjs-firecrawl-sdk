import { Module } from '@nestjs/common';
import { FirecrawlModule } from '@santoshyadavdev/firecrawl-nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    FirecrawlModule.forRoot({
      apiKey: process.env.FIRECRAWL_API_KEY,
      isGlobal: true,
    }),
    // A second, independently-configured client registered under a name.
    FirecrawlModule.forFeature({
      name: 'docs',
      apiKey: process.env.FIRECRAWL_DOCS_API_KEY ?? process.env.FIRECRAWL_API_KEY,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
