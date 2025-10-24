// ==========================================
// FICHIER: src/app/features/entries/entries.component.ts
// DESCRIPTION: Composant pour gérer les entrées de stock (réceptions de marchandises)
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
 * Interface pour définir une entrée de stock
 */
interface StockEntry {
  id: string;
  drinkId: string;
  drinkName: string;
  quantity: number;
  date: Date;
  supplier?: string;
  unitPrice: number;
  totalCost: number;
  caveId: string;
  addedBy: string;
  notes?: string;
}

/**
 * Interface pour le formulaire d'ajout d'entrée
 */
interface StockEntryForm {
  drinkId: string;
  quantity: number;
  unitPrice: number;
  caveId: string;
  supplier: string;
  notes: string;
}

/**
 * Composant de gestion des entrées de stock
 * Permet d'enregistrer les réceptions de marchandises et de consulter l'historique
 */
@Component({
  selector: 'app-entries',
  standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {

  // ========================================
  // PROPRIÉTÉS
  // ========================================

  /**
   * Liste complète des entrées de stock
   */
  entries: StockEntry[] = [];

  /**
   * Liste filtrée des entrées à afficher
   */
  filteredEntries: StockEntry[] = [];

  /**
   * Liste des boissons disponibles (pour le formulaire)
   */
  drinks: Drink[] = [];

  /**
   * Liste des caves disponibles (pour le formulaire)
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
   * Formulaire pour ajouter une entrée
   */
  entryForm: StockEntryForm = this.getEmptyForm();

  /**
   * Filtre par cave sélectionnée
   */
  selectedCaveFilter: string | null = null;

  /**
   * Filtre par période (jours)
   */
  periodFilter: number = 30; // 30 derniers jours par défaut

  /**
   * Terme de recherche
   */
  searchTerm: string = '';

  /**
   * Statistiques des entrées
   */
  stats = {
    totalEntries: 0,          // Nombre total d'entrées
    totalQuantity: 0,         // Quantité totale entrée
    totalCost: 0,             // Coût total
    recentEntries: 0          // Entrées récentes (7 derniers jours)
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
    this.entries = this.generateMockEntries();

    this.filteredEntries = [...this.entries];
    this.calculateStats();

    this.isLoading = false;
    console.log('Données chargées:', {
      entries: this.entries.length,
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
        currentStock: 650,
        description: 'Cave principale de stockage'
      },
      {
        id: 'cave_2',
        name: 'Cave Secondaire',
        location: 'Bâtiment B - RDC',
        capacity: 500,
        currentStock: 320,
        description: 'Cave secondaire'
      },
      {
        id: 'cave_3',
        name: 'Cave de Vieillissement',
        location: 'Bâtiment A - Niveau -2',
        capacity: 300,
        currentStock: 180,
        description: 'Cave pour vins de garde'
      }
    ];
  }

  /**
   * Génère des entrées de test
   */
  private generateMockEntries(): StockEntry[] {
    const now = new Date();
    return [
      {
        id: 'entry_1',
        drinkId: 'drink_1',
        drinkName: 'Bordeaux Rouge 2018',
        quantity: 24,
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
        supplier: 'Vins & Co',
        unitPrice: 12000,
        totalCost: 288000,
        caveId: 'cave_1',
        addedBy: 'user_1',
        notes: 'Livraison en bon état'
      },
      {
        id: 'entry_2',
        drinkId: 'drink_2',
        drinkName: 'Champagne Moët & Chandon',
        quantity: 12,
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
        supplier: 'Champagne Direct',
        unitPrice: 30000,
        totalCost: 360000,
        caveId: 'cave_3',
        addedBy: 'user_1',
        notes: 'Stockage à température contrôlée'
      },
      {
        id: 'entry_3',
        drinkId: 'drink_3',
        drinkName: 'Heineken',
        quantity: 100,
        date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
        supplier: 'Brasserie Import',
        unitPrice: 600,
        totalCost: 60000,
        caveId: 'cave_2',
        addedBy: 'user_2',
        notes: 'Promotion fournisseur'
      },
      {
        id: 'entry_4',
        drinkId: 'drink_4',
        drinkName: 'Chablis 2020',
        quantity: 18,
        date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Il y a 15 jours
        supplier: 'Vins de Bourgogne',
        unitPrice: 9500,
        totalCost: 171000,
        caveId: 'cave_3',
        addedBy: 'user_1',
        notes: 'Millésime exceptionnel'
      },
      {
        id: 'entry_5',
        drinkId: 'drink_1',
        drinkName: 'Bordeaux Rouge 2018',
        quantity: 36,
        date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // Il y a 20 jours
        supplier: 'Vins & Co',
        unitPrice: 11500,
        totalCost: 414000,
        caveId: 'cave_1',
        addedBy: 'user_2',
        notes: 'Réapprovisionnement mensuel'
      }
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ========================================
  // FILTRAGE
  // ========================================

  /**
   * Applique tous les filtres sur les entrées
   */
  applyFilters(): void {
    let result = [...this.entries];

    // Filtre par cave
    if (this.selectedCaveFilter) {
      result = result.filter(entry => entry.caveId === this.selectedCaveFilter);
    }

    // Filtre par période
    if (this.periodFilter) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.periodFilter);
      result = result.filter(entry => new Date(entry.date) >= cutoffDate);
    }

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(entry =>
        entry.drinkName.toLowerCase().includes(term) ||
        entry.supplier?.toLowerCase().includes(term) ||
        entry.notes?.toLowerCase().includes(term)
      );
    }

    this.filteredEntries = result;
    console.log('Filtres appliqués:', result.length, 'résultats');
  }

  /**
   * Gère le changement de filtre cave
   */
  onCaveFilterChange(): void {
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
    this.periodFilter = 30;
    this.searchTerm = '';
    this.filteredEntries = [...this.entries];
  }

  // ========================================
  // CALCUL DES STATISTIQUES
  // ========================================

  /**
   * Calcule les statistiques des entrées
   */
  calculateStats(): void {
    this.stats.totalEntries = this.entries.length;
    this.stats.totalQuantity = this.entries.reduce((sum, entry) => sum + entry.quantity, 0);
    this.stats.totalCost = this.entries.reduce((sum, entry) => sum + entry.totalCost, 0);

    // Entrées des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.stats.recentEntries = this.entries.filter(
      entry => new Date(entry.date) >= sevenDaysAgo
    ).length;
  }

  // ========================================
  // MODAL - AJOUT D'ENTRÉE
  // ========================================

  /**
   * Ouvre le modal d'ajout
   */
  openAddModal(): void {
    this.entryForm = this.getEmptyForm();
    this.isAddModalOpen = true;
  }

  /**
   * Ferme le modal
   */
  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.entryForm = this.getEmptyForm();
  }

  /**
   * Sauvegarde une nouvelle entrée
   */
  saveEntry(): void {
    // Validation
    if (!this.validateForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Récupère le nom de la boisson
    const drink = this.drinks.find(d => d.id === this.entryForm.drinkId);
    if (!drink) {
      alert('Boisson non trouvée');
      return;
    }

    // Calcule le coût total
    const totalCost = this.entryForm.quantity * this.entryForm.unitPrice;

    // Crée l'entrée
    const newEntry: StockEntry = {
      id: this.generateId(),
      drinkId: this.entryForm.drinkId,
      drinkName: drink.name,
      quantity: this.entryForm.quantity,
      date: new Date(),
      supplier: this.entryForm.supplier,
      unitPrice: this.entryForm.unitPrice,
      totalCost: totalCost,
      caveId: this.entryForm.caveId,
      addedBy: 'current-user-id', // À remplacer par l'ID de l'utilisateur connecté
      notes: this.entryForm.notes
    };

    // Ajoute l'entrée
    this.entries.unshift(newEntry);
    this.applyFilters();
    this.calculateStats();

    // TODO: Appel API
    console.log('Entrée ajoutée:', newEntry);

    alert('Entrée de stock enregistrée avec succès !');
    this.closeAddModal();
  }

  /**
   * Calcule le coût total en temps réel
   */
  calculateTotalCost(): number {
    return (this.entryForm.quantity || 0) * (this.entryForm.unitPrice || 0);
  }

  /**
   * Valide le formulaire
   */
  private validateForm(): boolean {
    return !!(
      this.entryForm.drinkId &&
      this.entryForm.quantity > 0 &&
      this.entryForm.unitPrice > 0 &&
      this.entryForm.caveId
    );
  }

  /**
   * Retourne un formulaire vide
   */
  private getEmptyForm(): StockEntryForm {
    return {
      drinkId: '',
      quantity: 0,
      unitPrice: 0,
      caveId: '',
      supplier: '',
      notes: ''
    };
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Exporte les entrées en CSV
   */
  exportToCSV(): void {
    if (this.filteredEntries.length === 0) {
      alert('Aucune entrée à exporter');
      return;
    }

    // En-têtes CSV
    const headers = ['Date', 'Boisson', 'Quantité', 'Prix Unitaire', 'Coût Total', 'Cave', 'Fournisseur', 'Notes'];

    // Données CSV
    const rows = this.filteredEntries.map(entry => [
      this.formatDate(entry.date),
      entry.drinkName,
      entry.quantity,
      entry.unitPrice,
      entry.totalCost,
      this.getCaveName(entry.caveId),
      entry.supplier || '',
      entry.notes || ''
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
    link.setAttribute('download', `entrees_stock_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Export CSV effectué');
  }

  /**
   * Imprime la liste des entrées
   */
  printEntries(): void {
    window.print();
  }
}
