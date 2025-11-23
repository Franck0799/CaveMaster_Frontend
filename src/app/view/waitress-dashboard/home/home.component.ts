// ==========================================
// FICHIER CORRIGÉ : home.component.ts
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

interface DailyStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  trend?: 'up' | 'down';
}

interface ActiveTable {
  id: number;
  number: string;
  seats: number;
  status: 'occupied' | 'ordering' | 'eating' | 'billing';
  orderTime: Date;
  amount: number;
}

interface Objective {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: string;
  color: string;
}

interface Notification {
  id: number;
  type: 'order-ready' | 'table-request' | 'manager-message' | 'info';
  message: string;
  time: Date;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  serverName = 'Marie Dubois';

  private refreshSubscription?: Subscription;

  dailyStats: DailyStat[] = [
    {
      label: 'Ventes du jour',
      value: '1 245 €',
      icon: 'trending-up',
      color: 'success',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Tables servies',
      value: 18,
      icon: 'grid',
      color: 'info',
      change: '+3',
      trend: 'up'
    },
    {
      label: 'Commandes',
      value: 34,
      icon: 'clipboard',
      color: 'warning'
    },
    {
      label: 'Pourboires',
      value: '87 €',
      icon: 'dollar-sign',
      color: 'purple'
    }
  ];

  objectives: Objective[] = [
    {
      title: 'Objectif de ventes',
      current: 1245,
      target: 1500,
      unit: '€',
      icon: 'target',
      color: 'primary'
    },
    {
      title: 'Tables servies',
      current: 18,
      target: 25,
      unit: 'tables',
      icon: 'grid',
      color: 'info'
    }
  ];

  activeTables: ActiveTable[] = [
    {
      id: 1,
      number: 'T12',
      seats: 4,
      status: 'ordering',
      orderTime: new Date(Date.now() - 15 * 60000),
      amount: 0
    },
    {
      id: 2,
      number: 'T05',
      seats: 2,
      status: 'eating',
      orderTime: new Date(Date.now() - 45 * 60000),
      amount: 78.50
    },
    {
      id: 3,
      number: 'T18',
      seats: 6,
      status: 'occupied',
      orderTime: new Date(Date.now() - 10 * 60000),
      amount: 0
    }
  ];

  notifications: Notification[] = [
    {
      id: 1,
      type: 'order-ready',
      message: 'Commande Table 8 prête en cuisine',
      time: new Date(Date.now() - 2 * 60000),
      priority: 'high'
    },
    {
      id: 2,
      type: 'table-request',
      message: 'Table 15 demande l\'addition',
      time: new Date(Date.now() - 5 * 60000),
      priority: 'high'
    },
    {
      id: 3,
      type: 'manager-message',
      message: 'Nouvelle suggestion de vin ajoutée',
      time: new Date(Date.now() - 30 * 60000),
      priority: 'medium'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // ✅ Auto-refresh toutes les 30 secondes
  private startAutoRefresh(): void {
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadDashboardData();
    });
  }

  // ✅ Charger les données du dashboard
  loadDashboardData(): void {
    // TODO: Implémenter avec les vrais services
    console.log('Chargement des données du dashboard...');
  }

  // ✅ Calculer le pourcentage d'objectif
  getObjectivePercentage(objective: Objective): number {
    return Math.min((objective.current / objective.target) * 100, 100);
  }

  // ✅ Obtenir le label de statut
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'occupied': 'Installée',
      'ordering': 'Commande en cours',
      'eating': 'En repas',
      'billing': 'Addition demandée'
    };
    return labels[status] || status;
  }

  // ✅ Obtenir la couleur de statut
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'occupied': 'info',
      'ordering': 'warning',
      'eating': 'success',
      'billing': 'danger'
    };
    return colors[status] || 'info';
  }

  // ✅ Obtenir le temps écoulé
  getElapsedTime(date: Date): string {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  // ✅ Obtenir l'icône de notification
  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'order-ready': 'check-circle',
      'table-request': 'bell',
      'manager-message': 'message-circle',
      'info': 'info'
    };
    return icons[type] || 'info';
  }

  // ✅ Aller à une table
  goToTable(table: ActiveTable): void {
    this.router.navigate(['/waitress/table'], {
      queryParams: { tableId: table.id }
    });
  }

  // ✅ Ignorer une notification
  dismissNotification(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }
}
