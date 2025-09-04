import { Component, ChangeDetectionStrategy, inject, signal, OnInit, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Movie, Credits, CastMember } from '../../models/media.model';
import { TmdbService } from '../../services/tmdb.service';
import { WatchlistService } from '../../services/watchlist.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage, RouterLink, LoadingComponent],
})
export class MovieDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tmdbService = inject(TmdbService);
  public readonly watchlistService = inject(WatchlistService);
  
  movie = signal<Movie | null>(null);
  credits = signal<Credits | null>(null);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const movieId = Number(id);
      forkJoin({
        movie: this.tmdbService.getMovieDetails(movieId),
        credits: this.tmdbService.getCredits('movie', movieId)
      }).subscribe(data => {
        this.movie.set(data.movie);
        this.credits.set(data.credits);
      });
    }
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
  
  getRating(voteAverage: number): number {
    return Math.round(voteAverage / 2);
  }
  
  formatRuntime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  toggleWatchlist(): void {
    const currentMovie = this.movie();
    if (currentMovie) {
      this.watchlistService.toggleWatchlist({ ...currentMovie, media_type: 'movie' });
    }
  }
}