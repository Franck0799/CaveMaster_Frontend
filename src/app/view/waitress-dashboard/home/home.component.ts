// ==========================================
// FICHIER: src/app/server/home/home.component.ts
// DESCRIPTION: Dashboard Serveur - Vue d'ensemble
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';

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
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule,RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentDate = new Date();
  serverName = 'Marie Dubois';

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

  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // TODO: Charger les données depuis le backend
  }

  getObjectivePercentage(objective: Objective): number {
    return Math.min((objective.current / objective.target) * 100, 100);
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'occupied': 'Installée',
      'ordering': 'Commande en cours',
      'eating': 'En repas',
      'billing': 'Addition demandée'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'occupied': 'info',
      'ordering': 'warning',
      'eating': 'success',
      'billing': 'danger'
    };
    return colors[status] || 'info';
  }

  getElapsedTime(date: Date): string {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  getNotificationIcon(type: string): string {
    const icons: any = {
      'order-ready': 'check-circle',
      'table-request': 'bell',
      'manager-message': 'message-circle',
      'info': 'info'
    };
    return icons[type] || 'info';
  }

  goToTable(table: ActiveTable): void {
    // TODO: Naviguer vers la page de la table
    console.log('Navigate to table:', table);
  }

  dismissNotification(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }
}
