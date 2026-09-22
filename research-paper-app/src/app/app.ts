import { Component, signal } from '@angular/core';
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
  mode = signal('search');
  query = signal('');
  loading = signal(false);
  result = signal<any>(null);
  error = signal('');

  constructor(private readonly api: FirecrawlApiService) {}

  submit() {
    if (!this.query().trim()) return;

    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    let request$;
    switch (this.mode()) {
      case 'scrape':
        request$ = this.api.scrape(this.query());
        break;
      case 'crawl':
        request$ = this.api.crawl(this.query());
        break;
      case 'map':
        request$ = this.api.map(this.query());
        break;
      default:
        request$ = this.api.search(this.query());
    }

    request$.subscribe({
      next: (data) => {
        this.result.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? err.message ?? 'Request failed');
        this.loading.set(false);
      },
    });
  }
}
