import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import * as lucide from 'lucide';

interface Stat {
  icon: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  color: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  role: 'Manager' | 'Serveuse' | 'Serveur' | 'Barman' | 'Cuisinier';
  status: 'Actif' | 'Inactif' | 'En congé';
  joinDate: string;
  performance: number;
  avatar: string;
}

interface Wine {
  id: number;
  name: string;
  type: string;
  region: string;
  price: number;
  stock: number;
  sold: number;
  rating: number;
  image: string;
}

interface Order {
  id: string;
  client: string;
  server: string;
  table: number;
  items: number;
  total: number;
  status: 'En cours' | 'Terminée' | 'Payée' | 'Annulée';
  date: string;
  time: string;
}

interface Analytics {
  date: string;
  revenue: number;
  orders: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  activeTab: string = 'vue-ensemble';
  showAddEmployeeModal: boolean = false;
  showAddWineModal: boolean = false;
  selectedEmployee: Employee | null = null;
  selectedWine: Wine | null = null;

  stats: Stat[] = [
    { icon: 'trending-up', label: 'Revenu Total', value: '127,840€', change: '+12.5%', changeType: 'positive', color: 'bg-green-100 text-green-600' },
    { icon: 'shopping-cart', label: 'Commandes', value: '1,284', change: '+8.2%', changeType: 'positive', color: 'bg-blue-100 text-blue-600' },
    { icon: 'users', label: 'Clients Actifs', value: '8,549', change: '+23.1%', changeType: 'positive', color: 'bg-purple-100 text-purple-600' },
    { icon: 'wine', label: 'Vins en Stock', value: '2,847', change: '-3.2%', changeType: 'negative', color: 'bg-orange-100 text-orange-600' }
  ];

  employees: Employee[] = [
    { id: 1, name: 'Franck KONGO', email: 'franck@vikings.com', role: 'Manager', status: 'Actif', joinDate: '2023-01-15', performance: 95, avatar: 'FK' },
    { id: 2, name: 'Marie Dubois', email: 'marie@vikings.com', role: 'Serveuse', status: 'Actif', joinDate: '2023-03-20', performance: 92, avatar: 'MD' },
    { id: 3, name: 'Jean Martin', email: 'jean@vikings.com', role: 'Serveur', status: 'Actif', joinDate: '2023-02-10', performance: 88, avatar: 'JM' },
    { id: 4, name: 'Sophie Laurent', email: 'sophie@vikings.com', role: 'Serveuse', status: 'En congé', joinDate: '2023-04-05', performance: 90, avatar: 'SL' },
    { id: 5, name: 'Thomas Petit', email: 'thomas@vikings.com', role: 'Barman', status: 'Actif', joinDate: '2023-05-12', performance: 87, avatar: 'TP' }
  ];

  wines: Wine[] = [
    { id: 1, name: 'Château Margaux 2015', type: 'Rouge', region: 'Bordeaux', price: 125, stock: 12, sold: 45, rating: 4.8, image: '🍷' },
    { id: 2, name: 'Bourgogne Blanc', type: 'Blanc', region: 'Bourgogne', price: 45, stock: 24, sold: 89, rating: 4.5, image: '🥂' },
    { id: 3, name: 'Champagne Veuve Clicquot', type: 'Champagne', region: 'Champagne', price: 85, stock: 18, sold: 67, rating: 4.9, image: '🍾' },
    { id: 4, name: 'Côtes du Rhône', type: 'Rouge', region: 'Rhône', price: 35, stock: 45, sold: 123, rating: 4.3, image: '🍷' },
    { id: 5, name: 'Sancerre Blanc', type: 'Blanc', region: 'Loire', price: 38, stock: 28, sold: 98, rating: 4.6, image: '🥂' }
  ];

  orders: Order[] = [
    { id: '#CMD-2156', client: 'Sophie Martin', server: 'Marie Dubois', table: 5, items: 3, total: 245, status: 'En cours', date: '2025-10-03', time: '19:30' },
    { id: '#CMD-2157', client: 'Pierre Durand', server: 'Jean Martin', table: 12, items: 2, total: 180, status: 'Terminée', date: '2025-10-03', time: '19:15' },
    { id: '#CMD-2158', client: 'Julie Lefebvre', server: 'Marie Dubois', table: 3, items: 5, total: 420, status: 'Payée', date: '2025-10-03', time: '20:00' },
    { id: '#CMD-2159', client: 'Marc Bernard', server: 'Thomas Petit', table: 8, items: 1, total: 95, status: 'En cours', date: '2025-10-03', time: '20:15' },
    { id: '#CMD-2160', client: 'Emma Rousseau', server: 'Jean Martin', table: 15, items: 4, total: 310, status: 'Terminée', date: '2025-10-03', time: '18:45' }
  ];

