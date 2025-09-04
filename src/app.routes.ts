import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Início'
  },
  {
    path: 'movies',
    loadComponent: () => import('./components/media-list/media-list.component').then(m => m.MediaListComponent),
    data: { type: 'movie' },
    title: 'Filmes'
  },
  {
    path: 'series',
    loadComponent: () => import('./components/media-list/media-list.component').then(m => m.MediaListComponent),
    data: { type: 'tv' },
    title: 'Séries'
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./components/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
  },
  {
    path: 'tv/:id',
    loadComponent: () => import('./components/series-detail/series-detail.component').then(m => m.SeriesDetailComponent)
  },
  {
    path: 'watchlist',
    loadComponent: () => import('./components/watchlist/watchlist.component').then(m => m.WatchlistComponent),
    title: 'Minha Lista'
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent),
    title: 'Minha Conta'
  },
  {
    path: 'player/movie/:id',
    loadComponent: () => import('./components/player/player.component').then(m => m.PlayerComponent),
    title: 'Player'
  },
  {
    path: 'player/tv/:id/:season/:episode',
    loadComponent: () => import('./components/player/player.component').then(m => m.PlayerComponent),
    title: 'Player'
  },
  { path: '**', redirectTo: 'home' }
];
