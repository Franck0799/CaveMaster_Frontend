// ==========================================
// FICHIER: src/app/client/orders/orders.component.ts
// DESCRIPTION: Page des commandes - CONVERTI EN STANDALONE
// ==========================================

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Interface pour une commande
interface Order {
  id: string;
  name: string;
  bottles: number;
  date: string;
  status: 'LIVRÉ' | 'EN PRÉPARATION' | 'EN ATTENTE' | 'ANNULÉ';
  price: string;
  icon: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,                                    // ✅ Composant standalone
  imports: [                                           // ✅ Imports nécessaires
    CommonModule,                                      // Pour *ngIf, *ngFor, pipes
    FormsModule,                                       // Pour [(ngModel)]
    ReactiveFormsModule,                               // Pour formulaires réactifs
    RouterModule                                       // Pour routerLink et navigation
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  // Liste des commandes
  orders: Order[] = [
    {
      id: '12456',
      name: 'Moët & Chandon Impérial',
      bottles: 2,
      date: '15 Sept 2025',
      status: 'LIVRÉ',
      price: '30,000 FCFA',
      icon: '🥂'
    },
    {
      id: '12457',
      name: 'Château Margaux 2015',
      bottles: 1,
      date: 'Aujourd\'hui',
      status: 'EN PRÉPARATION',
      price: '25,000 FCFA',
      icon: '🍷'
    },
    {
      id: '12455',
      name: 'Pack Heineken x12',
      bottles: 3,
      date: '12 Sept 2025',
      status: 'LIVRÉ',
      price: '18,000 FCFA',
      icon: '🍺'
    },
    {
      id: '12450',
      name: 'Hennessy VSOP',
      bottles: 1,
      date: '8 Sept 2025',
      status: 'EN ATTENTE',
      price: '35,000 FCFA',
      icon: '🥃'
    },
    {
      id: '12448',
      name: 'Dom Pérignon Vintage',
      bottles: 1,
      date: '5 Sept 2025',
      status: 'ANNULÉ',
      price: '45,000 FCFA',
      icon: '🍾'
    }
  ];

  // Injection du Router pour la navigation
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialisation du composant
    console.log('Orders component initialized');
  }

  // Obtenir la classe CSS selon le statut
  getStatusClass(status: string): string {
    switch (status) {
      case 'LIVRÉ':
        return 'status-delivered';
      case 'EN PRÉPARATION':
        return 'status-preparing';
      case 'EN ATTENTE':
        return 'status-waiting';
      case 'ANNULÉ':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Voir les détails d'une commande
  viewOrderDetails(order: Order): void {
    console.log('Voir détails commande:', order);
    // Navigation vers les détails de la commande
    this.router.navigate(['/client/order-detail', order.id]);
  }

  // Racheter une commande
  reorder(order: Order, event: Event): void {
    // Empêcher la propagation du clic vers le parent
    event.stopPropagation();

    console.log('Racheter commande:', order);
    // Logique de réachat (ajouter tous les articles au panier)
  }

  // Suivre une commande
  trackOrder(order: Order, event: Event): void {
    // Empêcher la propagation du clic vers le parent
    event.stopPropagation();

    console.log('Suivre commande:', order);
    // Navigation vers le suivi de commande
    this.router.navigate(['/client/track-order', order.id]);
  }
}
