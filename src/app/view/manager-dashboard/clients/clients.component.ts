// ===== clients.component.ts =====
/*
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  searchQuery: string = '';
  selectedType: string = 'all';
  showAddModal: boolean = false;

  clientsData: Client[] = [
    {
      id: 'cl-1',
      nom: 'Koffi Mensah',
      prenom: 'Emmanuel',
      telephone: '+225 07 12 34 56 78',
      email: 'koffi.mensah@email.com',
      adresse: 'Cocody, Abidjan',
      ville: 'Abidjan',
      dateInscription: new Date('2024-01-15'),
      type: 'vip',
      pointsFidelite: 1250,
      totalAchats: 2850000,
      nombreCommandes: 45,
      derniereCommande: new Date('2025-10-08')
    },
    {
      id: 'cl-2',
      nom: 'Aminata Diallo',
      prenom: 'Fatoumata',
      telephone: '+225 05 98 76 54 32',
      email: 'aminata.diallo@email.com',
      adresse: 'Plateau, Abidjan',
      ville: 'Abidjan',
      dateInscription: new Date('2024-03-20'),
      type: 'premium',
      pointsFidelite: 890,
      totalAchats: 1680000,
      nombreCommandes: 32,
      derniereCommande: new Date('2025-10-07')
    },
    {
      id: 'cl-3',
      nom: 'Ibrahim Cisse',
      prenom: 'Moussa',
      telephone: '+225 01 23 45 67 89',
      email: 'ibrahim.cisse@email.com',
      adresse: 'Marcory, Abidjan',
      ville: 'Abidjan',
      dateInscription: new Date('2024-06-10'),
      type: 'regulier',
      pointsFidelite: 450,
      totalAchats: 780000,
      nombreCommandes: 18,
      derniereCommande: new Date('2025-10-05')
    },
    {
      id: 'cl-4',
      nom: 'Fatou Ndiaye',
      prenom: 'Aïcha',
      telephone: '+225 07 55 44 33 22',
      email: 'fatou.ndiaye@email.com',
      adresse: 'Yopougon, Abidjan',
      ville: 'Abidjan',
      dateInscription: new Date('2025-09-01'),
      type: 'standard',
      pointsFidelite: 120,
      totalAchats: 185000,
      nombreCommandes: 5,
      derniereCommande: new Date('2025-10-06')
    }
  ];

  ngOnInit(): void {
    console.log('Clients page loaded');
  }

  get filteredClients(): Client[] {
    let filtered = this.clientsData;

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.nom.toLowerCase().includes(query) ||
        c.prenom?.toLowerCase().includes(query) ||
        c.telephone.includes(query) ||
        c.email?.toLowerCase().includes(query)
      );
    }

    if (this.selectedType !== 'all') {
      filtered = filtered.filter(c => c.type === this.selectedType);
    }

    return filtered;
  }

  getClientCount(type: string): number {
    if (type === 'all') return this.clientsData.length;
    return this.clientsData.filter(c => c.type === type).length;
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getClientBadgeClass(type: string): string {
    const classes = {
      'vip': 'badge-vip',
      'premium': 'badge-premium',
      'regulier': 'badge-regulier',
      'standard': 'badge-standard'
    };
    return classes[type as keyof typeof classes] || 'badge-standard';
  }

  getClientBadgeIcon(type: string): string {
    const icons = {
      'vip': '👑',
      'premium': '⭐',
      'regulier': '💎',
      'standard': '👤'
    };
    return icons[type as keyof typeof icons] || '👤';
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  viewClientDetails(clientId: string): void {
    console.log('View details for client:', clientId);
  }
}
*/
