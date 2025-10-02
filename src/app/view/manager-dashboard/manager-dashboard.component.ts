import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BarChart3, Users, Package, Calendar } from 'lucide-angular';
interface Stat {
  icon: string;
  label: string;
  value: string;
  color: string;
}

interface Employee {
  name: string;
  role: string;
  status: string;
  hours: string;
  performance: number;
}

interface Order {
  id: string;
  client: string;
  items: number;
  total: string;
  status: string;
  server: string;
}

interface Alert {
  type: 'warning' | 'info' | 'success';
  message: string;
}


@Component({
  selector: 'app-manager-dashboard',
  standalone: true,   // ← ajoute ça
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})

export class ManagerDashboardComponent implements OnInit {
  activeTab: string = 'tableau';

  stats: Stat[] = [
    { icon: 'users', label: 'Employés actifs', value: '8', color: 'bg-blue-100 text-blue-600' },
    { icon: 'package', label: 'Commandes du jour', value: '23', color: 'bg-green-100 text-green-600' },
    { icon: 'trending-up', label: 'CA du mois', value: '45,780€', color: 'bg-purple-100 text-purple-600' },
    { icon: 'euro', label: 'Objectif mensuel', value: '87%', color: 'bg-orange-100 text-orange-600' }
  ];

  employees: Employee[] = [
    { name: 'Marie Dubois', role: 'Serveuse', status: 'En service', hours: '6h30', performance: 95 },
    { name: 'Jean Martin', role: 'Serveur', status: 'Pause', hours: '4h15', performance: 88 },
    { name: 'Sophie Laurent', role: 'Serveuse', status: 'En service', hours: '7h00', performance: 92 },
    { name: 'Thomas Petit', role: 'Barman', status: 'En service', hours: '5h45', performance: 90 }
  ];

  recentOrders: Order[] = [
    { id: '#CMD-2156', client: 'Table 5', items: 3, total: '245€', status: 'En cours', server: 'Marie' },
    { id: '#CMD-2157', client: 'Table 12', items: 2, total: '180€', status: 'Terminée', server: 'Jean' },
    { id: '#CMD-2158', client: 'Table 3', items: 5, total: '420€', status: 'En cours', server: 'Sophie' },
    { id: '#CMD-2159', client: 'Table 8', items: 1, total: '95€', status: 'Payée', server: 'Marie' }
  ];

  alerts: Alert[] = [
    { type: 'warning', message: 'Stock faible: Château Margaux 2015 (3 bouteilles)' },
    { type: 'info', message: 'Réservation VIP ce soir - Table 10 à 20h00' },
    { type: 'success', message: 'Objectif hebdomadaire atteint à 112%' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialisation du composant
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  getStatusClass(status: string): string {
    return status === 'En service'
      ? 'bg-green-100 text-green-700'
      : 'bg-orange-100 text-orange-700';
  }

  getOrderStatusClass(status: string): string {
    if (status === 'En cours') return 'bg-blue-100 text-blue-700';
    if (status === 'Terminée') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  }

  getAlertClass(type: string): string {
    if (type === 'warning') return 'bg-orange-50 border-orange-200 text-orange-700';
    if (type === 'success') return 'bg-green-50 border-green-200 text-green-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  }
}
