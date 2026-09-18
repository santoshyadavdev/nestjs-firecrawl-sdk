import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('scrape')
  scrape(@Query('url') url: string) {
    return this.appService.scrape(url);
  }

  @Get('crawl')
  crawl(@Query('url') url: string) {
    return this.appService.crawl(url);
  }

  @Get('map')
  map(@Query('url') url: string) {
    return this.appService.map(url);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.appService.search(query);
  }

  @Get('docs/scrape')
  scrapeDocs(@Query('url') url: string) {
    return this.appService.scrapeDocs(url);
  }
}
