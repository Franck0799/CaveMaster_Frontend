// ==========================================
// FICHIER: src/app/server/tables/tables.component.ts
// DESCRIPTION: Gestion des tables - Plan et statuts
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

interface Table {
  id: number;
  number: string;
  seats: number;
  status: 'free' | 'occupied' | 'reserved' | 'billing';
  serverId?: number;
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

  tables: Table[] = [
    // Zone principale
    { id: 1, number: 'T01', seats: 2, status: 'free', x: 50, y: 50 },
    { id: 2, number: 'T02', seats: 2, status: 'occupied', serverId: 1, serverName: 'Marie', occupiedSince: new Date(Date.now() - 45 * 60000), currentAmount: 48.50, guestsCount: 2, x: 150, y: 50 },
    { id: 3, number: 'T03', seats: 4, status: 'free', x: 250, y: 50 },
    { id: 4, number: 'T04', seats: 4, status: 'reserved', x: 350, y: 50 },
    { id: 5, number: 'T05', seats: 2, status: 'billing', serverId: 1, serverName: 'Marie', occupiedSince: new Date(Date.now() - 90 * 60000), currentAmount: 78.90, guestsCount: 2, x: 50, y: 180 },
    { id: 6, number: 'T06', seats: 4, status: 'free', x: 150, y: 180 },
    { id: 7, number: 'T07', seats: 6, status: 'occupied', serverId: 2, serverName: 'Jean', occupiedSince: new Date(Date.now() - 30 * 60000), currentAmount: 125.00, guestsCount: 6, x: 250, y: 180 },
    { id: 8, number: 'T08', seats: 4, status: 'free', x: 350, y: 180 },
    // Zone terrasse
    { id: 9, number: 'T09', seats: 4, status: 'free', x: 550, y: 50 },
    { id: 10, number: 'T10', seats: 2, status: 'occupied', serverId: 1, serverName: 'Marie', occupiedSince: new Date(Date.now() - 15 * 60000), currentAmount: 0, guestsCount: 2, x: 650, y: 50 },
    { id: 11, number: 'T11', seats: 6, status: 'free', x: 550, y: 180 },
    { id: 12, number: 'T12', seats: 4, status: 'occupied', serverId: 1, serverName: 'Marie', occupiedSince: new Date(Date.now() - 25 * 60000), currentAmount: 0, guestsCount: 4, x: 650, y: 180 }
  ];

  filteredTables: Table[] = [];
  selectedTable: Table | null = null;

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

  constructor(private router: Router, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.calculateStats();
    this.applyFilters();
  }

  calculateStats(): void {
    this.stats.total = this.tables.length;
    this.stats.free = this.tables.filter(t => t.status === 'free').length;
    this.stats.occupied = this.tables.filter(t => t.status === 'occupied').length;
    this.stats.reserved = this.tables.filter(t => t.status === 'reserved').length;
    this.stats.billing = this.tables.filter(t => t.status === 'billing').length;
    this.stats.myTables = this.tables.filter(t => t.serverId === 1).length; // ID serveur actuel
  }

  applyFilters(): void {
    this.filteredTables = this.tables.filter(table => {
      const statusMatch = this.filters.status === 'all' || table.status === this.filters.status;
      const seatsMatch = this.filters.seats === 'all' || table.seats.toString() === this.filters.seats;
      const serverMatch = this.filters.server === 'all' ||
                         (this.filters.server === 'my' && table.serverId === 1) ||
                         (this.filters.server === 'other' && table.serverId !== 1 && table.serverId !== undefined);

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

    // TODO: Ouvrir modal pour assigner la table
    console.log('Assigner table:', table);

    // Simulation
    table.status = 'occupied';
    table.serverId = 1; // ID serveur actuel
    table.serverName = 'Marie';
    table.occupiedSince = new Date();
    table.guestsCount = table.seats;
    table.currentAmount = 0;

    this.calculateStats();
    this.applyFilters();
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
      table.status = 'free';
      table.serverId = undefined;
      table.serverName = undefined;
      table.occupiedSince = undefined;
      table.currentAmount = undefined;
      table.guestsCount = undefined;

      this.selectedTable = null;
      this.calculateStats();
      this.applyFilters();
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
