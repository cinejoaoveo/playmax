

export interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

export interface ContinueWatchingItem {
  id: number;
  type: 'movie' | 'tv';
  poster_path: string;
  title?: string;
  name?: string;
  timestamp: number;
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface Movie extends Media {
  runtime: number;
}

export interface Series extends Media {
  number_of_seasons: number;
  seasons: Season[];
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  vote_average: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface Credits {
  cast: CastMember[];
}

export interface Genre {
  id: number;
  name: string;
}

// FIX: Add missing AuthCredential interface
export interface AuthCredential {
  email: string;
  password: string;
}