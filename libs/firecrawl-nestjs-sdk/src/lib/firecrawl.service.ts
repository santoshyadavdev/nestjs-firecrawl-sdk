import { Injectable } from '@nestjs/common';
import { Firecrawl } from '@mendable/firecrawl-js';

/**
 * Injectable wrapper around the Firecrawl client.
 *
 * Exposes the underlying {@link Firecrawl} instance via {@link client} and
 * delegates the most commonly used methods for convenience. For any method not
 * delegated here, use {@link client} directly.
 */
@Injectable()
export class FirecrawlService {
  constructor(private readonly firecrawl: Firecrawl) {}

  /**
   * The underlying Firecrawl client. Use this to access the full SDK surface.
   */
  get client(): Firecrawl {
    return this.firecrawl;
  }

  /**
   * Scrape a single URL.
   *
   * @see Firecrawl.scrape
   */
  scrape(
    ...args: Parameters<Firecrawl['scrape']>
  ): ReturnType<Firecrawl['scrape']> {
    return this.firecrawl.scrape(...args);
  }

  /**
   * Start a crawl and poll until it finishes.
   *
   * @see Firecrawl.crawl
   */
  crawl(
    ...args: Parameters<Firecrawl['crawl']>
  ): ReturnType<Firecrawl['crawl']> {
    return this.firecrawl.crawl(...args);
  }

  /**
   * Start a crawl job without waiting for completion.
   *
   * @see Firecrawl.startCrawl
   */
  startCrawl(
    ...args: Parameters<Firecrawl['startCrawl']>
  ): ReturnType<Firecrawl['startCrawl']> {
    return this.firecrawl.startCrawl(...args);
  }

  /**
   * Get the status and partial data of a crawl job.
   *
   * @see Firecrawl.getCrawlStatus
   */
  getCrawlStatus(
    ...args: Parameters<Firecrawl['getCrawlStatus']>
  ): ReturnType<Firecrawl['getCrawlStatus']> {
    return this.firecrawl.getCrawlStatus(...args);
  }

  /**
   * Map a site to discover URLs (sitemap-aware).
   *
   * @see Firecrawl.map
   */
  map(...args: Parameters<Firecrawl['map']>): ReturnType<Firecrawl['map']> {
    return this.firecrawl.map(...args);
  }

  /**
   * Search the web and optionally scrape each result.
   *
   * @see Firecrawl.search
   */
  search(
    ...args: Parameters<Firecrawl['search']>
  ): ReturnType<Firecrawl['search']> {
    return this.firecrawl.search(...args);
  }

  /**
   * Start a batch scrape and poll until it finishes.
   *
   * @see Firecrawl.batchScrape
   */
  batchScrape(
    ...args: Parameters<Firecrawl['batchScrape']>
  ): ReturnType<Firecrawl['batchScrape']> {
    return this.firecrawl.batchScrape(...args);
  }

  /**
   * Start a batch scrape job without waiting for completion.
   *
   * @see Firecrawl.startBatchScrape
   */
  startBatchScrape(
    ...args: Parameters<Firecrawl['startBatchScrape']>
  ): ReturnType<Firecrawl['startBatchScrape']> {
    return this.firecrawl.startBatchScrape(...args);
  }
}
