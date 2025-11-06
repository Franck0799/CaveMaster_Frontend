import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';

interface DashboardStats {
  totalSales: number;
  todaySales: number;
  ordersInProgress: number;
  teamPresent: number;
  totalTeam: number;
  stockAlerts: number;
  averageTicket: number;
  customerSatisfaction: number;
}

interface RecentOrder {
  id: string;
  tableNumber: string;
  server: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed';
  time: string;
}

interface StockAlert {
  productName: string;
  currentStock: number;
  minStock: number;
  category: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  status: 'present' | 'absent' | 'break';
  todaySales: number;
  ordersCompleted: number;
}

@Component({
  selector: 'app-home',
   standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  caveAssigned = 'Cave Bordeaux';
  currentDate = new Date();

  // Statistiques principales
  stats: DashboardStats = {
    totalSales: 12450,
    todaySales: 3240,
    ordersInProgress: 8,
    teamPresent: 4,
    totalTeam: 6,
    stockAlerts: 3,
    averageTicket: 45.50,
    customerSatisfaction: 4.7
  };

  // Commandes récentes
  recentOrders: RecentOrder[] = [
    { id: 'CMD001', tableNumber: 'T12', server: 'Marie M.', amount: 89.50, status: 'in-progress', time: '14:23' },
    { id: 'CMD002', tableNumber: 'T05', server: 'Pierre D.', amount: 125.00, status: 'pending', time: '14:30' },
    { id: 'CMD003', tableNumber: 'T08', server: 'Sophie L.', amount: 67.80, status: 'completed', time: '14:15' },
    { id: 'CMD004', tableNumber: 'T15', server: 'Marie M.', amount: 95.20, status: 'in-progress', time: '14:35' }
  ];

  // Alertes de stock
  stockAlerts: StockAlert[] = [
    { productName: 'Château Margaux 2015', currentStock: 2, minStock: 5, category: 'Vin Rouge' },
    { productName: 'Moët & Chandon Brut', currentStock: 1, minStock: 3, category: 'Champagne' },
    { productName: 'Whisky Glenfiddich 18', currentStock: 0, minStock: 2, category: 'Spiritueux' }
  ];

  // Membres de l'équipe
  teamMembers: TeamMember[] = [
    { id: '1', name: 'Marie Martin', avatar: '👩', status: 'present', todaySales: 890, ordersCompleted: 12 },
    { id: '2', name: 'Pierre Dubois', avatar: '👨', status: 'present', todaySales: 1240, ordersCompleted: 18 },
    { id: '3', name: 'Sophie Laurent', avatar: '👩', status: 'break', todaySales: 670, ordersCompleted: 9 },
    { id: '4', name: 'Thomas Bernard', avatar: '👨', status: 'present', todaySales: 440, ordersCompleted: 6 }
  ];

  // Graphique des ventes (données simulées)
  salesChartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    values: [2100, 2450, 2890, 3100, 3560, 4200, 3890]
  };

  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // TODO: Charger les données depuis l'API
    console.log('Chargement des données du dashboard...');
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'warning',
      'in-progress': 'info',
      'completed': 'success',
      'present': 'success',
      'absent': 'danger',
      'break': 'warning'
    };
    return colors[status] || 'secondary';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'in-progress': 'En cours',
      'completed': 'Terminé',
      'present': 'Présent',
      'absent': 'Absent',
      'break': 'Pause'
    };
    return labels[status] || status;
  }

  refreshData(): void {
    console.log('Actualisation des données...');
    this.loadDashboardData();
  }

  viewAllOrders(): void {
    console.log('Navigation vers toutes les commandes');
  }

  viewAllStock(): void {
    console.log('Navigation vers le stock');
  }

  viewTeam(): void {
    console.log('Navigation vers l\'équipe');
  }
}
