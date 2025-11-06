// ==========================================
// CUSTOMERS COMPONENT (Gestion clients)
// =============================import { Component, OnInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: Date;
  favoriteWine?: string;
  vipStatus: boolean;
  notes?: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./customers.component.html`,
  styleUrls: [`./customers.component.scss`]
})
export class CustomersComponent implements OnInit {
  filterType = 'all';
  searchTerm = '';

  customers: Customer[] = [
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      totalVisits: 24,
      totalSpent: 3450,
      lastVisit: new Date('2025-01-05'),
      favoriteWine: 'Château Margaux',
      vipStatus: true,
      notes: 'Préfère les vins rouges de Bordeaux'
    },
    {
      id: '2',
      name: 'Marie Leblanc',
      email: 'marie.leblanc@email.com',
      phone: '+33 6 23 45 67 89',
      totalVisits: 15,
      totalSpent: 2150,
      lastVisit: new Date('2025-01-04'),
      favoriteWine: 'Moët & Chandon',
      vipStatus: false
    },
    {
      id: '3',
      name: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      phone: '+33 6 34 56 78 90',
      totalVisits: 32,
      totalSpent: 4890,
      lastVisit: new Date('2025-01-06'),
      favoriteWine: 'Dom Pérignon',
      vipStatus: true,
      notes: 'Célèbre souvent des événements spéciaux'
    },
    {
      id: '4',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@email.com',
      phone: '+33 6 45 67 89 01',
      totalVisits: 8,
      totalSpent: 890,
      lastVisit: new Date('2024-12-28'),
      vipStatus: false
    },
    {
      id: '5',
      name: 'Luc Dubois',
      email: 'luc.dubois@email.com',
      phone: '+33 6 56 78 90 12',
      totalVisits: 18,
      totalSpent: 2680,
      lastVisit: new Date('2025-01-03'),
      favoriteWine: 'Châteauneuf-du-Pape',
      vipStatus: true
    }
  ];

  filteredCustomers: Customer[] = [];

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
  }

  filterCustomers(type: string): void {
    this.filterType = type;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.customers;

    // Filtre par type
    if (this.filterType === 'vip') {
      filtered = filtered.filter(c => c.vipStatus);
    } else if (this.filterType === 'regular') {
      filtered = filtered.filter(c => c.totalVisits >= 5);
    }

    // Recherche
    if (this.searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredCustomers = filtered;
  }

  getVipCount(): number {
    return this.customers.filter(c => c.vipStatus).length;
  }

  getTotalRevenue(): number {
    return this.customers.reduce((sum, c) => sum + c.totalSpent, 0);
  }

  getAverageSpent(): number {
    if (this.customers.length === 0) return 0;
    return this.getTotalRevenue() / this.customers.length;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  addCustomer(): void {
    console.log('Ajouter un client');
  }

  viewCustomer(customer: Customer): void {
    console.log('Voir client:', customer);
  }

  editCustomer(customer: Customer): void {
    console.log('Modifier client:', customer);
  }

  contactCustomer(customer: Customer): void {
    console.log('Contacter client:', customer);
  }

  exportCustomers(): void {
    console.log('Exporter la base clients');
  }
}
