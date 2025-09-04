import { Component, ChangeDetectionStrategy, ElementRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, SearchComponent],
})
export class HeaderComponent implements OnInit, OnDestroy {
  navLinks = [
    { path: '/home', label: 'Início', icon: 'home' },
    { path: '/movies', label: 'Filmes', icon: 'movie' },
    { path: '/series', label: 'Séries', icon: 'tv' },
  ];
  
  isSearchOpen = signal(false);
  isUserMenuOpen = signal(false);

  public readonly firebaseService = inject(FirebaseService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly elementRef = inject(ElementRef);
  private scrollListener!: () => void;

  ngOnInit(): void {
    this.scrollListener = () => {
      const header = this.elementRef.nativeElement.querySelector('header');
      if (header) {
        if (window.scrollY > 10) {
          header.classList.add('bg-black', 'shadow-lg');
        } else {
          header.classList.remove('bg-black', 'shadow-lg');
        }
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.scrollListener);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListener && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
  
  toggleSearch(): void {
    this.isSearchOpen.update(v => !v);
  }

  getIcon(name: string, classes = 'h-5 w-5'): SafeHtml {
    const icons: { [key: string]: string } = {
      home: `<svg xmlns="http://www.w3.org/2000/svg" class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`,
      movie: `<svg xmlns="http://www.w3.org/2000/svg" class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>`,
      tv: `<svg xmlns="http://www.w3.org/2000/svg" class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
      search: `<svg xmlns="http://www.w3.org/2000/svg" class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>`,
      account: `<svg xmlns="http://www.w3.org/2000/svg" class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
    };
    return this.sanitizer.bypassSecurityTrustHtml(icons[name] || '');
  }

  signOut(): void {
    this.firebaseService.signOut();
    this.isUserMenuOpen.set(false);
  }
}