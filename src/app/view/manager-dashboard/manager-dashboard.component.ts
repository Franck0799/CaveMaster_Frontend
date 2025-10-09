import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ===== INTERFACES =====

interface TeamMember {
  name: string;
  position: string;
  avatar: string;
  status: 'en-service' | 'pause' | 'pas-service' | 'conge';
  statusText: string;
  heureDebut: string;
  tempsTravail: string;
  pauseRestante: string;
}

interface Order {
  id: string;
  status: 'paye' | 'en-cours' | 'termine';
  statusText: string;
  client: string;
  date: string;
  produits: string;
  total: string;
}

// Interface pour une cave
interface Cave {
  id: string;
  nom: string;
  adresse: string;
  responsable: string;
  capacite: number;
  stockActuel: number;
}

// Interface pour une boisson
interface Boisson {
  id: string;
  nom: string;
  categorie: 'champagne' | 'vin' | 'spiritueux' | 'biere' | 'soft';
  prixUnitaire: number;
  seuilAlerte: number;
  stocks: { // Stock par cave
    [caveId: string]: number;
  };
}

// Interface pour un mouvement de stock
interface MouvementStock {
  id: string;
  date: string;
  heure: string;
  type: 'entree' | 'sortie' | 'transfert' | 'perte';
  typeText: string;
  boissonId: string;
  boissonNom: string;
  quantite: number;
  caveId: string;
  caveNom: string;
  motif: string;
  operateur: string;
}

// Interface pour une transaction de caisse
interface Transaction {
  id: string;
  date: string;
  heure: string;
  type: 'vente' | 'remboursement' | 'ouverture' | 'fermeture';
  typeText: string;
  montant: number;
  moyenPaiement: 'especes' | 'carte' | 'mobile' | 'credit';
  moyenPaiementText: string;
  client?: string;
  reference?: string;
  caissier: string;
  details: string;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule pour ngModel
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  activeTab: string = 'dashboard';
  showUserDropdown: boolean = false;
  currentOrderFilter: string = 'all';

  // ===== NOUVELLES PROPRIÉTÉS POUR STOCK =====
  selectedCaveId: string = 'cave-1'; // Cave sélectionnée par défaut
  currentStockFilter: string = 'all'; // Filtre pour les boissons (all, alerte, ok)
  searchStock: string = ''; // Recherche de boissons

  // ===== NOUVELLES PROPRIÉTÉS POUR CAISSE =====
  selectedDate: string = new Date().toISOString().split('T')[0]; // Date du jour
  currentCaisseFilter: string = 'all'; // Filtre transactions (all, vente, remboursement)

