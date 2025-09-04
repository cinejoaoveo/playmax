import { Component, ChangeDetectionStrategy, inject, signal, effect, output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Media } from '../../models/media.model';
import { TmdbService } from '../../services/tmdb.service';
import { MediaCardComponent } from '../media-card/media-card.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MediaCardComponent],
})
export class SearchComponent implements OnDestroy {
  private readonly tmdbService = inject(TmdbService);
  
  close = output<void>();
  
  searchTerm = signal('');
  searchResults = signal<Media[]>([]);
  isLoading = signal(false);

  private searchTimeout: any;

  constructor() {
    effect(() => {
      const term = this.searchTerm().trim();
      clearTimeout(this.searchTimeout);

      if (term.length > 2) {
        this.isLoading.set(true);
        this.searchTimeout = setTimeout(() => {
          this.performSearch(term);
        }, 300); // 300ms debounce
      } else {
        this.searchResults.set([]);
        this.isLoading.set(false);
      }
    });
  }

  performSearch(term: string): void {
    this.tmdbService.searchMedia(term).subscribe(results => {
      this.searchResults.set(results);
      this.isLoading.set(false);
    });
  }

  onSearchTermChange(term: string): void {
    this.searchTerm.set(term);
  }

  closeSearch(): void {
    this.close.emit();
  }
  
  ngOnDestroy(): void {
    clearTimeout(this.searchTimeout);
  }
}