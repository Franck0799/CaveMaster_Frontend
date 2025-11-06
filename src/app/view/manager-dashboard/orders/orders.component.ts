// ==========================================
// ORDERS COMPONENT (Commandes en cours)
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Order {
  id: string;
  tableNumber: string;
  server: string;
  items: OrderItem[];
  status: 'pending' | 'in-progress' | 'ready' | 'served';
  totalAmount: number;
  createdAt: Date;
  notes?: string;
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./orders.component.html`,
  styleUrls: [`./orders.component.scss`]
})
export class OrdersComponent implements OnInit {
  selectedStatus = 'all';

  orders: Order[] = [
    {
      id: 'CMD001',
      tableNumber: 'T12',
      server: 'Marie M.',
      items: [
        { productName: 'Château Margaux 2015', quantity: 1, price: 450 },
        { productName: 'Foie gras', quantity: 2, price: 28 }
      ],
      status: 'pending',
      totalAmount: 506,
      createdAt: new Date(Date.now() - 5 * 60000),
      notes: 'Client allergique aux fruits de mer'
    },
    {
      id: 'CMD002',
      tableNumber: 'T05',
      server: 'Pierre D.',
      items: [
        { productName: 'Dom Pérignon', quantity: 1, price: 180 },
        { productName: 'Caviar', quantity: 1, price: 95 }
      ],
      status: 'in-progress',
      totalAmount: 275,
      createdAt: new Date(Date.now() - 15 * 60000)
    },
    {
      id: 'CMD003',
      tableNumber: 'T08',
      server: 'Sophie L.',
      items: [
        { productName: 'Châteauneuf-du-Pape', quantity: 2, price: 65 }
      ],
      status: 'ready',
      totalAmount: 130,
      createdAt: new Date(Date.now() - 25 * 60000),
      notes: 'À servir frais'
    },
    {
      id: 'CMD004',
      tableNumber: 'T15',
      server: 'Marie M.',
      items: [
        { productName: 'Moët & Chandon', quantity: 3, price: 45 },
        { productName: 'Amuse-bouche', quantity: 3, price: 12 }
      ],
      status: 'in-progress',
      totalAmount: 171,
      createdAt: new Date(Date.now() - 10 * 60000)
    }
  ];

  filteredOrders: Order[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filterByStatus('all');
    this.startAutoRefresh();
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (status === 'all') {
      this.filteredOrders = this.orders.filter(o => o.status !== 'served');
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === status);
    }
  }

  getActiveOrdersCount(): number {
    return this.orders.filter(o => o.status !== 'served').length;
  }

  getCountByStatus(status: string): number {
    return this.orders.filter(o => o.status === status).length;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'in-progress': 'En préparation',
      'ready': 'Prête',
      'served': 'Servie'
    };
    return labels[status] || status;
  }

  getTimeAgo(date: Date): string {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'À l\'instant';
    if (minutes === 1) return 'Il y a 1 min';
    return `Il y a ${minutes} min`;
  }

  startOrder(order: Order): void {
    order.status = 'in-progress';
    this.filterByStatus(this.selectedStatus);
    console.log('Commande démarrée:', order.id);
  }

  markReady(order: Order): void {
    order.status = 'ready';
    this.filterByStatus(this.selectedStatus);
    console.log('Commande prête:', order.id);
  }

  markServed(order: Order): void {
    order.status = 'served';
    this.filterByStatus(this.selectedStatus);
    console.log('Commande servie:', order.id);
  }

  viewOrder(order: Order): void {
    console.log('Voir commande:', order);
  }

  refreshOrders(): void {
    console.log('Actualisation des commandes...');
    this.filterByStatus(this.selectedStatus);
  }

  startAutoRefresh(): void {
    setInterval(() => {
      this.filteredOrders = [...this.filteredOrders];
    }, 30000); // Actualisation toutes les 30 secondes
  }
}
