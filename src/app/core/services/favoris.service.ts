// ==========================================
// FICHIER: src/app/services/favorites.service.ts
// VERSION COMPLÈTE ET AMÉLIORÉE
// ==========================================
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FavoriteItem {
  id: number;
  type: 'wine' | 'cave';
  name: string;
  image: string;
  price?: number;
  region?: string;
  year?: number;
  rating?: number;
  cave?: string;
  location?: string;
  specialty?: string;
  addedAt?: Date;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class FavorisService {
  private readonly STORAGE_KEY = 'vinotheque_favorites';
  private favorites = new BehaviorSubject<FavoriteItem[]>([]);

  // Observables publics
  public favorites$ = this.favorites.asObservable();
  public favoritesCount$ = this.favorites$.pipe(
    map(items => items.length)
  );
  public winesFavorites$ = this.favorites$.pipe(
    map(items => items.filter(item => item.type === 'wine'))
  );
  public cavesFavorites$ = this.favorites$.pipe(
    map(items => items.filter(item => item.type === 'cave'))
  );

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Reconvertir les dates
          const items = parsed.map(item => ({
            ...item,
            addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
          }));
          this.favorites.next(items);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      this.clearFavorites();
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites.value));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }

  addToFavorites(item: FavoriteItem): boolean {
    const items = [...this.favorites.value];
    const exists = items.find(i => i.id === item.id && i.type === item.type);

    if (!exists) {
      items.push({
        ...item,
        addedAt: new Date()
      });
      this.favorites.next(items);
      this.saveFavorites();
      return true;
    }

    return false;
  }

  removeFromFavorites(id: number, type: 'wine' | 'cave'): boolean {
    const items = this.favorites.value.filter(item => !(item.id === id && item.type === type));

    if (items.length !== this.favorites.value.length) {
      this.favorites.next(items);
      this.saveFavorites();
      return true;
    }

    return false;
  }

  toggleFavorite(item: FavoriteItem): boolean {
    const exists = this.isFavorite(item.id, item.type);

    if (exists) {
      this.removeFromFavorites(item.id, item.type);
      return false;
    } else {
      this.addToFavorites(item);
      return true;
    }
  }

  isFavorite(id: number, type: 'wine' | 'cave'): boolean {
    return this.favorites.value.some(item => item.id === id && item.type === type);
  }

  getFavoritesByType(type: 'wine' | 'cave'): FavoriteItem[] {
    return this.favorites.value.filter(item => item.type === type);
  }

  getFavoriteById(id: number, type: 'wine' | 'cave'): FavoriteItem | undefined {
    return this.favorites.value.find(item => item.id === id && item.type === type);
  }

  clearFavorites(): void {
    this.favorites.next([]);
    this.saveFavorites();
  }

  clearFavoritesByType(type: 'wine' | 'cave'): void {
    const items = this.favorites.value.filter(item => item.type !== type);
    this.favorites.next(items);
    this.saveFavorites();
  }

  getFavoritesCount(): number {
    return this.favorites.value.length;
  }

  getRecentFavorites(limit: number = 5): FavoriteItem[] {
    return [...this.favorites.value]
      .sort((a, b) => {
        const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
        const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }
}