  // Données existantes
  teamData: TeamMember[] = [
    {
      name: 'Alice Martin',
      position: 'Caissière',
      avatar: '👩',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '08:00',
      tempsTravail: '5h 30min',
      pauseRestante: '30min'
    },
    {
      name: 'Bob Traore',
      position: 'Magasinier',
      avatar: '👨',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '08:00',
      tempsTravail: '5h 45min',
      pauseRestante: '15min'
    },
    {
      name: 'Claire Diop',
      position: 'Vendeuse',
      avatar: '👩',
      status: 'pause',
      statusText: 'En pause',
      heureDebut: '09:00',
      tempsTravail: '4h 30min',
      pauseRestante: '0min (pause)'
    },
    {
      name: 'David Kone',
      position: 'Livreur',
      avatar: '👨',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '07:00',
      tempsTravail: '6h 45min',
      pauseRestante: '45min'
    },
    {
      name: 'Emma Sow',
      position: 'Assistante',
      avatar: '👩',
      status: 'pause',
      statusText: 'En pause',
      heureDebut: '08:30',
      tempsTravail: '5h 00min',
      pauseRestante: '0min (pause)'
    },
    {
      name: 'Frank Bamba',
      position: 'Vendeur',
      avatar: '👨',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '10:00',
      tempsTravail: '3h 45min',
      pauseRestante: '1h 00min'
    },
    {
      name: 'Grace Toure',
      position: 'Caissière',
      avatar: '👩',
      status: 'pause',
      statusText: 'En pause',
      heureDebut: '09:00',
      tempsTravail: '4h 30min',
      pauseRestante: '0min (pause)'
    },
    {
      name: 'Henri Camara',
      position: 'Magasinier',
      avatar: '👨',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '08:00',
      tempsTravail: '5h 45min',
      pauseRestante: '15min'
    },
    {
      name: 'Iris Sylla',
      position: 'Vendeuse',
      avatar: '👩',
      status: 'pas-service',
      statusText: 'Pas en service',
      heureDebut: '16:00',
      tempsTravail: '0h 00min',
      pauseRestante: 'N/A'
    },
    {
      name: 'Julie Sanogo',
      position: 'Caissière',
      avatar: '👩',
      status: 'pas-service',
      statusText: 'Pas en service',
      heureDebut: '18:00',
      tempsTravail: '0h 00min',
      pauseRestante: 'N/A'
    },
    {
      name: 'Kevin Ouattara',
      position: 'Vendeur',
      avatar: '👨',
      status: 'conge',
      statusText: 'En congé',
      heureDebut: '-',
      tempsTravail: '-',
      pauseRestante: 'Retour: 15/10'
    },
    {
      name: 'Laura Koffi',
      position: 'Assistante',
      avatar: '👩',
      status: 'conge',
      statusText: 'En congé',
      heureDebut: '-',
      tempsTravail: '-',
      pauseRestante: 'Retour: 12/10'
    }
  ];

  ordersData: Order[] = [
    {
      id: '#CMD-2045',
      status: 'paye',
      statusText: 'Payé',
      client: 'Koffi Mensah',
      date: '07/10/2025 13:45',
      produits: '3x Dom Pérignon, 2x Hennessy VSOP',
      total: '185 000 FCFA'
    },
    {
      id: '#CMD-2044',
      status: 'en-cours',
      statusText: 'En cours',
      client: 'Aminata Diallo',
      date: '07/10/2025 13:30',
      produits: '5x Château Margaux, 10x Heineken',
      total: '140 000 FCFA'
    },
    {
      id: '#CMD-2043',
      status: 'termine',
      statusText: 'Terminé',
      client: 'Ibrahim Cisse',
      date: '07/10/2025 12:15',
      produits: '2x Moët & Chandon, 1x Whisky Premium',
      total: '75 000 FCFA'
    },
    {
      id: '#CMD-2042',
      status: 'paye',
      statusText: 'Payé',
      client: 'Fatou Ndiaye',
      date: '07/10/2025 11:50',
      produits: '20x Red Bull, 15x Bières locales',
      total: '28 500 FCFA'
    },
    {
      id: '#CMD-2041',
      status: 'en-cours',
      statusText: 'En cours',
      client: 'Moussa Traore',
      date: '07/10/2025 11:20',
      produits: '8x Vin Rouge, 5x Vin Blanc',
      total: '195 000 FCFA'
    },
    {
      id: '#CMD-2040',
      status: 'termine',
      statusText: 'Terminé',
      client: 'Aisha Bamba',
      date: '07/10/2025 10:45',
      produits: '1x Dom Pérignon, 2x Champagne Rosé',
      total: '98 000 FCFA'
    },
    {
      id: '#CMD-2039',
      status: 'paye',
      statusText: 'Payé',
      client: 'Sekou Keita',
      date: '07/10/2025 10:10',
      produits: '6x Hennessy VSOP, 3x Whisky',
      total: '250 000 FCFA'
    },
    {
      id: '#CMD-2038',
      status: 'en-cours',
      statusText: 'En cours',
      client: 'Mariam Sow',
      date: '07/10/2025 09:30',
      produits: '4x Moët & Chandon, 2x Vin Mousseux',
      total: '112 000 FCFA'
    }
  ];

