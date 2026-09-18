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
  // `scrape` is overloaded in the SDK; expose the client's full overloaded type
  // rather than `Parameters<>`, which would collapse to the last overload.
  scrape: Firecrawl['scrape'] = (...args: any[]): any =>
    (this.firecrawl.scrape as (...a: any[]) => unknown)(...args);

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
   * Cancel a running crawl job.
   *
   * @see Firecrawl.cancelCrawl
   */
  cancelCrawl(
    ...args: Parameters<Firecrawl['cancelCrawl']>
  ): ReturnType<Firecrawl['cancelCrawl']> {
    return this.firecrawl.cancelCrawl(...args);
  }

  /**
   * Retrieve crawl errors and robots.txt blocks.
   *
   * @see Firecrawl.getCrawlErrors
   */
  getCrawlErrors(
    ...args: Parameters<Firecrawl['getCrawlErrors']>
  ): ReturnType<Firecrawl['getCrawlErrors']> {
    return this.firecrawl.getCrawlErrors(...args);
  }

  /**
   * List active crawls for the authenticated team.
   *
   * @see Firecrawl.getActiveCrawls
   */
  getActiveCrawls(
    ...args: Parameters<Firecrawl['getActiveCrawls']>
  ): ReturnType<Firecrawl['getActiveCrawls']> {
    return this.firecrawl.getActiveCrawls(...args);
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

  /**
   * Get the status and partial data of a batch scrape job.
   *
   * @see Firecrawl.getBatchScrapeStatus
   */
  getBatchScrapeStatus(
    ...args: Parameters<Firecrawl['getBatchScrapeStatus']>
  ): ReturnType<Firecrawl['getBatchScrapeStatus']> {
    return this.firecrawl.getBatchScrapeStatus(...args);
  }

  /**
   * Cancel a running batch scrape job.
   *
   * @see Firecrawl.cancelBatchScrape
   */
  cancelBatchScrape(
    ...args: Parameters<Firecrawl['cancelBatchScrape']>
  ): ReturnType<Firecrawl['cancelBatchScrape']> {
    return this.firecrawl.cancelBatchScrape(...args);
  }

  /**
   * Parse an uploaded file (PDF, docs, etc.) into the requested formats.
   *
   * @see Firecrawl.parse
   */
  parse(
    ...args: Parameters<Firecrawl['parse']>
  ): ReturnType<Firecrawl['parse']> {
    return this.firecrawl.parse(...args);
  }

  /**
   * Extract structured data from URLs using a schema or prompt.
   *
   * @see Firecrawl.extract
   */
  extract(
    ...args: Parameters<Firecrawl['extract']>
  ): ReturnType<Firecrawl['extract']> {
    return this.firecrawl.extract(...args);
  }

  /**
   * Get current concurrency usage for the team.
   *
   * @see Firecrawl.getConcurrency
   */
  getConcurrency(
    ...args: Parameters<Firecrawl['getConcurrency']>
  ): ReturnType<Firecrawl['getConcurrency']> {
    return this.firecrawl.getConcurrency(...args);
  }

  /**
   * Get current credit usage for the team.
   *
   * @see Firecrawl.getCreditUsage
   */
  getCreditUsage(
    ...args: Parameters<Firecrawl['getCreditUsage']>
  ): ReturnType<Firecrawl['getCreditUsage']> {
    return this.firecrawl.getCreditUsage(...args);
  }

  /**
   * Get recent token usage for the team.
   *
   * @see Firecrawl.getTokenUsage
   */
  getTokenUsage(
    ...args: Parameters<Firecrawl['getTokenUsage']>
  ): ReturnType<Firecrawl['getTokenUsage']> {
    return this.firecrawl.getTokenUsage(...args);
  }

  /**
   * Create a watcher that emits events for a crawl or batch scrape job.
   *
   * @see Firecrawl.watcher
   */
  watcher(
    ...args: Parameters<Firecrawl['watcher']>
  ): ReturnType<Firecrawl['watcher']> {
    return this.firecrawl.watcher(...args);
  }
}
