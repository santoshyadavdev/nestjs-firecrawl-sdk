import { Injectable } from '@nestjs/common';
import {
  FirecrawlService,
  InjectFirecrawl,
} from '@santoshyadavdev/firecrawl-nestjs';

@Injectable()
export class AppService {
  constructor(
    @InjectFirecrawl() private readonly firecrawl: FirecrawlService,
    @InjectFirecrawl('docs') private readonly docsFirecrawl: FirecrawlService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  /** Scrape a single page and return its markdown. */
  scrape(url: string) {
    return this.firecrawl.scrape(url, { formats: ['markdown'] });
  }

  /** Crawl a site (up to a small limit) and return the collected pages. */
  crawl(url: string) {
    return this.firecrawl.crawl(url, { limit: 10 });
  }

  /** Discover URLs on a site. */
  map(url: string) {
    return this.firecrawl.map(url);
  }

  /** Search the web and scrape each result as markdown. */
  search(query: string) {
    return this.firecrawl.search(query, {
      limit: 5,
      scrapeOptions: { formats: ['markdown'] },
    });
  }

  /** Scrape a page using the named "docs" client registered via forFeature. */
  scrapeDocs(url: string) {
    return this.docsFirecrawl.scrape(url, { formats: ['markdown'] });
  }
}
