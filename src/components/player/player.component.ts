import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Media } from '../../models/media.model';
import { TmdbService } from '../../services/tmdb.service';
import { MediaCardComponent } from '../media-card/media-card.component';
import { SearchComponent } from '../search/search.component';
import { ContinueWatchingService } from '../../services/continue-watching.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage, RouterLink, MediaCardComponent, SearchComponent, LoadingComponent],
})
export class PlayerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tmdbService = inject(TmdbService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly continueWatchingService = inject(ContinueWatchingService);

  playerUrl = signal<SafeResourceUrl | null>(null);
  mediaTitle = signal<string>('');
  recommendations = signal<Media[]>([]);
  isSearchOpen = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const seasonStr = params.get('season');
      const episodeStr = params.get('episode');

      if (id) {
        const mediaId = Number(id);
        let url = '';
        let mediaType: 'movie' | 'tv';
        
        const season = seasonStr ? Number(seasonStr) : undefined;
        const episode = episodeStr ? Number(episodeStr) : undefined;

        if (season && episode) {
          mediaType = 'tv';
          url = `https://superflixapi.shop/serie/${mediaId}/${season}/${episode}/`;
          this.tmdbService.getSeriesDetails(mediaId).subscribe(series => {
            this.mediaTitle.set(series.name || '');
            this.continueWatchingService.addItem(series, season, episode);
          });
        } else {
          mediaType = 'movie';
          url = `https://superflixapi.shop/filme/${mediaId}`;
          this.tmdbService.getMovieDetails(mediaId).subscribe(movie => {
            this.mediaTitle.set(movie.title || '');
            this.continueWatchingService.addItem(movie);
          });
        }

        this.playerUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        this.loadRecommendations(mediaType, mediaId);
      }
    });
  }

  loadRecommendations(type: 'movie' | 'tv', id: number): void {
    this.tmdbService.getRecommendations(type, id).subscribe(media => {
      this.recommendations.set(media.filter(m => m.poster_path).slice(0, 12));
    });
  }

  toggleSearch(): void {
    this.isSearchOpen.update(v => !v);
  }
}