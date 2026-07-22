// ==========================================
// FICHIER: src/app/services/cart.service.ts
// Panier synchronisé avec le backend (/api/Cart), avec cache local
// localStorage pour un affichage instantané pendant le chargement.
// ==========================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponseData } from '../models/ApiResponseData';
import { DrinksService } from './catalogue/drinks.service';

export interface CartItem {
  id: string; // Correspond au drinkId réel côté backend.
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
  region?: string;
  year?: number;
}

interface ApiCartItem {
  id: string;
  userId: string;
  drinkId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'vinotheque_cart';
  private readonly baseUrl = `${environment.apiUrl}/api/Cart`;
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  // Observables publics
  public cartItems$ = this.cartItems.asObservable();
  public cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );
  public cartTotal$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
  );

  constructor(private http: HttpClient, private drinksService: DrinksService) {
    this.loadCart();
    this.refreshFromServer();
  }

  /** Recharge le panier depuis le backend et le fusionne avec les infos produit (nom/prix/image). */
  refreshFromServer(): void {
    this.http.get<ApiResponseData<ApiCartItem[]>>(this.baseUrl).subscribe({
      next: (res) => {
        const apiItems = res.data ?? [];
        if (apiItems.length === 0) {
          this.cartItems.next([]);
          this.saveCart();
          return;
        }
        this.drinksService.getAll().subscribe(drinks => {
          const drinkById = new Map(drinks.map(d => [d.id, d]));
          const items: CartItem[] = apiItems
            .filter(ci => drinkById.has(ci.drinkId))
            .map(ci => {
              const d = drinkById.get(ci.drinkId)!;
              return {
                id: ci.drinkId,
                name: d.name,
                price: d.sellingPrice,
                quantity: ci.quantity,
                image: d.image || d.icon || '🍷',
                maxStock: 999
              };
            });
          this.cartItems.next(items);
          this.saveCart();
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement du panier depuis le backend :', error);
      }
    });
  }

  private loadCart(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validation des données
        if (Array.isArray(parsed)) {
          this.cartItems.next(parsed);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      this.clearCart();
    }
  }

  private saveCart(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems.value));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
    }
  }

  addToCart(item: Omit<CartItem, 'quantity'>): boolean {
    const items = [...this.cartItems.value];
    const existingIndex = items.findIndex(i => i.id === item.id);
    const newQuantity = existingIndex !== -1 ? items[existingIndex].quantity + 1 : 1;

    if (existingIndex !== -1 && items[existingIndex].quantity >= item.maxStock) {
      console.warn('Stock maximum atteint pour cet article');
      return false;
    }

    // Mise à jour optimiste immédiate de l'UI, puis persistance côté backend.
    if (existingIndex !== -1) {
      items[existingIndex].quantity = newQuantity;
    } else {
      items.push({ ...item, quantity: 1 });
    }
    this.cartItems.next(items);
    this.saveCart();

    this.http.post<ApiResponseData<unknown>>(`${this.baseUrl}/items?drinkId=${item.id}&quantity=1`, {}).subscribe({
      error: (error) => console.error('Erreur lors de l\'ajout au panier (backend) :', error)
    });

    return true;
  }

  removeFromCart(id: string): void {
    const items = this.cartItems.value.filter(item => item.id !== id);
    this.cartItems.next(items);
    this.saveCart();

    this.http.delete<ApiResponseData<unknown>>(`${this.baseUrl}/items/${id}`).subscribe({
      error: (error) => console.error('Erreur lors de la suppression de l\'article (backend) :', error)
    });
  }

  updateQuantity(id: string, quantity: number): boolean {
    const items = [...this.cartItems.value];
    const itemIndex = items.findIndex(i => i.id === id);

    if (itemIndex !== -1) {
      const item = items[itemIndex];

      // Validation
      if (quantity <= 0) {
        this.removeFromCart(id);
        return true;
      }

      if (quantity > item.maxStock) {
        console.warn('Quantité demandée supérieure au stock disponible');
        return false;
      }

      items[itemIndex].quantity = quantity;
      this.cartItems.next(items);
      this.saveCart();

      this.http.put<ApiResponseData<unknown>>(`${this.baseUrl}/items/${id}?quantity=${quantity}`, {}).subscribe({
        error: (error) => console.error('Erreur lors de la mise à jour de la quantité (backend) :', error)
      });

      return true;
    }

    return false;
  }

  increaseQuantity(id: string): boolean {
    const item = this.cartItems.value.find(i => i.id === id);
    if (item) {
      return this.updateQuantity(id, item.quantity + 1);
    }
    return false;
  }

  decreaseQuantity(id: string): boolean {
    const item = this.cartItems.value.find(i => i.id === id);
    if (item) {
      return this.updateQuantity(id, item.quantity - 1);
    }
    return false;
  }

  isInCart(id: string): boolean {
    return this.cartItems.value.some(item => item.id === id);
  }

  getItemQuantity(id: string): number {
    const item = this.cartItems.value.find(i => i.id === id);
    return item ? item.quantity : 0;
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCart();

    this.http.delete<ApiResponseData<unknown>>(this.baseUrl).subscribe({
      error: (error) => console.error('Erreur lors du vidage du panier (backend) :', error)
    });
  }

  getTotal(): number {
    return this.cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  getItems(): CartItem[] {
    return [...this.cartItems.value];
  }
}