  // ===== DONNÉES DES CAVES =====
  cavesData: Cave[] = [
    {
      id: 'cave-1',
      nom: 'Cave Principale',
      adresse: 'Lekki Phase 1, Lagos',
      responsable: 'Jean Kouassi',
      capacite: 5000,
      stockActuel: 3847
    },
    {
      id: 'cave-2',
      nom: 'Cave Victoria Island',
      adresse: 'Victoria Island, Lagos',
      responsable: 'Aminata Diallo',
      capacite: 3000,
      stockActuel: 2156
    },
    {
      id: 'cave-3',
      nom: 'Cave Ikoyi',
      adresse: 'Ikoyi, Lagos',
      responsable: 'Ibrahim Cisse',
      capacite: 2000,
      stockActuel: 1523
    }
  ];

  // ===== DONNÉES DES BOISSONS =====
  boissonsData: Boisson[] = [
    {
      id: 'b-1',
      nom: 'Dom Pérignon',
      categorie: 'champagne',
      prixUnitaire: 45000,
      seuilAlerte: 10,
      stocks: {
        'cave-1': 8,
        'cave-2': 15,
        'cave-3': 5
      }
    },
    {
      id: 'b-2',
      nom: 'Moët & Chandon',
      categorie: 'champagne',
      prixUnitaire: 35000,
      seuilAlerte: 15,
      stocks: {
        'cave-1': 22,
        'cave-2': 18,
        'cave-3': 12
      }
    },
    {
      id: 'b-3',
      nom: 'Hennessy VSOP',
      categorie: 'spiritueux',
      prixUnitaire: 28000,
      seuilAlerte: 20,
      stocks: {
        'cave-1': 3,
        'cave-2': 25,
        'cave-3': 8
      }
    },
    {
      id: 'b-4',
      nom: 'Château Margaux',
      categorie: 'vin',
      prixUnitaire: 18000,
      seuilAlerte: 15,
      stocks: {
        'cave-1': 12,
        'cave-2': 20,
        'cave-3': 15
      }
    },
    {
      id: 'b-5',
      nom: 'Heineken',
      categorie: 'biere',
      prixUnitaire: 800,
      seuilAlerte: 100,
      stocks: {
        'cave-1': 250,
        'cave-2': 180,
        'cave-3': 90
      }
    },
    {
      id: 'b-6',
      nom: 'Coca-Cola',
      categorie: 'soft',
      prixUnitaire: 500,
      seuilAlerte: 150,
      stocks: {
        'cave-1': 320,
        'cave-2': 280,
        'cave-3': 150
      }
    },
    {
      id: 'b-7',
      nom: 'Jack Daniels',
      categorie: 'spiritueux',
      prixUnitaire: 32000,
      seuilAlerte: 15,
      stocks: {
        'cave-1': 18,
        'cave-2': 12,
        'cave-3': 6
      }
    },
    {
      id: 'b-8',
      nom: 'Champagne Rosé',
      categorie: 'champagne',
      prixUnitaire: 42000,
      seuilAlerte: 10,
      stocks: {
        'cave-1': 14,
        'cave-2': 9,
        'cave-3': 7
      }
    }
  ];

  // ===== DONNÉES DES MOUVEMENTS DE STOCK =====
  mouvementsStockData: MouvementStock[] = [
    {
      id: 'mv-1',
      date: '09/10/2025',
      heure: '14:30',
      type: 'sortie',
      typeText: 'Sortie (Vente)',
      boissonId: 'b-3',
      boissonNom: 'Hennessy VSOP',
      quantite: 2,
      caveId: 'cave-1',
      caveNom: 'Cave Principale',
      motif: 'Vente CMD-2045',
      operateur: 'Alice Martin'
    },
    {
      id: 'mv-2',
      date: '09/10/2025',
      heure: '13:45',
      type: 'entree',
      typeText: 'Entrée (Livraison)',
      boissonId: 'b-5',
      boissonNom: 'Heineken',
      quantite: 100,
      caveId: 'cave-1',
      caveNom: 'Cave Principale',
      motif: 'Réapprovisionnement fournisseur',
      operateur: 'Bob Traore'
    },
    {
      id: 'mv-3',
      date: '09/10/2025',
      heure: '12:15',
      type: 'transfert',
      typeText: 'Transfert',
      boissonId: 'b-1',
      boissonNom: 'Dom Pérignon',
      quantite: 5,
      caveId: 'cave-2',
      caveNom: 'Cave Victoria Island',
      motif: 'Transfert vers Cave Principale',
      operateur: 'Henri Camara'
    },
    {
      id: 'mv-4',
      date: '09/10/2025',
      heure: '11:00',
      type: 'perte',
      typeText: 'Perte/Casse',
      boissonId: 'b-2',
      boissonNom: 'Moët & Chandon',
      quantite: 1,
      caveId: 'cave-1',
      caveNom: 'Cave Principale',
      motif: 'Bouteille cassée lors manipulation',
      operateur: 'Bob Traore'
    },
    {
      id: 'mv-5',
      date: '08/10/2025',
      heure: '16:20',
      type: 'sortie',
      typeText: 'Sortie (Vente)',
      boissonId: 'b-4',
      boissonNom: 'Château Margaux',
      quantite: 5,
      caveId: 'cave-1',
      caveNom: 'Cave Principale',
      motif: 'Vente CMD-2041',
      operateur: 'Grace Toure'
    }
  ];

