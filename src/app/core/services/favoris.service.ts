// ==========================================
// FICHIER: src/app/services/favorites.service.ts
// Favoris "vin" synchronisés avec le backend (/api/Favorites). Le backend ne
// modélise pas de favoris "cave" (voir CaveMaster1_Backend.Domain.Entities.
// Clients.Favorite : uniquement un drinkId) : ce type reste donc local pour
// le moment.
// ==========================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponseData } from '../models/ApiResponseData';
import { DrinksService } from './catalogue/drinks.service';

export interface FavoriteItem {
  id: string; // Correspond au drinkId réel côté backend pour type === 'wine'.
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

interface ApiFavorite {
  id: string;
  userId: string;
  drinkId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavorisService {
  private readonly STORAGE_KEY = 'vinotheque_favorites';
  private readonly baseUrl = `${environment.apiUrl}/api/Favorites`;
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

  constructor(private http: HttpClient, private drinksService: DrinksService) {
    this.loadFavorites();
    this.refreshWineFavoritesFromServer();
  }

  /** Recharge les favoris "vin" depuis le backend et conserve les favoris "cave" locaux tels quels. */
  refreshWineFavoritesFromServer(): void {
    this.http.get<ApiResponseData<ApiFavorite[]>>(this.baseUrl).subscribe({
      next: (res) => {
        const apiFavorites = res.data ?? [];
        const caveFavorites = this.favorites.value.filter(f => f.type === 'cave');

        if (apiFavorites.length === 0) {
          this.favorites.next(caveFavorites);
          this.saveFavorites();
          return;
        }

        this.drinksService.getAll().subscribe(drinks => {
          const drinkById = new Map(drinks.map(d => [d.id, d]));
          const wineFavorites: FavoriteItem[] = apiFavorites
            .filter(f => drinkById.has(f.drinkId))
            .map(f => {
              const d = drinkById.get(f.drinkId)!;
              return {
                id: f.drinkId,
                type: 'wine' as const,
                name: d.name,
                image: d.image || d.icon || '🍷',
                price: d.sellingPrice,
                region: d.region,
                rating: d.rating,
                addedAt: new Date()
              };
            });
          this.favorites.next([...wineFavorites, ...caveFavorites]);
          this.saveFavorites();
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des favoris depuis le backend :', error);
      }
    });
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

      if (item.type === 'wine') {
        this.http.post<ApiResponseData<unknown>>(`${this.baseUrl}/${item.id}`, {}).subscribe({
          error: (error) => console.error('Erreur lors de l\'ajout aux favoris (backend) :', error)
        });
      }

      return true;
    }

    return false;
  }

  removeFromFavorites(id: string, type: 'wine' | 'cave'): boolean {
    const items = this.favorites.value.filter(item => !(item.id === id && item.type === type));

    if (items.length !== this.favorites.value.length) {
      this.favorites.next(items);
      this.saveFavorites();

      if (type === 'wine') {
        this.http.delete<ApiResponseData<unknown>>(`${this.baseUrl}/${id}`).subscribe({
          error: (error) => console.error('Erreur lors de la suppression des favoris (backend) :', error)
        });
      }

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

  isFavorite(id: string, type: 'wine' | 'cave'): boolean {
    return this.favorites.value.some(item => item.id === id && item.type === type);
  }

  getFavoritesByType(type: 'wine' | 'cave'): FavoriteItem[] {
    return this.favorites.value.filter(item => item.type === type);
  }

  getFavoriteById(id: string, type: 'wine' | 'cave'): FavoriteItem | undefined {
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
