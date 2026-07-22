// ==========================================
// FICHIER: src/app/server/tables/tables.component.ts
// DESCRIPTION: Gestion des tables - Plan et statuts
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { RestaurantTablesService } from '../../../core/services/sales/restaurant-tables.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ApiRestaurantTable } from '../../../core/models/Sales/RestaurantTable';

interface Table {
  id: string;
  number: string;
  seats: number;
  status: 'free' | 'occupied' | 'reserved' | 'billing';
  serverId?: string;
  serverName?: string;
  occupiedSince?: Date;
  currentAmount?: number;
  guestsCount?: number;
  x: number; // Position X pour le plan
  y: number; // Position Y pour le plan
}

interface TableFilter {
  status: string;
  seats: string;
  server: string;
}

@Component({
  selector: 'app-table',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TablesComponent implements OnInit {
  viewMode: 'plan' | 'list' = 'plan';

  tables: Table[] = [];

  filteredTables: Table[] = [];
  selectedTable: Table | null = null;
  currentUserId: string | null = null;

  filters: TableFilter = {
    status: 'all',
    seats: 'all',
    server: 'all'
  };

  stats = {
    total: 0,
    free: 0,
    occupied: 0,
    reserved: 0,
    billing: 0,
    myTables: 0
  };

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private tablesService: RestaurantTablesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
    });
    this.loadTables();
  }

  loadTables(): void {
    this.tablesService.getAll().subscribe({
      next: (apiTables) => {
        this.tables = apiTables.map(t => this.mapApiTableToLocal(t));
        this.calculateStats();
        this.applyFilters();
        console.log('Tables chargées depuis le backend :', this.tables.length);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tables depuis le backend :', error);
        this.tables = [];
        this.calculateStats();
        this.applyFilters();
      }
    });
  }

  /** Convertit une table reçue de l'API vers le modèle local utilisé par le plan de salle. */
  private mapApiTableToLocal(t: ApiRestaurantTable): Table {
    return {
      id: t.id,
      number: t.number,
      seats: t.seats,
      status: t.status,
      serverId: t.serverId,
      serverName: t.serverId === this.currentUserId ? 'Moi' : (t.serverId ? 'Autre serveur' : undefined),
      occupiedSince: t.occupiedSince ? new Date(t.occupiedSince) : undefined,
      currentAmount: t.currentAmount,
      guestsCount: t.guestsCount,
      x: t.x,
      y: t.y
    };
  }

  calculateStats(): void {
    this.stats.total = this.tables.length;
    this.stats.free = this.tables.filter(t => t.status === 'free').length;
    this.stats.occupied = this.tables.filter(t => t.status === 'occupied').length;
    this.stats.reserved = this.tables.filter(t => t.status === 'reserved').length;
    this.stats.billing = this.tables.filter(t => t.status === 'billing').length;
    this.stats.myTables = this.tables.filter(t => t.serverId === this.currentUserId).length;
  }

  applyFilters(): void {
    this.filteredTables = this.tables.filter(table => {
      const statusMatch = this.filters.status === 'all' || table.status === this.filters.status;
      const seatsMatch = this.filters.seats === 'all' || table.seats.toString() === this.filters.seats;
      const serverMatch = this.filters.server === 'all' ||
                         (this.filters.server === 'my' && table.serverId === this.currentUserId) ||
                         (this.filters.server === 'other' && table.serverId !== this.currentUserId && table.serverId !== undefined);

      return statusMatch && seatsMatch && serverMatch;
    });
  }

  selectTable(table: Table): void {
    this.selectedTable = this.selectedTable?.id === table.id ? null : table;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'free': 'Libre',
      'occupied': 'Occupée',
      'reserved': 'Réservée',
      'billing': 'Addition'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'free': 'success',
      'occupied': 'warning',
      'reserved': 'info',
      'billing': 'danger'
    };
    return colors[status] || 'default';
  }

  getElapsedTime(date?: Date): string {
    if (!date) return '-';
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }

  assignTable(table: Table): void {
    if (table.status !== 'free') return;

    this.tablesService.update(table.id, {
      status: 'occupied',
      serverId: this.currentUserId ?? undefined,
      occupiedSince: new Date().toISOString(),
      guestsCount: table.seats,
      currentAmount: 0
    }).subscribe({
      next: () => {
        table.status = 'occupied';
        table.serverId = this.currentUserId ?? undefined;
        table.serverName = 'Moi';
        table.occupiedSince = new Date();
        table.guestsCount = table.seats;
        table.currentAmount = 0;

        this.calculateStats();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors de l\'assignation de la table :', error);
        this.notificationService.error('Erreur lors de l\'assignation de la table');
      }
    });
  }

  takeOrder(table: Table): void {
    this.router.navigate(['/server/orders'], {
      queryParams: { tableId: table.id, tableNumber: table.number }
    });
  }

  generateBill(table: Table): void {
    this.router.navigate(['/server/billing'], {
      queryParams: { tableId: table.id, tableNumber: table.number }
    });
  }

  freeTable(table: Table): void {
    if (confirm(`Libérer la table ${table.number} ?`)) {
      this.tablesService.update(table.id, {
        status: 'free',
        serverId: undefined,
        occupiedSince: undefined,
        currentAmount: 0,
        guestsCount: undefined
      }).subscribe({
        next: () => {
          table.status = 'free';
          table.serverId = undefined;
          table.serverName = undefined;
          table.occupiedSince = undefined;
          table.currentAmount = undefined;
          table.guestsCount = undefined;

          this.selectedTable = null;
          this.calculateStats();
          this.applyFilters();
        },
        error: (error) => {
          console.error('Erreur lors de la libération de la table :', error);
          this.notificationService.error('Erreur lors de la libération de la table');
        }
      });
    }
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'plan' ? 'list' : 'plan';
  }

  resetFilters(): void {
    this.filters = {
      status: 'all',
      seats: 'all',
      server: 'all'
    };
    this.applyFilters();
  }
}
