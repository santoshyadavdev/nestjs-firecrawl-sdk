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
});
