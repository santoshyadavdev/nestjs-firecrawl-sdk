import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirecrawlApiService } from './firecrawl-api.service';

@Component({
  imports: [FormsModule, JsonPipe, SlicePipe, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  mode = 'search';
  query = '';
  loading = false;
  result: any = null;
  error = '';

  constructor(private readonly api: FirecrawlApiService) {}

  submit() {
    if (!this.query.trim()) return;

    this.loading = true;
    this.error = '';
    this.result = null;

    let request$;
    switch (this.mode) {
      case 'scrape':
        request$ = this.api.scrape(this.query);
        break;
      case 'crawl':
        request$ = this.api.crawl(this.query);
        break;
      case 'map':
        request$ = this.api.map(this.query);
        break;
      default:
        request$ = this.api.search(this.query);
    }

    request$.subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message ?? err.message ?? 'Request failed';
        this.loading = false;
      },
    });
  }
}
