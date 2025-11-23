import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;
  cartCount$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.cartTotal$;
    this.cartCount$ = this.cartService.cartCount$;
  }

  increaseQuantity(item: CartItem): void {
    if (this.cartService.increaseQuantity(item.id)) {
      this.notificationService.success('Quantité augmentée');
    } else {
      this.notificationService.warning('Stock maximum atteint');
    }
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.decreaseQuantity(item.id);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
    this.notificationService.info(`${item.name} retiré du panier`);
  }

  clearCart(): void {
    if (confirm('Voulez-vous vraiment vider le panier ?')) {
      this.cartService.clearCart();
      this.notificationService.success('Panier vidé');
    }
  }

  proceedToCheckout(): void {
    this.notificationService.info('Redirection vers le paiement...');
    // TODO: Implémenter la page de checkout
  }

  continueShopping(): void {
    this.router.navigate(['/client/catalogue']);
  }
}
