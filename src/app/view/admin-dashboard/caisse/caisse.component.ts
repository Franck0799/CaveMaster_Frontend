import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// ===== INTERFACES =====

interface Manager {
  id: string;
  nom: string;
  cave: string;
  caveAdresse: string;
  avatar: string;
  statut: 'actif' | 'inactif' | 'absent';
}

interface Transaction {
  id: string;
  date: string;
  heure: string;
  type: 'vente' | 'remboursement' | 'ouverture' | 'fermeture';
  typeText: string;
  montant: number;
  moyenPaiement: 'especes' | 'Wave' | 'mobile' | 'credit';
  moyenPaiementText: string;
  client?: string;
  reference?: string;
  caissier: string;
  managerId: string;
  caveNom: string;
  details: string;
}

interface StatistiqueCaisse {
  managerId: string;
  totalJour: number;
  especes: number;
  wave: number;
  mobile: number;
  nombreTransactions: number;
  derniereMaj: string;
}

@Component({
  selector: 'app-caisse',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent implements OnInit {
  // Manager sélectionné
  selectedManagerId: string = 'mgr-1';

  // Date sélectionnée
  selectedDate: string = new Date().toISOString().split('T')[0];

  // Filtre des transactions
  currentTransactionFilter: string = 'all';

  // Vue: 'resume' ou 'details'
  currentView: 'resume' | 'details' = 'resume';

  // ===== DONNÉES DES MANAGERS =====
  managersData: Manager[] = [
    {
      id: 'mgr-1',
      nom: 'Jean Kouassi',
      cave: 'Cave Principale',
      caveAdresse: 'Lekki Phase 1, Abidjan',
      avatar: '👨‍💼',
      statut: 'actif'
    },
    {
      id: 'mgr-2',
      nom: 'Aminata Diallo',
      cave: 'Cave Grand Maitre',
      caveAdresse: 'Grand Maitre,Abidjan',
      avatar: '👩‍💼',
      statut: 'actif'
    },
    {
      id: 'mgr-3',
      nom: 'Ibrahim Cisse',
      cave: 'Cave Temple du repos',
      caveAdresse: 'Temple du repos, Abidjan',
      avatar: '👨‍💼',
      statut: 'actif'
    },
    {
      id: 'mgr-4',
      nom: 'Fatou Ndiaye',
      cave: 'Cave La cachette',
      caveAdresse: 'La cachette, Abidjan',
      avatar: '👩‍💼',
      statut: 'absent'
    }
  ];

  // ===== DONNÉES DES TRANSACTIONS =====
  transactionsData: Transaction[] = [
    // Transactions Manager 1 (Jean Kouassi - Cave Principale)
    {
      id: 'tr-1-1',
      date: '29/10/2025',
      heure: '14:30',
      type: 'vente',
      typeText: 'Vente',
      montant: 185000,
      moyenPaiement: 'Wave',
      moyenPaiementText: 'Wave ',
      client: 'Koffi Mensah',
      reference: 'CMD-2045',
      caissier: 'Alice Martin',
      managerId: 'mgr-1',
      caveNom: 'Cave Principale',
      details: '3x Dom Pérignon, 2x Hennessy VSOP'
    },
    {
      id: 'tr-1-2',
      date: '29/10/2025',
      heure: '13:30',
      type: 'vente',
      typeText: 'Vente',
      montant: 140000,
      moyenPaiement: 'mobile',
      moyenPaiementText: 'Paiement Mobile',
      client: 'Aminata Diallo',
      reference: 'CMD-2044',
      caissier: 'Grace Toure',
      managerId: 'mgr-1',
      caveNom: 'Cave Principale',
      details: '5x Château Margaux, 10x Heineken'
    },
    {
      id: 'tr-1-3',
      date: '29/10/2025',
      heure: '12:15',
      type: 'vente',
      typeText: 'Vente',
      montant: 75000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      client: 'Ibrahim Cisse',
      reference: 'CMD-2043',
      caissier: 'Alice Martin',
      managerId: 'mgr-1',
      caveNom: 'Cave Principale',
      details: '2x Moët & Chandon, 1x Whisky Premium'
    },
    {
      id: 'tr-1-4',
      date: '29/10/2025',
      heure: '10:30',
      type: 'remboursement',
      typeText: 'Remboursement',
      montant: -15000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      client: 'Client Anonyme',
      reference: 'RMB-001',
      caissier: 'Alice Martin',
      managerId: 'mgr-1',
      caveNom: 'Cave Principale',
      details: 'Retour produit défectueux'
    },
    {
      id: 'tr-1-5',
      date: '29/10/2025',
      heure: '08:00',
      type: 'ouverture',
      typeText: 'Ouverture Caisse',
      montant: 50000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Fond de Caisse',
      caissier: 'Alice Martin',
      managerId: 'mgr-1',
      caveNom: 'Cave Principale',
      details: 'Ouverture de caisse du jour'
    },

    // Transactions Manager 2 (Aminata Diallo - Cave Grand Maitre)
    {
      id: 'tr-2-1',
      date: '29/10/2025',
      heure: '15:45',
      type: 'vente',
      typeText: 'Vente',
      montant: 220000,
      moyenPaiement: 'Wave',
      moyenPaiementText: 'Wave',
      client: 'Youssef Ahmed',
      reference: 'CMD-3021',
      caissier: 'Mariam Sow',
      managerId: 'mgr-2',
      caveNom: 'Cave Grand Maitre',
      details: '10x Moët & Chandon, 5x Hennessy'
    },
    {
      id: 'tr-2-2',
      date: '29/10/2025',
      heure: '14:20',
      type: 'vente',
      typeText: 'Vente',
      montant: 95000,
      moyenPaiement: 'mobile',
      moyenPaiementText: 'Paiement Mobile',
      client: 'Sandra Obi',
      reference: 'CMD-3020',
      caissier: 'David Kone',
      managerId: 'mgr-2',
      caveNom: 'Cave Grand Maitre',
      details: '3x Champagne Rosé, 2x Vin Rouge'
    },
    {
      id: 'tr-2-3',
      date: '29/10/2025',
      heure: '11:30',
      type: 'vente',
      typeText: 'Vente',
      montant: 180000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      client: 'Chief Adebayo',
      reference: 'CMD-3019',
      caissier: 'Mariam Sow',
      managerId: 'mgr-2',
      caveNom: 'Cave Grand Maitre',
      details: '6x Dom Pérignon'
    },
    {
      id: 'tr-2-4',
      date: '29/10/2025',
      heure: '08:00',
      type: 'ouverture',
      typeText: 'Ouverture Caisse',
      montant: 75000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Fond de Caisse',
      caissier: 'Mariam Sow',
      managerId: 'mgr-2',
      caveNom: 'Cave Grand Maitre',
      details: 'Ouverture de caisse du jour'
    },

    // Transactions Manager 3 (Ibrahim Cisse - Cave Temple du repos)
    {
      id: 'tr-3-1',
      date: '29/10/2025',
      heure: '16:00',
      type: 'vente',
      typeText: 'Vente',
      montant: 310000,
      moyenPaiement: 'Wave',
      moyenPaiementText: 'Wave ',
      client: 'Mrs. Williams',
      reference: 'CMD-4015',
      caissier: 'Emma Sow',
      managerId: 'mgr-3',
      caveNom: 'Cave Temple du repos',
      details: '15x Vin Rouge Premium, 5x Champagne'
    },
    {
      id: 'tr-3-2',
      date: '29/10/2025',
      heure: '13:45',
      type: 'vente',
      typeText: 'Vente',
      montant: 125000,
      moyenPaiement: 'mobile',
      moyenPaiementText: 'Paiement Mobile',
      client: 'Ahmed Hassan',
      reference: 'CMD-4014',
      caissier: 'Frank Bamba',
      managerId: 'mgr-3',
      caveNom: 'Cave Temple du repos',
      details: '4x Hennessy VSOP, 3x Jack Daniels'
    },
    {
      id: 'tr-3-3',
      date: '29/10/2025',
      heure: '10:15',
      type: 'vente',
      typeText: 'Vente',
      montant: 65000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      client: 'Kunle Ajayi',
      reference: 'CMD-4013',
      caissier: 'Emma Sow',
      managerId: 'mgr-3',
      caveNom: 'Cave Temple du repos',
      details: '20x Heineken, 10x Soft Drinks'
    },
    {
      id: 'tr-3-4',
      date: '29/10/2025',
      heure: '08:30',
      type: 'ouverture',
      typeText: 'Ouverture Caisse',
      montant: 60000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Fond de Caisse',
      caissier: 'Emma Sow',
      managerId: 'mgr-3',
      caveNom: 'Cave Temple du repos',
      details: 'Ouverture de caisse du jour'
    }
  ];

  ngOnInit(): void {
    console.log('Caisse initialisé');
  }

  // ===== SÉLECTION MANAGER =====
  selectManager(managerId: string): void {
    this.selectedManagerId = managerId;
  }

  get selectedManager(): Manager | undefined {
    return this.managersData.find(m => m.id === this.selectedManagerId);
  }

  // ===== CHANGEMENT DE VUE =====
  switchView(view: 'resume' | 'details'): void {
    this.currentView = view;
  }

  // ===== FILTRAGE TRANSACTIONS =====
  filterTransactions(filter: string): void {
    this.currentTransactionFilter = filter;
  }

  get filteredTransactions(): Transaction[] {
    let filtered = this.transactionsData;

    // Filtre par manager
    filtered = filtered.filter(t => t.managerId === this.selectedManagerId);

    // Filtre par date
    filtered = filtered.filter(t => t.date === this.formatDate(this.selectedDate));

    // Filtre par type
    if (this.currentTransactionFilter !== 'all') {
      filtered = filtered.filter(t => t.type === this.currentTransactionFilter);
    }

    return filtered;
  }

  // ===== STATISTIQUES =====
  get statistiquesManager(): StatistiqueCaisse {
    const transactions = this.filteredTransactions;
    const positives = transactions.filter(t => t.montant > 0);

    return {
      managerId: this.selectedManagerId,
      totalJour: transactions.reduce((sum, t) => sum + t.montant, 0),
      especes: positives.filter(t => t.moyenPaiement === 'especes').reduce((sum, t) => sum + t.montant, 0),
      wave: positives.filter(t => t.moyenPaiement === 'Wave').reduce((sum, t) => sum + t.montant, 0),
      mobile: positives.filter(t => t.moyenPaiement === 'mobile').reduce((sum, t) => sum + t.montant, 0),
      nombreTransactions: transactions.length,
      derniereMaj: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  }

  get statistiquesGlobales() {
    const stats = this.managersData.map(manager => {
      const transactions = this.transactionsData.filter(
        t => t.managerId === manager.id && t.date === this.formatDate(this.selectedDate)
      );
      const positives = transactions.filter(t => t.montant > 0);

      return {
        managerId: manager.id,
        managerNom: manager.nom,
        cave: manager.cave,
        totalJour: transactions.reduce((sum, t) => sum + t.montant, 0),
        especes: positives.filter(t => t.moyenPaiement === 'especes').reduce((sum, t) => sum + t.montant, 0),
        Wave: positives.filter(t => t.moyenPaiement === 'Wave').reduce((sum, t) => sum + t.montant, 0),
        mobile: positives.filter(t => t.moyenPaiement === 'mobile').reduce((sum, t) => sum + t.montant, 0),
        nombreTransactions: transactions.length
      };
    });

    return stats;
  }

  get totalGlobal(): number {
    return this.statistiquesGlobales.reduce((sum, s) => sum + s.totalJour, 0);
  }

  get totalEspecesGlobal(): number {
    return this.statistiquesGlobales.reduce((sum, s) => sum + s.especes, 0);
  }

  get totalWaveGlobal(): number {
    return this.statistiquesGlobales.reduce((sum, s) => sum + s.Wave, 0);
  }

  get totalMobileGlobal(): number {
    return this.statistiquesGlobales.reduce((sum, s) => sum + s.mobile, 0);
  }

  // ===== COMPTAGE =====
  getTransactionCount(type: string): number {
    let transactions = this.transactionsData.filter(
      t => t.managerId === this.selectedManagerId && t.date === this.formatDate(this.selectedDate)
    );

    if (type === 'all') {
      return transactions.length;
    }
    return transactions.filter(t => t.type === type).length;
  }

  // ===== FORMATAGE =====
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(Math.abs(montant)) + ' FCFA';
  }

  // ===== MÉTHODES UTILITAIRES =====
  getManagerById(managerId: string): Manager | undefined {
    return this.managersData.find(m => m.id === managerId);
  }

  getManagerAvatar(managerId: string): string {
    return this.getManagerById(managerId)?.avatar || '👤';
  }

  getManagerStatut(managerId: string): string {
    return this.getManagerById(managerId)?.statut || 'inactif';
  }

  // ===== ACTIONS =====
  exporterRapport(): void {
    alert('Export du rapport en PDF/Excel...');
  }

  envoyerNotification(managerId: string): void {
    const manager = this.managersData.find(m => m.id === managerId);
    alert(`Notification envoyée à ${manager?.nom}`);
  }

  fermerCaisse(managerId: string): void {
    const manager = this.managersData.find(m => m.id === managerId);
    if (confirm(`Êtes-vous sûr de vouloir fermer la caisse de ${manager?.nom} ?`)) {
      alert('Caisse fermée avec succès');
    }
  }
}
