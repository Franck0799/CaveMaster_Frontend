import { OnDestroy } from '@angular/core';
// ==========================================
// FICHIER: src/app/server/active-orders/active-orders.component.ts
// DESCRIPTION: Suivi des commandes actives en temps réel
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

interface Order {
  id: number;
  tableNumber: string;
  orderTime: Date;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  items: OrderItem[];
  totalAmount: number;
  priority: 'normal' | 'urgent';
  serverId: number;
  serverName: string;
}

@Component({
  selector: 'app-active-orders',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule,RouterModule,  ReactiveFormsModule],
  templateUrl: './active-orders.component.html',
  styleUrls: ['./active-orders.component.scss']
})
export class ActiveOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [
    {
      id: 1,
      tableNumber: 'T05',
      orderTime: new Date(Date.now() - 25 * 60000),
      status: 'ready',
      priority: 'urgent',
      serverId: 1,
      serverName: 'Marie',
      totalAmount: 78.50,
      items: [
        { id: 1, name: 'Magret de Canard', quantity: 1, status: 'ready' },
        { id: 2, name: 'Pavé de Saumon', quantity: 1, status: 'ready' },
        { id: 3, name: 'Château Margaux 2015', quantity: 1, status: 'served' }
      ]
    },
    {
      id: 2,
      tableNumber: 'T12',
      orderTime: new Date(Date.now() - 15 * 60000),
      status: 'preparing',
      priority: 'normal',
      serverId: 1,
      serverName: 'Marie',
      totalAmount: 95.00,
      items: [
        { id: 4, name: 'Foie Gras Poêlé', quantity: 2, status: 'preparing' },
        { id: 5, name: 'Entrecôte Grillée', quantity: 2, status: 'preparing' },
        { id: 6, name: 'Chablis Grand Cru', quantity: 1, status: 'served' }
      ]
    },
    {
      id: 3,
      tableNumber: 'T18',
      orderTime: new Date(Date.now() - 10 * 60000),
      status: 'pending',
      priority: 'normal',
      serverId: 1,
      serverName: 'Marie',
      totalAmount: 48.00,
      items: [
        { id: 7, name: 'Salade César', quantity: 2, status: 'pending' },
        { id: 8, name: 'Risotto aux Champignons', quantity: 2, status: 'pending' }
      ]
    },
    {
      id: 4,
      tableNumber: 'T10',
      orderTime: new Date(Date.now() - 5 * 60000),
      status: 'ready',
      priority: 'urgent',
      serverId: 1,
      serverName: 'Marie',
      totalAmount: 34.50,
      items: [
        { id: 9, name: 'Tiramisu', quantity: 2, status: 'ready' },
        { id: 10, name: 'Moelleux au Chocolat', quantity: 2, status: 'ready' }
      ]
    }
  ];

  filteredOrders: Order[] = [];
  selectedFilter: 'all' | 'pending' | 'preparing' | 'ready' | 'served' = 'all';
  refreshInterval: any;
  autoRefresh = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filterOrders();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  startAutoRefresh(): void {
    if (this.autoRefresh) {
      this.refreshInterval = setInterval(() => {
        this.loadOrders();
      }, 10000); // Refresh toutes les 10 secondes
    }
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  loadOrders(): void {
    // TODO: Charger les commandes depuis le backend
    console.log('Refresh orders...');
  }

  filterOrders(): void {
    if (this.selectedFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedFilter);
    }

    // Trier par priorité et date
    this.filteredOrders.sort((a, b) => {
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
      return b.orderTime.getTime() - a.orderTime.getTime();
    });
  }

  selectFilter(filter: 'all' | 'pending' | 'preparing' | 'ready' | 'served'): void {
    this.selectedFilter = filter;
    this.filterOrders();
  }

  getOrdersCount(status?: string): number {
    if (!status || status === 'all') {
      return this.orders.length;
    }
    return this.orders.filter(order => order.status === status).length;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'pending': 'En attente',
      'preparing': 'En préparation',
      'ready': 'Prêt à servir',
      'served': 'Servi'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': 'warning',
      'preparing': 'info',
      'ready': 'success',
      'served': 'default'
    };
    return colors[status] || 'default';
  }

  getItemStatusIcon(status: string): string {
    const icons: any = {
      'pending': 'clock',
      'preparing': 'loader',
      'ready': 'check-circle',
      'served': 'check'
    };
    return icons[status] || 'circle';
  }

  getElapsedTime(date: Date): string {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }

  markItemAsServed(order: Order, item: OrderItem): void {
    item.status = 'served';

    // Vérifier si tous les items sont servis
    const allServed = order.items.every(i => i.status === 'served');
    if (allServed) {
      order.status = 'served';
      this.filterOrders();
    }
  }

  markOrderAsReady(order: Order): void {
    order.status = 'ready';
    order.priority = 'urgent';
    this.filterOrders();
  }

  markOrderAsServed(order: Order): void {
    order.status = 'served';
    order.items.forEach(item => item.status = 'served');
    this.filterOrders();

    // Notification
    alert(`Commande ${order.tableNumber} marquée comme servie !`);
  }

  goToTable(order: Order): void {
    this.router.navigate(['/server/tables'], {
      queryParams: { tableNumber: order.tableNumber }
    });
  }

  addItemsToOrder(order: Order): void {
    this.router.navigate(['/server/orders'], {
      queryParams: {
        tableId: order.id,
        tableNumber: order.tableNumber
      }
    });
  }

  generateBill(order: Order): void {
    this.router.navigate(['/server/billing'], {
      queryParams: {
        tableNumber: order.tableNumber,
        orderId: order.id
      }
    });
  }
}
