// ==========================================
// FICHIER: src/app/features/entries/entries.component.ts
// DESCRIPTION: Composant pour gérer les entrées de stock (réceptions de marchandises)
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StockEntry, Drink, Cave } from '../../core/models/models';
import { DataService } from '../../core/services/data.service';

/**
 * Composant de gestion des entrées de stock
 * Permet d'enregistrer les réceptions de marchandises et de consulter l'historique
 */
@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit, OnDestroy {

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
  entryForm: Partial<StockEntry> = {
    drinkId: '',
    quantity: 0,
    unitPrice: 0,
    caveId: '',
    supplier: '',
    notes: ''
  };

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

  /**
   * Subject pour la désinscription
   */
  private destroy$ = new Subject<void>();

  // ========================================
  // CONSTRUCTEUR
  // ========================================

  constructor(private dataService: DataService) {}

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  /**
   * Charge toutes les données nécessaires
   */
  loadData(): void {
    this.isLoading = true;

    // Charge les entrées
    this.dataService.stockEntries$
      .pipe(takeUntil(this.destroy$))
      .subscribe(entries => {
        this.entries = entries.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.applyFilters();
        this.calculateStats();
        this.isLoading = false;
      });

    // Charge les boissons
    this.dataService.drinks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(drinks => {
        this.drinks = drinks;
      });

    // Charge les caves
    this.dataService.caves$
      .pipe(takeUntil(this.destroy$))
      .subscribe(caves => {
        this.caves = caves;
      });
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
  }

  /**
   * Gère le changement de filtre cave
   */
  onCaveFilterChange(caveId: string | null): void {
    this.selectedCaveFilter = caveId;
    this.applyFilters();
  }

  /**
   * Gère le changement de période
   */
  onPeriodFilterChange(days: number): void {
    this.periodFilter = days;
    this.applyFilters();
  }

  /**
   * Gère le changement de recherche
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedCaveFilter = null;
    this.periodFilter = 30;
    this.searchTerm = '';
    this.applyFilters();
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
    this.entryForm = {
      drinkId: '',
      quantity: 0,
      unitPrice: 0,
      caveId: '',
      supplier: '',
      notes: ''
    };
    this.isAddModalOpen = true;
  }

  /**
   * Ferme le modal
   */
  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  /**
   * Sauvegarde une nouvelle entrée
   */
  saveEntry(): void {
    // Validation
    if (!this.entryForm.drinkId || !this.entryForm.quantity || 
        !this.entryForm.unitPrice || !this.entryForm.caveId) {
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
    const totalCost = this.entryForm.quantity! * this.entryForm.unitPrice!;

    // Crée l'entrée
    const newEntry: StockEntry = {
      id: this.generateId(),
      drinkId: this.entryForm.drinkId!,
      drinkName: drink.name,
      quantity: this.entryForm.quantity!,
      date: new Date(),
      supplier: this.entryForm.supplier,
      unitPrice: this.entryForm.unitPrice!,
      totalCost: totalCost,
      caveId: this.entryForm.caveId!,
      addedBy: 'current-user-id', // À remplacer par l'ID de l'utilisateur connecté
      notes: this.entryForm.notes
    };

    // Ajoute l'entrée via le service
    this.dataService.addStockEntry(newEntry);

    this.closeAddModal();
  }

  /**
   * Calcule le coût total en temps réel
   */
  calculateTotalCost(): number {
    return (this.entryForm.quantity || 0) * (this.entryForm.unitPrice || 0);
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
  }

  /**
   * Imprime la liste des entrées
   */
  printEntries(): void {
    window.print();
  }
}