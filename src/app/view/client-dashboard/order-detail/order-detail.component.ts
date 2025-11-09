// ==========================================
// FICHIER: src/app/view/client-dashboard/order-detail/order-detail.component.ts
// DESCRIPTION: Détail d'une commande
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  template: ``,
  styles: [` `]
})
export class OrderDetailComponent {
  order: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadOrder(id);
  }

  loadOrder(id: string | null): void {
    this.order = {
      id: id,
      status: 'EN PRÉPARATION',
      date: '2025-11-08',
      items: [
        { id: 1, name: 'Château Margaux 2015', quantity: 2, price: 450, image: '🍷' },
        { id: 2, name: 'Dom Pérignon', quantity: 1, price: 180, image: '🥂' }
      ],
      subtotal: 1080,
      shipping: 0,
      total: 1080,
      address: '45 Avenue des Champs, Lekki Phase 1, Lagos, Nigeria'
    };
  }

  goBack(): void {
    this.router.navigate(['/client/orders']);
  }
}
