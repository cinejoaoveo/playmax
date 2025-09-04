import { Injectable, signal, effect, inject } from '@angular/core';
import { Media } from '../models/media.model';
import { FirebaseService } from './firebase.service';

type WatchlistItem = { id: number; type: 'movie' | 'tv' };

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly firebaseService = inject(FirebaseService);
  private baseStorageKey = 'playmax-watchlist';
  private currentStorageKey = signal<string>(`${this.baseStorageKey}-guest`);

  watchlist = signal<WatchlistItem[]>([]);

  constructor() {
    // React to user changes
    effect(() => {
      const user = this.firebaseService.currentUser();
      const newKey = user ? `${this.baseStorageKey}-${user.uid}` : `${this.baseStorageKey}-guest`;
      this.currentStorageKey.set(newKey);
      this.watchlist.set(this.loadFromStorage());
    });

    // Save to storage when watchlist changes
    effect(() => {
      this.saveToStorage(this.watchlist());
    });
  }

  private loadFromStorage(): WatchlistItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(this.currentStorageKey());
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private saveToStorage(items: WatchlistItem[]): void {
     if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.currentStorageKey(), JSON.stringify(items));
     }
  }

  addToWatchlist(item: Media): void {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    if (!this.isInWatchlist(item.id, type)) {
      this.watchlist.update(current => [...current, { id: item.id, type }]);
    }
  }

  removeFromWatchlist(id: number, type: 'movie' | 'tv'): void {
    this.watchlist.update(current => current.filter(item => !(item.id === id && item.type === type)));
  }

  toggleWatchlist(item: Media): void {
     const type = item.media_type || (item.title ? 'movie' : 'tv');
     if (this.isInWatchlist(item.id, type)) {
       this.removeFromWatchlist(item.id, type);
     } else {
       this.addToWatchlist(item);
     }
  }

  isInWatchlist(id: number, type: 'movie' | 'tv'): boolean {
    return this.watchlist().some(item => item.id === id && item.type === type);
  }
}