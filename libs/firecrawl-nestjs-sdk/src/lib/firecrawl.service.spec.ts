import { describe, expect, it, vi } from 'vitest';
import type { Firecrawl } from '@mendable/firecrawl-js';
import { FirecrawlService } from './firecrawl.service.js';

function createMockClient() {
  return {
    scrape: vi.fn().mockResolvedValue({ markdown: 'ok' }),
    crawl: vi.fn().mockResolvedValue({ status: 'completed' }),
    startCrawl: vi.fn().mockResolvedValue({ id: 'job-1' }),
    getCrawlStatus: vi.fn().mockResolvedValue({ status: 'scraping' }),
    map: vi.fn().mockResolvedValue({ links: [] }),
    search: vi.fn().mockResolvedValue({ web: [] }),
    batchScrape: vi.fn().mockResolvedValue({ status: 'completed' }),
    startBatchScrape: vi.fn().mockResolvedValue({ id: 'batch-1' }),
    cancelCrawl: vi.fn().mockResolvedValue(true),
    getCrawlErrors: vi.fn().mockResolvedValue({ errors: [] }),
    getActiveCrawls: vi.fn().mockResolvedValue({ crawls: [] }),
    getBatchScrapeStatus: vi.fn().mockResolvedValue({ status: 'scraping' }),
    cancelBatchScrape: vi.fn().mockResolvedValue(true),
    parse: vi.fn().mockResolvedValue({ markdown: 'parsed' }),
    extract: vi.fn().mockResolvedValue({ data: {} }),
    getConcurrency: vi.fn().mockResolvedValue({ concurrency: 1 }),
    getCreditUsage: vi.fn().mockResolvedValue({ remainingCredits: 10 }),
    getTokenUsage: vi.fn().mockResolvedValue({ remainingTokens: 100 }),
    watcher: vi.fn().mockReturnValue({ on: vi.fn() }),
  };
}

describe('FirecrawlService', () => {
  it('exposes the underlying client', () => {
    const client = createMockClient();
    const service = new FirecrawlService(client as unknown as Firecrawl);
    expect(service.client).toBe(client);
  });

  it('delegates scrape to the client', async () => {
    const client = createMockClient();
    const service = new FirecrawlService(client as unknown as Firecrawl);

    const result = await service.scrape('https://example.com', {
      formats: ['markdown'],
    });

    expect(client.scrape).toHaveBeenCalledWith('https://example.com', {
      formats: ['markdown'],
    });
    expect(result).toEqual({ markdown: 'ok' });
  });

  it('delegates crawl/map/search/batch methods', async () => {
    const client = createMockClient();
    const service = new FirecrawlService(client as unknown as Firecrawl);

    await service.crawl('https://example.com');
    await service.startCrawl('https://example.com');
    await service.getCrawlStatus('job-1');
    await service.map('https://example.com');
    await service.search('query');
    await service.batchScrape(['https://example.com']);
    await service.startBatchScrape(['https://example.com']);

    expect(client.crawl).toHaveBeenCalledWith('https://example.com');
    expect(client.startCrawl).toHaveBeenCalledWith('https://example.com');
    expect(client.getCrawlStatus).toHaveBeenCalledWith('job-1');
    expect(client.map).toHaveBeenCalledWith('https://example.com');
    expect(client.search).toHaveBeenCalledWith('query');
    expect(client.batchScrape).toHaveBeenCalledWith(['https://example.com']);
    expect(client.startBatchScrape).toHaveBeenCalledWith([
      'https://example.com',
    ]);
  });

  it('delegates crawl/batch lifecycle and usage helpers', async () => {
    const client = createMockClient();
    const service = new FirecrawlService(client as unknown as Firecrawl);

    await service.cancelCrawl('job-1');
    await service.getCrawlErrors('job-1');
    await service.getActiveCrawls();
    await service.getBatchScrapeStatus('batch-1');
    await service.cancelBatchScrape('batch-1');
    await service.getConcurrency();
    await service.getCreditUsage();
    await service.getTokenUsage();
    service.watcher('job-1');

    expect(client.cancelCrawl).toHaveBeenCalledWith('job-1');
    expect(client.getCrawlErrors).toHaveBeenCalledWith('job-1');
    expect(client.getActiveCrawls).toHaveBeenCalled();
    expect(client.getBatchScrapeStatus).toHaveBeenCalledWith('batch-1');
    expect(client.cancelBatchScrape).toHaveBeenCalledWith('batch-1');
    expect(client.getConcurrency).toHaveBeenCalled();
    expect(client.getCreditUsage).toHaveBeenCalled();
    expect(client.getTokenUsage).toHaveBeenCalled();
    expect(client.watcher).toHaveBeenCalledWith('job-1');
  });

  it('delegates parse and extract', async () => {
    const client = createMockClient();
    const service = new FirecrawlService(client as unknown as Firecrawl);

    await service.parse({ data: 'base64', filename: 'doc.pdf' } as never);
    await service.extract({ urls: ['https://example.com'], prompt: 'x' });

    expect(client.parse).toHaveBeenCalled();
    expect(client.extract).toHaveBeenCalledWith({
      urls: ['https://example.com'],
      prompt: 'x',
    });
  });
});
