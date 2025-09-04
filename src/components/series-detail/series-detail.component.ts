import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Series, Credits, Episode } from '../../models/media.model';
import { TmdbService } from '../../services/tmdb.service';
import { WatchlistService } from '../../services/watchlist.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage, RouterLink, LoadingComponent],
})
export class SeriesDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tmdbService = inject(TmdbService);
  public readonly watchlistService = inject(WatchlistService);
  
  series = signal<Series | null>(null);
  credits = signal<Credits | null>(null);
  episodes = signal<Episode[]>([]);
  selectedSeason = signal<number>(1);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const seriesId = Number(id);
      forkJoin({
        series: this.tmdbService.getSeriesDetails(seriesId),
        credits: this.tmdbService.getCredits('tv', seriesId)
      }).subscribe(data => {
        this.series.set(data.series);
        this.credits.set(data.credits);
        if (data.series.seasons.length > 0) {
          this.loadSeason(data.series.id, this.selectedSeason());
        }
      });
    }
  }

  loadSeason(seriesId: number, seasonNumber: number): void {
    this.selectedSeason.set(seasonNumber);
    this.tmdbService.getSeasonDetails(seriesId, seasonNumber).subscribe(episodes => {
      this.episodes.set(episodes);
    });
  }

  getBackdropUrl(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'original');
  }

  getPosterUrl(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'w500');
  }
  
  getProfileUrl(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'w500');
  }
  
  getStillUrl(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'w500');
  }

  getRating(voteAverage: number): number {
    return Math.round(voteAverage / 2);
  }

  toggleWatchlist(): void {
    const currentSeries = this.series();
    if (currentSeries) {
      this.watchlistService.toggleWatchlist({ ...currentSeries, media_type: 'tv' });
    }
  }
}