  // ===== DONNÉES DES TRANSACTIONS CAISSE =====
  transactionsData: Transaction[] = [
    {
      id: 'tr-1',
      date: '09/10/2025',
      heure: '14:30',
      type: 'vente',
      typeText: 'Vente',
      montant: 185000,
      moyenPaiement: 'carte',
      moyenPaiementText: 'Carte Bancaire',
      client: 'Koffi Mensah',
      reference: 'CMD-2045',
      caissier: 'Alice Martin',
      details: '3x Dom Pérignon, 2x Hennessy VSOP'
    },
    {
      id: 'tr-2',
      date: '09/10/2025',
      heure: '13:30',
      type: 'vente',
      typeText: 'Vente',
      montant: 140000,
      moyenPaiement: 'mobile',
      moyenPaiementText: 'Paiement Mobile',
      client: 'Aminata Diallo',
      reference: 'CMD-2044',
      caissier: 'Grace Toure',
      details: '5x Château Margaux, 10x Heineken'
    },
    {
      id: 'tr-3',
      date: '09/10/2025',
      heure: '12:15',
      type: 'vente',
      typeText: 'Vente',
      montant: 75000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      client: 'Ibrahim Cisse',
      reference: 'CMD-2043',
      caissier: 'Alice Martin',
      details: '2x Moët & Chandon, 1x Whisky Premium'
    },
    {
      id: 'tr-4',
      date: '09/10/2025',
      heure: '11:50',
      type: 'vente',
      typeText: 'Vente',
      montant: 28500,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      client: 'Fatou Ndiaye',
      reference: 'CMD-2042',
      caissier: 'Grace Toure',
      details: '20x Red Bull, 15x Bières locales'
    },
    {
      id: 'tr-5',
      date: '09/10/2025',
      heure: '10:30',
      type: 'remboursement',
      typeText: 'Remboursement',
      montant: -15000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Espèces',
      client: 'Client Anonyme',
      reference: 'RMB-001',
      caissier: 'Alice Martin',
      details: 'Retour produit défectueux'
    },
    {
      id: 'tr-6',
      date: '09/10/2025',
      heure: '08:00',
      type: 'ouverture',
      typeText: 'Ouverture Caisse',
      montant: 50000,
      moyenPaiement: 'especes',
      moyenPaiementText: 'Fond de Caisse',
      caissier: 'Alice Martin',
      details: 'Ouverture de caisse du jour'
    }
  ];

  ngOnInit(): void {
    console.log('Dashboard initialisé');
  }

  // ===== MÉTHODES EXISTANTES =====

  navigateTo(page: string): void {
    this.activeTab = page;
    this.showUserDropdown = false;
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown(): void {
    this.showUserDropdown = false;
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      alert('Déconnexion en cours...');
    }
  }

  filterOrders(filter: string): void {
    this.currentOrderFilter = filter;
  }

  get filteredOrders(): Order[] {
    if (this.currentOrderFilter === 'all') {
      return this.ordersData;
    }
    return this.ordersData.filter(order => order.status === this.currentOrderFilter);
  }

