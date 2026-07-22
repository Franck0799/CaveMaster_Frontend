import { OnDestroy } from '@angular/core';
// ==========================================
// FICHIER: src/app/server/active-orders/active-orders.component.ts
// DESCRIPTION: Suivi des commandes actives en temps réel
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { OrdersService } from '../../../core/services/sales/orders.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ApiOrder } from '../../../core/models/Sales/Order';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

interface Order {
  id: string;
  tableNumber: string;
  orderTime: Date;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  items: OrderItem[];
  totalAmount: number;
  priority: 'normal' | 'urgent';
  serverId?: string;
  serverName?: string;
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
  orders: Order[] = [];

  filteredOrders: Order[] = [];
  selectedFilter: 'all' | 'pending' | 'preparing' | 'ready' | 'served' = 'all';
  refreshInterval: any;
  autoRefresh = true;
  currentUserId: string | null = null;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
    });
    this.loadOrders();
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
    this.ordersService.getAll({ orderType: 'dine_in' }).subscribe({
      next: (apiOrders) => {
        const activeStatuses = ['pending', 'preparing', 'ready', 'served'];
        this.orders = apiOrders
          .filter(o => activeStatuses.includes(o.status))
          .map(o => this.mapApiOrderToLocal(o));
        this.filterOrders();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes depuis le backend :', error);
      }
    });
  }

  /** Convertit une commande reçue de l'API vers le modèle local utilisé par cet écran. */
  private mapApiOrderToLocal(o: ApiOrder): Order {
    return {
      id: o.id,
      tableNumber: o.tableNumber || '-',
      orderTime: o.createdAt ? new Date(o.createdAt) : new Date(),
      status: (o.status as Order['status']) || 'pending',
      priority: o.priority || 'normal',
      serverId: o.serverId,
      serverName: o.serverId === this.currentUserId ? 'Moi' : (o.serverName || 'Serveur'),
      totalAmount: o.totalAmount,
      items: o.items.map(i => ({
        id: i.id,
        name: i.productName,
        quantity: i.quantity,
        notes: i.notes,
        status: (i.status as OrderItem['status']) || 'pending'
      }))
    };
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
      'preparing': 'spinner',
      'ready': 'circle-check',
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
