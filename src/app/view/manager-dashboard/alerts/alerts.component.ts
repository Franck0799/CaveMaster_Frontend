// ===== alerts.component.ts =====
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AlertItem {
  icon: string;
  title: string;
  description: string;
  time: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  priorityText: string;
}

interface AlertCategory {
  title: string;
  icon: string;
  count: number;
  alerts: AlertItem[];
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  alertsData: AlertCategory[] = [
    {
      title: '📦 Alertes Stock',
      icon: '📦',
      count: 5,
      alerts: [
        {
          icon: '🚨',
          title: 'Stock critique',
          description: 'Hennessy VSOP - Seulement 3 bouteilles restantes',
          time: 'Il y a 15 min',
          priority: 'urgent',
          priorityText: 'URGENT'
        },
        {
          icon: '⚠️',
          title: 'Stock faible',
          description: 'Dom Pérignon - 8 bouteilles restantes',
          time: 'Il y a 1h',
          priority: 'high',
          priorityText: 'ÉLEVÉ'
        },
        {
          icon: '⚠️',
          title: 'Stock faible',
          description: 'Château Margaux - 12 bouteilles',
          time: 'Il y a 2h',
          priority: 'medium',
          priorityText: 'MOYEN'
        },
        {
          icon: '📊',
          title: 'Inventaire recommandé',
          description: 'Réapprovisionnement suggéré: Heineken',
          time: 'Il y a 3h',
          priority: 'low',
          priorityText: 'INFO'
        },
        {
          icon: '✅',
          title: 'Livraison reçue',
          description: '50 bouteilles de vin rouge ajoutées',
          time: 'Il y a 4h',
          priority: 'low',
          priorityText: 'INFO'
        }
      ]
    },
    {
      title: '⭐ Réservations VIP',
      icon: '⭐',
      count: 4,
      alerts: [
        {
          icon: '👑',
          title: 'Nouvelle réservation VIP',
          description: 'Client Premium - 20 bouteilles Dom Pérignon',
          time: 'Il y a 10 min',
          priority: 'urgent',
          priorityText: 'URGENT'
        },
        {
          icon: '⭐',
          title: 'Réservation confirmée',
          description: 'Événement corporate - 50 bouteilles mixtes',
          time: 'Il y a 30 min',
          priority: 'medium',
          priorityText: 'MOYEN'
        },
        {
          icon: '🎉',
          title: 'Réservation anniversaire',
          description: 'Commande spéciale - 15 bouteilles Champagne',
          time: 'Il y a 1h',
          priority: 'low',
          priorityText: 'INFO'
        },
        {
          icon: '📅',
          title: 'Réservation à venir',
          description: 'Demain 18h - Client VIP régulier',
          time: 'Il y a 2h',
          priority: 'low',
          priorityText: 'INFO'
        }
      ]
    },
    {
      title: '🛒 Réservations Standard',
      icon: '🛒',
      count: 3,
      alerts: [
        {
          icon: '🛍️',
          title: 'Nouvelle commande',
          description: 'Client régulier - 5 bouteilles vin rouge',
          time: 'Il y a 20 min',
          priority: 'medium',
          priorityText: 'MOYEN'
        },
        {
          icon: '📦',
          title: 'Commande prête',
          description: 'À retirer - 3 bouteilles Hennessy',
          time: 'Il y a 45 min',
          priority: 'medium',
          priorityText: 'MOYEN'
        },
        {
          icon: '✅',
          title: 'Commande livrée',
          description: '10 bouteilles bières - Victoria Island',
          time: 'Il y a 1h',
          priority: 'low',
          priorityText: 'INFO'
        }
      ]
    }
  ];

  ngOnInit(): void {
    console.log('Alerts page loaded');
  }

  getTotalAlerts(): number {
    return this.alertsData.reduce((sum, category) => sum + category.count, 0);
  }

  getUrgentAlerts(): number {
    let count = 0;
    this.alertsData.forEach(category => {
      count += category.alerts.filter(a => a.priority === 'urgent' || a.priority === 'high').length;
    });
    return count;
  }
}

