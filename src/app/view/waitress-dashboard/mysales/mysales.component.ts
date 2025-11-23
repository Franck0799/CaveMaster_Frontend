// ==========================================
// FICHIER: src/app/server/my-sales/my-sales.component.ts
// DESCRIPTION: Statistiques et historique des ventes personnelles
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface Sale {
  id: number;
  date: Date;
  tableNumber: string;
  items: number;
  amount: number;
  tip: number;
  paymentMethod: string;
  duration: number; // en minutes
}

interface DailyStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  trend?: 'up' | 'down';
}

interface LeaderboardEntry {
  rank: number;
  serverName: string;
  sales: number;
  orders: number;
  tips: number;
  isCurrentUser: boolean;
}

interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-server-my-sales',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mysales.component.html',
  styleUrls: ['./mysales.component.scss']
})
export class MySalesComponent implements OnInit {
  selectedPeriod: 'today' | 'week' | 'month' = 'today';

  dailyStats: DailyStat[] = [
    {
      label: 'Ventes Totales',
      value: '1,245 €',
      icon: 'trending-up',
      color: 'success',
      change: '+15%',
      trend: 'up'
    },
    {
      label: 'Nombre de Ventes',
      value: 18,
      icon: 'shopping-cart',
      color: 'info',
      change: '+3',
      trend: 'up'
    },
    {
      label: 'Panier Moyen',
      value: '69,17 €',
      icon: 'dollar-sign',
      color: 'warning'
    },
    {
      label: 'Pourboires',
      value: '87 €',
      icon: 'gift',
      color: 'purple',
      change: '+12 €',
      trend: 'up'
    }
  ];

  salesHistory: Sale[] = [
    {
      id: 1,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tableNumber: 'T12',
      items: 5,
      amount: 156.00,
      tip: 15.00,
      paymentMethod: 'Carte',
      duration: 85
    },
    {
      id: 2,
      date: new Date(Date.now() - 3 * 60 * 60 * 1000),
      tableNumber: 'T05',
      items: 3,
      amount: 78.50,
      tip: 8.00,
      paymentMethod: 'Espèces',
      duration: 65
    },
    {
      id: 3,
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
      tableNumber: 'T18',
      items: 8,
      amount: 245.00,
      tip: 25.00,
      paymentMethod: 'Carte',
      duration: 120
    },
    {
      id: 4,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      tableNumber: 'T08',
      items: 2,
      amount: 48.00,
      tip: 5.00,
      paymentMethod: 'Mobile',
      duration: 45
    },
    {
      id: 5,
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      tableNumber: 'T15',
      items: 4,
      amount: 95.00,
      tip: 10.00,
      paymentMethod: 'Carte',
      duration: 70
    }
  ];

  leaderboard: LeaderboardEntry[] = [
    { rank: 1, serverName: 'Sophie Martin', sales: 1580, orders: 24, tips: 145, isCurrentUser: false },
    { rank: 2, serverName: 'Marie Dubois', sales: 1245, orders: 18, tips: 87, isCurrentUser: true },
    { rank: 3, serverName: 'Jean Dupont', sales: 1120, orders: 16, tips: 78, isCurrentUser: false },
    { rank: 4, serverName: 'Lucas Bernard', sales: 980, orders: 15, tips: 65, isCurrentUser: false },
    { rank: 5, serverName: 'Emma Petit', sales: 875, orders: 13, tips: 58, isCurrentUser: false }
  ];

  hourlySales: ChartData[] = [
    { label: '12h', value: 145 },
    { label: '13h', value: 280 },
    { label: '14h', value: 195 },
    { label: '15h', value: 85 },
    { label: '19h', value: 165 },
    { label: '20h', value: 245 },
    { label: '21h', value: 130 }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    // TODO: Charger les données depuis le backend selon la période
    console.log('Loading sales data for period:', this.selectedPeriod);
  }

  selectPeriod(period: 'today' | 'week' | 'month'): void {
    this.selectedPeriod = period;
    this.loadSalesData();
  }

  getTotalSales(): number {
    return this.salesHistory.reduce((sum, sale) => sum + sale.amount, 0);
  }

  getTotalTips(): number {
    return this.salesHistory.reduce((sum, sale) => sum + sale.tip, 0);
  }

  getAverageTicket(): number {
    return this.salesHistory.length > 0
      ? this.getTotalSales() / this.salesHistory.length
      : 0;
  }

  getAverageDuration(): number {
    return this.salesHistory.length > 0
      ? this.salesHistory.reduce((sum, sale) => sum + sale.duration, 0) / this.salesHistory.length
      : 0;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins + 'min' : ''}`;
  }

  getPaymentMethodIcon(method: string): string {
    const icons: any = {
      'Carte': 'credit-card',
      'Espèces': 'dollar-sign',
      'Mobile': 'smartphone',
      'Chèque': 'file-text'
    };
    return icons[method] || 'dollar-sign';
  }

  exportData(): void {
    // TODO: Exporter les données en CSV/Excel
    console.log('Exporting sales data...');
    alert('Export des données en cours...');
  }

  viewSaleDetails(sale: Sale): void {
    // TODO: Afficher le détail d'une vente
    console.log('View sale details:', sale);
  }

  getMedalIcon(rank: number): string {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  }

  getMaxSaleValue(): number {
    return Math.max(...this.hourlySales.map(s => s.value));
  }

  getChartBarHeight(value: number): number {
    const max = this.getMaxSaleValue();
    return (value / max) * 100;
  }
}
