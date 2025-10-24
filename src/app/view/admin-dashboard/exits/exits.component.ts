// ==========================================
// FICHIER: src/app/features/exits/exits.component.ts
// DESCRIPTION: Composant pour gérer les sorties de stock (ventes, transferts, pertes)
// ==========================================

import { Component, OnInit } from '@angular/core';

/**
 * Interface pour définir une boisson
 */
interface Drink {
  id: string;
  name: string;
  category: string;
  icon: string;
  price: number;
  stock: number;
  description?: string;
  sales?: number;
}

/**
 * Interface pour définir une cave
 */
interface Cave {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  description?: string;
}

/**
 * Interface pour définir une sortie de stock
 */
interface StockExit {
  id: string;
  drinkId: string;
  drinkName: string;
  quantity: number;
  date: Date;
  type: 'vente' | 'transfert' | 'perte';
  destination?: string;
  unitPrice: number;
  totalAmount: number;
  caveId: string;
  processedBy: string;
  notes?: string;
}

/**
 * Interface pour le formulaire de sortie
 */
interface StockExitForm {
  drinkId: string;
  quantity: number;
  type: 'vente' | 'transfert' | 'perte';
  unitPrice: number;
  caveId: string;
  destination: string;
  notes: string;
}

/**
 * Composant de gestion des sorties de stock
 * Permet d'enregistrer les ventes, transferts et pertes
 */
@Component({
  selector: 'app-exits',
  templateUrl: './exits.component.html',
  styleUrls: ['./exits.component.scss']
})
export class ExitsComponent implements OnInit {

  // ========================================
  // PROPRIÉTÉS
  // ========================================

  /**
   * Liste complète des sorties de stock
   */
  exits: StockExit[] = [];

  /**
   * Liste filtrée des sorties à afficher
   */
  filteredExits: StockExit[] = [];

  /**
   * Liste des boissons disponibles
   */
  drinks: Drink[] = [];

  /**
   * Liste des caves disponibles
   */
  caves: Cave[] = [];

  /**
   * Indicateur de chargement
   */
  isLoading: boolean = false;

  /**
   * Indique si le modal d'ajout est ouvert
   */
  isAddModalOpen: boolean = false;

  /**
   * Formulaire pour ajouter une sortie
   */
  exitForm: StockExitForm = this.getEmptyForm();

  /**
   * Filtre par cave sélectionnée
   */
  selectedCaveFilter: string | null = null;

  /**
   * Filtre par type de sortie
   */
  selectedTypeFilter: 'vente' | 'transfert' | 'perte' | null = null;

  /**
   * Filtre par période (jours)
   */
  periodFilter: number = 30;

  /**
   * Terme de recherche
   */
  searchTerm: string = '';

  /**
   * Statistiques des sorties
   */
  stats = {
    totalExits: 0,
    totalQuantity: 0,
    totalRevenue: 0,
    recentExits: 0
  };

  // ========================================
  // CONSTRUCTEUR
  // ========================================

  constructor() {}

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadData();
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  /**
   * Charge toutes les données nécessaires
   */
  loadData(): void {
    this.isLoading = true;

    // TODO: Appel API
    // Simulation avec des données de test
    this.drinks = this.generateMockDrinks();
    this.caves = this.generateMockCaves();
    this.exits = this.generateMockExits();

    this.filteredExits = [...this.exits];
    this.calculateStats();

    this.isLoading = false;
    console.log('Données chargées:', {
      exits: this.exits.length,
      drinks: this.drinks.length,
      caves: this.caves.length
    });
  }

