import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ContinueWatchingItem } from '../../models/media.model';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-continue-watching-card',
  templateUrl: './continue-watching-card.component.html',
  imports: [CommonModule, NgOptimizedImage, RouterLink],
})
export class ContinueWatchingCardComponent {
  private readonly tmdbService = inject(TmdbService);
  item = input.required<ContinueWatchingItem>();

  playerLink = computed(() => {
    const media = this.item();
    if (media.type === 'tv') {
      return ['/player/tv', media.id, media.seasonNumber, media.episodeNumber];
    }
    return ['/player/movie', media.id];
  });

  getPosterUrl(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'w500');
  }
}