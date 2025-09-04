
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Media } from '../../models/media.model';
import { WatchlistService } from '../../services/watchlist.service';
import { TmdbService } from '../../services/tmdb.service';
import { MediaCardComponent } from '../media-card/media-card.component';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MediaCardComponent],
})
export class WatchlistComponent implements OnInit {
  private readonly watchlistService = inject(WatchlistService);
  private readonly tmdbService = inject(TmdbService);

  watchlistItems = signal<Media[]>([]);

  ngOnInit(): void {
    const watchlist = this.watchlistService.watchlist();
    if (watchlist.length === 0) {
      this.watchlistItems.set([]);
      return;
    }

    const itemObservables = watchlist.map(item => {
      if (item.type === 'movie') {
        return this.tmdbService.getMovieDetails(item.id).pipe(map(m => ({...m, media_type: 'movie' as const})));
      } else {
        return this.tmdbService.getSeriesDetails(item.id).pipe(map(s => ({...s, media_type: 'tv' as const})));
      }
    });

    forkJoin(itemObservables).subscribe(items => {
      this.watchlistItems.set(items);
    });
  }
}
