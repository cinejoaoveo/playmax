import { Injectable, signal, effect, inject } from '@angular/core';
import { Media, ContinueWatchingItem } from '../models/media.model';
import { FirebaseService } from './firebase.service';

const MAX_ITEMS = 20;

@Injectable({ providedIn: 'root' })
export class ContinueWatchingService {
  private readonly firebaseService = inject(FirebaseService);
  private baseStorageKey = 'playmax-continue-watching';
  private currentStorageKey = signal<string>(`${this.baseStorageKey}-guest`);

  continueWatchingItems = signal<ContinueWatchingItem[]>([]);

  constructor() {
    effect(() => {
      const user = this.firebaseService.currentUser();
      const newKey = user ? `${this.baseStorageKey}-${user.uid}` : `${this.baseStorageKey}-guest`;
      this.currentStorageKey.set(newKey);
      this.continueWatchingItems.set(this.loadFromStorage());
    });

    effect(() => {
      this.saveToStorage(this.continueWatchingItems());
    });
  }

  private loadFromStorage(): ContinueWatchingItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(this.currentStorageKey());
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private saveToStorage(items: ContinueWatchingItem[]): void {
     if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.currentStorageKey(), JSON.stringify(items));
     }
  }

  addItem(media: Media, seasonNumber?: number, episodeNumber?: number): void {
    const type = media.media_type || (media.title ? 'movie' : 'tv');
    
    const newItem: ContinueWatchingItem = {
      id: media.id,
      type: type,
      poster_path: media.poster_path,
      title: media.title,
      name: media.name,
      timestamp: Date.now(),
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber,
    };
    
    this.continueWatchingItems.update(current => {
        // Remove existing item if it's the same movie/series
        const filtered = current.filter(item => item.id !== newItem.id || item.type !== newItem.type);
        // Add new item to the beginning and slice to max length
        const updatedList = [newItem, ...filtered].slice(0, MAX_ITEMS);
        return updatedList;
    });
  }
}