  analytics: Analytics[] = [
    { date: '01/10', revenue: 8500, orders: 42 },
    { date: '02/10', revenue: 9200, orders: 48 },
    { date: '03/10', revenue: 10100, orders: 55 },
    { date: '04/10', revenue: 8800, orders: 45 },
    { date: '05/10', revenue: 11500, orders: 62 },
    { date: '06/10', revenue: 12300, orders: 68 },
    { date: '07/10', revenue: 9800, orders: 51 }
  ];

  recentActivities = [
    { type: 'order', message: 'Nouvelle commande #CMD-2160 - Table 15', time: 'Il y a 2 min', icon: 'shopping-cart', color: 'text-blue-600' },
    { type: 'employee', message: 'Sophie Laurent a pris un congé', time: 'Il y a 15 min', icon: 'users', color: 'text-orange-600' },
    { type: 'stock', message: 'Stock faible: Château Margaux 2015', time: 'Il y a 1h', icon: 'alert-circle', color: 'text-red-600' },
    { type: 'payment', message: 'Paiement reçu - Commande #CMD-2158', time: 'Il y a 2h', icon: 'check-circle', color: 'text-green-600' },
    { type: 'reservation', message: 'Nouvelle réservation VIP - Table 10', time: 'Il y a 3h', icon: 'calendar', color: 'text-purple-600' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialisation
  }

  ngAfterViewInit(): void {
    // Initialiser les icônes Lucide
    setTimeout(() => {
      lucide.createIcons();
    }, 0);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    // Re-initialiser les icônes après changement de tab
    setTimeout(() => {
      lucide.createIcons();
    }, 0);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Actif': return 'bg-green-100 text-green-700';
      case 'Inactif': return 'bg-gray-100 text-gray-700';
      case 'En congé': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getRoleColor(role: string): string {
    switch(role) {
      case 'Manager': return 'bg-purple-100 text-purple-700';
      case 'Serveuse':
      case 'Serveur': return 'bg-blue-100 text-blue-700';
      case 'Barman': return 'bg-green-100 text-green-700';
      case 'Cuisinier': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getOrderStatusClass(status: string): string {
    switch(status) {
      case 'En cours': return 'bg-blue-100 text-blue-700';
      case 'Terminée': return 'bg-green-100 text-green-700';
      case 'Payée': return 'bg-purple-100 text-purple-700';
      case 'Annulée': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStockStatus(stock: number): { label: string; class: string } {
    if (stock < 15) return { label: 'Stock Faible', class: 'bg-red-100 text-red-700' };
    if (stock < 30) return { label: 'Stock Moyen', class: 'bg-orange-100 text-orange-700' };
    return { label: 'En Stock', class: 'bg-green-100 text-green-700' };
  }

  openAddEmployeeModal(): void {
    this.showAddEmployeeModal = true;
    this.selectedEmployee = null;
  }

  openEditEmployeeModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showAddEmployeeModal = true;
  }

  closeEmployeeModal(): void {
    this.showAddEmployeeModal = false;
    this.selectedEmployee = null;
  }

  saveEmployee(): void {
    // Logique de sauvegarde
    this.closeEmployeeModal();
  }

  deleteEmployee(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employees = this.employees.filter(e => e.id !== id);
    }
  }

  openAddWineModal(): void {
    this.showAddWineModal = true;
    this.selectedWine = null;
  }

  openEditWineModal(wine: Wine): void {
    this.selectedWine = wine;
    this.showAddWineModal = true;
  }

  closeWineModal(): void {
    this.showAddWineModal = false;
    this.selectedWine = null;
  }

  saveWine(): void {
    // Logique de sauvegarde
    this.closeWineModal();
  }

  deleteWine(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vin ?')) {
      this.wines = this.wines.filter(w => w.id !== id);
    }
  }

  getTotalRevenue(): number {
    return this.orders.filter(o => o.status === 'Payée').reduce((sum, o) => sum + o.total, 0);
  }

  getAverageOrderValue(): number {
    const paidOrders = this.orders.filter(o => o.status === 'Payée');
    return paidOrders.length > 0 ? this.getTotalRevenue() / paidOrders.length : 0;
  }

  exportData(type: string): void {
    alert(`Export de ${type} en cours...`);
    // Logique d'export
  }
}


