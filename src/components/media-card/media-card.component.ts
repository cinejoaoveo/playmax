
import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Media } from '../../models/media.model';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
})
export class MediaCardComponent {
  private readonly tmdbService = inject(TmdbService);

  mediaItem = input.required<Media>();

  getPosterUrl(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'w500');
  }

  getMediaLink(item: Media): string {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    return `/${type}/${item.id}`;
  }
}
