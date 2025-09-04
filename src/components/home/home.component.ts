
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Media } from '../../models/media.model';
import { TmdbService } from '../../services/tmdb.service';
import { WatchlistService } from '../../services/watchlist.service';
import { MediaCardComponent } from '../media-card/media-card.component';
import { ContinueWatchingService } from '../../services/continue-watching.service';
import { ContinueWatchingCardComponent } from '../continue-watching-card/continue-watching-card.component';

interface MediaRow {
  title: string;
  items: Media[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage, RouterLink, MediaCardComponent, ContinueWatchingCardComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly tmdbService = inject(TmdbService);
  public readonly watchlistService = inject(WatchlistService);
  public readonly continueWatchingService = inject(ContinueWatchingService);

  heroItems = signal<Media[]>([]);
  currentHeroIndex = signal(0);
  mediaRows = signal<MediaRow[]>([]);
  
  private intervalId: any;

  currentHeroItem = computed(() => {
    const items = this.heroItems();
    if (items.length > 0) {
      return items[this.currentHeroIndex()];
    }
    return null;
  });

  ngOnInit(): void {
    this.tmdbService.getTrending('movie').subscribe(movies => {
      this.heroItems.set(movies.slice(0, 5));
      this.startHeroCarousel();
    });

    forkJoin({
        popularMovies: this.tmdbService.getPopular('movie'),
        topRatedMovies: this.tmdbService.getTopRated('movie'),
        popularSeries: this.tmdbService.getPopular('tv'),
        topRatedSeries: this.tmdbService.getTopRated('tv')
    }).subscribe(data => {
        this.mediaRows.set([
            { title: 'Filmes Populares', items: data.popularMovies },
            { title: 'Séries Populares', items: data.popularSeries },
            { title: 'Filmes Bem Avaliados', items: data.topRatedMovies },
            { title: 'Séries Bem Avaliadas', items: data.topRatedSeries }
        ]);
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startHeroCarousel(): void {
    this.intervalId = setInterval(() => {
      this.currentHeroIndex.update(i => (i + 1) % this.heroItems().length);
    }, 7000);
  }

  getBackdropUrl(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'original');
  }

  setHeroIndex(index: number): void {
    this.currentHeroIndex.set(index);
    // Reset interval
    clearInterval(this.intervalId);
    this.startHeroCarousel();
  }
  
  getRating(voteAverage: number): number {
      return Math.round(voteAverage / 2);
  }

  getMediaLink(item: Media): string {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    return `/${type}/${item.id}`;
  }

  getPlayerLink(item: Media): (string | number)[] {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    if (type === 'movie') {
      return ['/player/movie', item.id];
    } else {
      return ['/player/tv', item.id, 1, 1]; // Default to S01E01 for series hero
    }
  }
}