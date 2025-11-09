// ==========================================
// FICHIER: src/app/services/cart.service.ts
// VERSION COMPLÈTE ET AMÉLIORÉE
// ==========================================

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
  region?: string;
  year?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'vinotheque_cart';
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  // Observables publics
  public cartItems$ = this.cartItems.asObservable();
  public cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );
  public cartTotal$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
  );

  constructor() {
    this.loadCart();
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

    if (existingIndex !== -1) {
      // Vérifier le stock avant d'ajouter
      if (items[existingIndex].quantity < item.maxStock) {
        items[existingIndex].quantity++;
        this.cartItems.next(items);
        this.saveCart();
        return true;
      } else {
        console.warn('Stock maximum atteint pour cet article');
        return false;
      }
    } else {
      items.push({ ...item, quantity: 1 });
      this.cartItems.next(items);
      this.saveCart();
      return true;
    }
  }

  removeFromCart(id: number): void {
    const items = this.cartItems.value.filter(item => item.id !== id);
    this.cartItems.next(items);
    this.saveCart();
  }

  updateQuantity(id: number, quantity: number): boolean {
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
      return true;
    }

    return false;
  }

  increaseQuantity(id: number): boolean {
    const item = this.cartItems.value.find(i => i.id === id);
    if (item) {
      return this.updateQuantity(id, item.quantity + 1);
    }
    return false;
  }

  decreaseQuantity(id: number): boolean {
    const item = this.cartItems.value.find(i => i.id === id);
    if (item) {
      return this.updateQuantity(id, item.quantity - 1);
    }
    return false;
  }

  isInCart(id: number): boolean {
    return this.cartItems.value.some(item => item.id === id);
  }

  getItemQuantity(id: number): number {
    const item = this.cartItems.value.find(i => i.id === id);
    return item ? item.quantity : 0;
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCart();
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