  /**
   * Génère des boissons de test
   */
  private generateMockDrinks(): Drink[] {
    return [
      {
        id: 'drink_1',
        name: 'Bordeaux Rouge 2018',
        category: 'Vin Rouge',
        icon: '🍷',
        price: 15000,
        stock: 45,
        description: 'Vin rouge de Bordeaux'
      },
      {
        id: 'drink_2',
        name: 'Champagne Moët & Chandon',
        category: 'Champagne',
        icon: '🍾',
        price: 35000,
        stock: 20,
        description: 'Champagne brut impérial'
      },
      {
        id: 'drink_3',
        name: 'Heineken',
        category: 'Bières',
        icon: '🍺',
        price: 800,
        stock: 150,
        description: 'Bière blonde'
      },
      {
        id: 'drink_4',
        name: 'Chablis 2020',
        category: 'Vin Blanc',
        icon: '🍷',
        price: 12000,
        stock: 30,
        description: 'Vin blanc sec'
      }
    ];
  }

  /**
   * Génère des caves de test
   */
  private generateMockCaves(): Cave[] {
    return [
      {
        id: 'cave_1',
        name: 'Cave Principale',
        location: 'Bâtiment A - Sous-sol',
        capacity: 1000,
        currentStock: 650
      },
      {
        id: 'cave_2',
        name: 'Cave Secondaire',
        location: 'Bâtiment B - RDC',
        capacity: 500,
        currentStock: 320
      },
      {
        id: 'cave_3',
        name: 'Cave de Vieillissement',
        location: 'Bâtiment A - Niveau -2',
        capacity: 300,
        currentStock: 180
      }
    ];
  }

  /**
   * Génère des sorties de test
   */
  private generateMockExits(): StockExit[] {
     const now = new Date();
     const exits = [
      {
        id: 'exit_1',
        drinkId: 'drink_1',
        drinkName: 'Bordeaux Rouge 2018',
        quantity: 12,
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Hier
        type: 'vente',
        destination: 'Client VIP',
        unitPrice: 15000,
        totalAmount: 180000,
        caveId: 'cave_1',
        processedBy: 'user_1',
        notes: 'Vente premium'
      },
      {
        id: 'exit_2',
        drinkId: 'drink_2',
        drinkName: 'Champagne Moët & Chandon',
        quantity: 6,
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
        type: 'vente',
        destination: 'Événement entreprise',
        unitPrice: 35000,
        totalAmount: 210000,
        caveId: 'cave_3',
        processedBy: 'user_1',
        notes: 'Commande spéciale'
      },
      {
        id: 'exit_3',
        drinkId: 'drink_3',
        drinkName: 'Heineken',
        quantity: 50,
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
        type: 'vente',
        destination: 'Bar partenaire',
        unitPrice: 800,
        totalAmount: 40000,
        caveId: 'cave_2',
        processedBy: 'user_2',
        notes: 'Livraison hebdomadaire'
      },
      {
        id: 'exit_4',
        drinkId: 'drink_4',
        drinkName: 'Chablis 2020',
        quantity: 8,
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours
        type: 'transfert',
        destination: 'Cave Secondaire',
        unitPrice: 12000,
        totalAmount: 96000,
        caveId: 'cave_1',
        processedBy: 'user_1',
        notes: 'Réorganisation du stock'
      },
      {
        id: 'exit_5',
        drinkId: 'drink_1',
        drinkName: 'Bordeaux Rouge 2018',
        quantity: 2,
        date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
        type: 'perte',
        destination: 'N/A',
        unitPrice: 15000,
        totalAmount: 30000,
        caveId: 'cave_1',
        processedBy: 'user_2',
        notes: 'Bouteilles cassées lors du transport'
      },
      {
        id: 'exit_6',
        drinkId: 'drink_3',
        drinkName: 'Heineken',
        quantity: 80,
        date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), // Il y a 12 jours
        type: 'vente',
        destination: 'Restaurant Le Gourmet',
        unitPrice: 800,
        totalAmount: 64000,
        caveId: 'cave_2',
        processedBy: 'user_1',
        notes: 'Client régulier'
      }
    ] satisfies StockExit[]; // 👈 TypeScript valide les valeurs exactes

    return exits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ========================================
  // FILTRAGE
  // ========================================

