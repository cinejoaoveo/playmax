import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { SeriesDetailComponent } from './components/series-detail/series-detail.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { MediaListComponent } from './components/media-list/media-list.component';
import { AuthComponent } from './components/auth/auth.component';
import { PlayerComponent } from './components/player/player.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Início' },
  { path: 'movies', component: MediaListComponent, data: { type: 'movie' }, title: 'Filmes' },
  { path: 'series', component: MediaListComponent, data: { type: 'tv' }, title: 'Séries' },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'tv/:id', component: SeriesDetailComponent },
  { path: 'watchlist', component: WatchlistComponent, title: 'Minha Lista' },
  { path: 'auth', component: AuthComponent, title: 'Minha Conta' },
  { path: 'player/movie/:id', component: PlayerComponent, title: 'Player' },
  { path: 'player/tv/:id/:season/:episode', component: PlayerComponent, title: 'Player' },
  { path: '**', redirectTo: 'home' }
];
