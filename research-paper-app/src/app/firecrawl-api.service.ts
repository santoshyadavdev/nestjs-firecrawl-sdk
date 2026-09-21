import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FirecrawlApiService {
  constructor(private readonly http: HttpClient) {}

  scrape(url: string) {
    return this.http.get<any>('/api/scrape', { params: { url } });
  }

  crawl(url: string) {
    return this.http.get<any>('/api/crawl', { params: { url } });
  }

  map(url: string) {
    return this.http.get<any>('/api/map', { params: { url } });
  }

  search(query: string) {
    return this.http.get<any>('/api/search', { params: { q: query } });
  }
}
