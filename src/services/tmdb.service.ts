
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Credits, Episode, Genre, Media, Movie, Series } from '../models/media.model';

interface TmdbResponse<T> {
  results: T;
  genres?: Genre[];
  episodes?: Episode[];
}

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = '06c4ad81ee9f810d3547bf95fd227bd4';
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    const queryParams = new URLSearchParams({
      api_key: this.apiKey,
      language: 'pt-BR',
      ...params,
    });
    return `${this.baseUrl}/${endpoint}?${queryParams.toString()}`;
  }

  getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
    if (!path) {
      return 'https://via.placeholder.com/500x750.png?text=No+Image';
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getTrending(mediaType: 'movie' | 'tv', period: 'day' | 'week' = 'week'): Observable<Media[]> {
    const url = this.buildUrl(`trending/${mediaType}/${period}`);
    return this.http.get<TmdbResponse<Media[]>>(url).pipe(map(res => res.results));
  }
  
  getPopular(mediaType: 'movie' | 'tv'): Observable<Media[]> {
    const url = this.buildUrl(`${mediaType}/popular`);
    return this.http.get<TmdbResponse<Media[]>>(url).pipe(map(res => res.results));
  }
  
  getTopRated(mediaType: 'movie' | 'tv'): Observable<Media[]> {
    const url = this.buildUrl(`${mediaType}/top_rated`);
    return this.http.get<TmdbResponse<Media[]>>(url).pipe(map(res => res.results));
  }

  getGenres(mediaType: 'movie' | 'tv'): Observable<Genre[]> {
    const url = this.buildUrl(`genre/${mediaType}/list`);
    return this.http.get<TmdbResponse<Genre[]>>(url).pipe(map(res => res.genres || []));
  }

  getMediaByGenre(mediaType: 'movie' | 'tv', genreId: number): Observable<Media[]> {
    const url = this.buildUrl(`discover/${mediaType}`, { with_genres: genreId.toString() });
    return this.http.get<TmdbResponse<Media[]>>(url).pipe(map(res => res.results));
  }

  getMovieDetails(id: number): Observable<Movie> {
    return this.http.get<Movie>(this.buildUrl(`movie/${id}`));
  }

  getSeriesDetails(id: number): Observable<Series> {
    return this.http.get<Series>(this.buildUrl(`tv/${id}`));
  }
  
  getCredits(mediaType: 'movie' | 'tv', id: number): Observable<Credits> {
    return this.http.get<Credits>(this.buildUrl(`${mediaType}/${id}/credits`));
  }
  
  getRecommendations(mediaType: 'movie' | 'tv', id: number): Observable<Media[]> {
    const url = this.buildUrl(`${mediaType}/${id}/recommendations`);
    return this.http.get<TmdbResponse<Media[]>>(url).pipe(map(res => res.results));
  }

  getSeasonDetails(tvId: number, seasonNumber: number): Observable<Episode[]> {
    const url = this.buildUrl(`tv/${tvId}/season/${seasonNumber}`);
    return this.http.get<TmdbResponse<Episode[]>>(url).pipe(map(res => res.episodes || []));
  }

  searchMedia(query: string): Observable<Media[]> {
    const url = this.buildUrl('search/multi', { query });
    return this.http.get<TmdbResponse<Media[]>>(url).pipe(
      map(res => res.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv'))
    );
  }
}