  /**
   * Applique tous les filtres sur les sorties
   */
  applyFilters(): void {
    let result = [...this.exits];

    // Filtre par cave
    if (this.selectedCaveFilter) {
      result = result.filter(exit => exit.caveId === this.selectedCaveFilter);
    }

    // Filtre par type
    if (this.selectedTypeFilter) {
      result = result.filter(exit => exit.type === this.selectedTypeFilter);
    }

    // Filtre par période
    if (this.periodFilter) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.periodFilter);
      result = result.filter(exit => new Date(exit.date) >= cutoffDate);
    }

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(exit =>
        exit.drinkName.toLowerCase().includes(term) ||
        exit.destination?.toLowerCase().includes(term) ||
        exit.notes?.toLowerCase().includes(term)
      );
    }

    this.filteredExits = result;
    console.log('Filtres appliqués:', result.length, 'résultats');
  }

  /**
   * Gère le changement de filtre cave
   */
  onCaveFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Gère le changement de filtre type
   */
  onTypeFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Gère le changement de période
   */
  onPeriodFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Gère le changement de recherche
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedCaveFilter = null;
    this.selectedTypeFilter = null;
    this.periodFilter = 30;
    this.searchTerm = '';
    this.filteredExits = [...this.exits];
  }

  // ========================================
  // CALCUL DES STATISTIQUES
  // ========================================

  /**
   * Calcule les statistiques des sorties
   */
  calculateStats(): void {
    this.stats.totalExits = this.exits.length;
    this.stats.totalQuantity = this.exits.reduce((sum, exit) => sum + exit.quantity, 0);
    this.stats.totalRevenue = this.exits
      .filter(exit => exit.type === 'vente')
      .reduce((sum, exit) => sum + exit.totalAmount, 0);

    // Sorties des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.stats.recentExits = this.exits.filter(
      exit => new Date(exit.date) >= sevenDaysAgo
    ).length;
  }

  // ========================================
  // MODAL - AJOUT DE SORTIE
  // ========================================

  /**
   * Ouvre le modal d'ajout
   */
  openAddModal(): void {
    this.exitForm = this.getEmptyForm();
    this.isAddModalOpen = true;
  }

  /**
   * Ferme le modal
   */
  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.exitForm = this.getEmptyForm();
  }

  /**
   * Sauvegarde une nouvelle sortie
   */
  saveExit(): void {
    // Validation
    if (!this.validateForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Récupère la boisson
    const drink = this.drinks.find(d => d.id === this.exitForm.drinkId);
    if (!drink) {
      alert('Boisson non trouvée');
      return;
    }

    // Vérifie le stock disponible
    if (drink.stock < this.exitForm.quantity) {
      alert(`Stock insuffisant. Disponible: ${drink.stock} unités`);
      return;
    }

    // Calcule le montant total
    const totalAmount = this.exitForm.quantity * this.exitForm.unitPrice;

    // Crée la sortie
    const newExit: StockExit = {
      id: this.generateId(),
      drinkId: this.exitForm.drinkId,
      drinkName: drink.name,
      quantity: this.exitForm.quantity,
      date: new Date(),
      type: this.exitForm.type,
      destination: this.exitForm.destination,
      unitPrice: this.exitForm.unitPrice,
      totalAmount: totalAmount,
      caveId: this.exitForm.caveId,
      processedBy: 'current-user-id', // À remplacer par l'ID de l'utilisateur connecté
      notes: this.exitForm.notes
    };

    // Ajoute la sortie
    this.exits.unshift(newExit);
    this.applyFilters();
    this.calculateStats();

    // TODO: Appel API
    console.log('Sortie ajoutée:', newExit);

    alert('Sortie de stock enregistrée avec succès !');
    this.closeAddModal();
  }

  /**
   * Calcule le montant total en temps réel
   */
  calculateTotalAmount(): number {
    return (this.exitForm.quantity || 0) * (this.exitForm.unitPrice || 0);
  }

  /**
   * Valide le formulaire
   */
  private validateForm(): boolean {
    return !!(
      this.exitForm.drinkId &&
      this.exitForm.quantity > 0 &&
      this.exitForm.unitPrice > 0 &&
      this.exitForm.caveId &&
      this.exitForm.type
    );
  }

  /**
   * Retourne un formulaire vide
   */
  private getEmptyForm(): StockExitForm {
    return {
      drinkId: '',
      quantity: 0,
      type: 'vente',
      unitPrice: 0,
      caveId: '',
      destination: '',
      notes: ''
    };
  }

  // ========================================
  // ACTIONS
  // ========================================

  /**
   * Affiche les détails d'une sortie
   */
  viewExitDetails(exit: StockExit): void {
    // À implémenter
    console.log('Voir détails:', exit);
    alert(`Détails de la sortie:\n\nBoisson: ${exit.drinkName}\nQuantité: ${exit.quantity}\nType: ${this.getTypeLabel(exit.type)}\nMontant: ${this.formatNumber(exit.totalAmount)} FCFA`);
  }

  /**
   * Supprime une sortie après confirmation
   */
  deleteExit(exit: StockExit): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette sortie de "${exit.drinkName}" ?`)) {
      this.exits = this.exits.filter(e => e.id !== exit.id);
      this.applyFilters();
      this.calculateStats();

      // TODO: Appel API
      console.log('Sortie supprimée:', exit.id);

      alert('Sortie supprimée avec succès');
    }
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return `exit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Formate un nombre avec séparateurs
   */
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Formate une date au format français
   */
  formatDate(date: Date): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return d.toLocaleDateString('fr-FR', options);
  }

  /**
   * Retourne le nom d'une cave par son ID
   */
  getCaveName(caveId: string): string {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.name : 'Cave inconnue';
  }

  /**
   * Retourne le nom d'une boisson par son ID
   */
  getDrinkName(drinkId: string): string {
    const drink = this.drinks.find(d => d.id === drinkId);
    return drink ? drink.name : 'Boisson inconnue';
  }

  /**
   * Retourne la date relative (ex: "Il y a 2 jours")
   */
  getRelativeDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine(s)`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  }

  /**
   * Retourne le libellé d'un type de sortie
   */
  getTypeLabel(type: string): string {
    const labels: {[key: string]: string} = {
      'vente': 'Vente',
      'transfert': 'Transfert',
      'perte': 'Perte'
    };
    return labels[type] || type;
  }

  /**
   * Retourne la classe CSS pour un type de sortie
   */
  getTypeClass(type: string): string {
    const classes: {[key: string]: string} = {
      'vente': 'type-sale',
      'transfert': 'type-transfer',
      'perte': 'type-loss'
    };
    return classes[type] || '';
  }

  /**
   * Retourne l'icône pour un type de sortie
   */
  getTypeIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'vente': '💰',
      'transfert': '🔄',
      'perte': '❌'
    };
    return icons[type] || '📦';
  }

  /**
   * Exporte les sorties en CSV
   */
  exportToCSV(): void {
    if (this.filteredExits.length === 0) {
      alert('Aucune sortie à exporter');
      return;
    }

    // En-têtes CSV
    const headers = ['Date', 'Boisson', 'Type', 'Quantité', 'Prix Unitaire', 'Montant Total', 'Cave', 'Destination', 'Notes'];

    // Données CSV
    const rows = this.filteredExits.map(exit => [
      this.formatDate(exit.date),
      exit.drinkName,
      this.getTypeLabel(exit.type),
      exit.quantity,
      exit.unitPrice,
      exit.totalAmount,
      this.getCaveName(exit.caveId),
      exit.destination || '',
      exit.notes || ''
    ]);

    // Crée le contenu CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Télécharge le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sorties_stock_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Export CSV effectué');
  }

  /**
   * Imprime la liste des sorties
   */
  printExits(): void {
    window.print();
  }
}