  getOrderCount(status: string): number {
    if (status === 'all') {
      return this.ordersData.length;
    }
    return this.ordersData.filter(order => order.status === status).length;
  }

  // ===== NOUVELLES MÉTHODES POUR STOCK =====

  // Change la cave sélectionnée
  selectCave(caveId: string): void {
    this.selectedCaveId = caveId;
  }

  // Retourne la cave actuellement sélectionnée
  get selectedCave(): Cave | undefined {
    return this.cavesData.find(cave => cave.id === this.selectedCaveId);
  }

  // Filtre les boissons selon le statut du stock
  filterStock(filter: string): void {
    this.currentStockFilter = filter;
  }

  // Retourne les boissons filtrées avec recherche et statut
  get filteredBoissons(): Boisson[] {
    let filtered = this.boissonsData;

    // Filtre par recherche
    if (this.searchStock.trim()) {
      const search = this.searchStock.toLowerCase();
      filtered = filtered.filter(b =>
        b.nom.toLowerCase().includes(search) ||
        b.categorie.toLowerCase().includes(search)
      );
    }

    // Filtre par statut
    if (this.currentStockFilter === 'alerte') {
      filtered = filtered.filter(b =>
        b.stocks[this.selectedCaveId] <= b.seuilAlerte
      );
    } else if (this.currentStockFilter === 'ok') {
      filtered = filtered.filter(b =>
        b.stocks[this.selectedCaveId] > b.seuilAlerte
      );
    }

    return filtered;
  }

  // Compte les boissons par statut
  getStockCount(status: string): number {
    if (status === 'all') {
      return this.boissonsData.length;
    } else if (status === 'alerte') {
      return this.boissonsData.filter(b =>
        b.stocks[this.selectedCaveId] <= b.seuilAlerte
      ).length;
    } else {
      return this.boissonsData.filter(b =>
        b.stocks[this.selectedCaveId] > b.seuilAlerte
      ).length;
    }
  }

  // Vérifie si une boisson est en alerte dans la cave sélectionnée
  isStockAlerte(boisson: Boisson): boolean {
    return boisson.stocks[this.selectedCaveId] <= boisson.seuilAlerte;
  }

  // Retourne les mouvements de stock filtrés par cave
  get mouvementsForSelectedCave(): MouvementStock[] {
    return this.mouvementsStockData
      .filter(mv => mv.caveId === this.selectedCaveId)
      .slice(0, 10); // Limite aux 10 derniers
  }

  // ===== NOUVELLES MÉTHODES POUR CAISSE =====

  // Filtre les transactions
  filterCaisse(filter: string): void {
    this.currentCaisseFilter = filter;
  }

  // Retourne les transactions filtrées
  get filteredTransactions(): Transaction[] {
    let filtered = this.transactionsData;

    // Filtre par type
    if (this.currentCaisseFilter !== 'all') {
      filtered = filtered.filter(t => t.type === this.currentCaisseFilter);
    }

    // Filtre par date
    filtered = filtered.filter(t => t.date === this.formatDate(this.selectedDate));

    return filtered;
  }

  // Compte les transactions par type
  getCaisseCount(type: string): number {
    const dateFiltered = this.transactionsData.filter(t =>
      t.date === this.formatDate(this.selectedDate)
    );

    if (type === 'all') {
      return dateFiltered.length;
    }
    return dateFiltered.filter(t => t.type === type).length;
  }

  // Calcule le total des transactions
  get totalCaisse(): number {
    return this.filteredTransactions
      .reduce((sum, t) => sum + t.montant, 0);
  }

  // Calcule le total par moyen de paiement
  getTotalByPaymentMethod(method: string): number {
    return this.filteredTransactions
      .filter(t => t.moyenPaiement === method && t.montant > 0)
      .reduce((sum, t) => sum + t.montant, 0);
  }

  // Formate une date ISO en format DD/MM/YYYY
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Formate un montant en FCFA
  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(Math.abs(montant)) + ' FCFA';
  }
}
