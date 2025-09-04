
import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Media, Genre } from '../../models/media.model';
import { TmdbService } from '../../services/tmdb.service';
import { MediaCardComponent } from '../media-card/media-card.component';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MediaCardComponent],
})
export class MediaListComponent implements OnInit {
  private readonly tmdbService = inject(TmdbService);
  private readonly route = inject(ActivatedRoute);

  mediaType = signal<'movie' | 'tv'>('movie');

  popular = signal<Media[]>([]);
  topRated = signal<Media[]>([]);
  genres = signal<Genre[]>([]);
  selectedGenre = signal<Genre | null>(null);
  genreItems = signal<Media[]>([]);
  pageTitle = signal('');

  ngOnInit(): void {
    const typeFromRoute = this.route.snapshot.data['type'] as 'movie' | 'tv';
    if (typeFromRoute) {
      this.mediaType.set(typeFromRoute);
    }
    this.pageTitle.set(this.mediaType() === 'movie' ? 'Filmes' : 'Séries');
    
    this.loadData();
  }
  
  loadData(): void {
    const mediaType = this.mediaType();
    forkJoin({
      popular: this.tmdbService.getPopular(mediaType),
      topRated: this.tmdbService.getTopRated(mediaType),
      genres: this.tmdbService.getGenres(mediaType)
    }).subscribe(data => {
      this.popular.set(data.popular);
      this.topRated.set(data.topRated);
      this.genres.set(data.genres.slice(0, 10)); // Limit to 10 genres
    });
  }

  selectGenre(genre: Genre | null): void {
    this.selectedGenre.set(genre);
    if (genre) {
      this.tmdbService.getMediaByGenre(this.mediaType(), genre.id).subscribe(items => {
        this.genreItems.set(items);
      });
    }
  }
}