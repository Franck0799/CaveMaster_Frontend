// ==========================================
// FICHIER: src/app/services/theme.service.ts
// DESCRIPTION: Service pour gérer le thème clair/sombre
// ==========================================

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'caveviking-theme';
  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const savedTheme = this.getThemeFromStorage();
    this.themeSubject = new BehaviorSubject<Theme>(savedTheme);
    this.theme$ = this.themeSubject.asObservable();

    // ✅ N’applique le thème que si on est dans un navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme(savedTheme);
      this.listenToSystemThemeChanges();
    }
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  setTheme(theme: Theme): void {
    // ✅ Sauvegarde uniquement dans le navigateur
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.THEME_KEY, theme);
    }

    this.themeSubject.next(theme);
    this.applyTheme(theme);

    console.log('🎨 Thème changé:', theme);
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    const html = document.documentElement;

    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    html.classList.remove('theme-light', 'theme-dark', 'theme-auto');

    let effectiveTheme = theme;
    if (theme === 'auto') {
      effectiveTheme = this.getSystemTheme();
    }

    body.classList.add(`theme-${effectiveTheme}`);
    html.classList.add(`theme-${effectiveTheme}`);
    body.setAttribute('data-theme', effectiveTheme);
    html.setAttribute('data-theme', effectiveTheme);

    console.log('✅ Thème appliqué:', effectiveTheme);
  }

  private getThemeFromStorage(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.THEME_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        return saved;
      }
    }
    return 'dark'; // Valeur par défaut
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (
      isPlatformBrowser(this.platformId) &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }

  listenToSystemThemeChanges(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (this.getCurrentTheme() === 'auto') {
        this.applyTheme('auto');
        console.log('🔄 Thème système changé:', e.matches ? 'dark' : 'light');
      }
    });
  }

  resetTheme(): void {
    this.setTheme('dark');
  }
}
