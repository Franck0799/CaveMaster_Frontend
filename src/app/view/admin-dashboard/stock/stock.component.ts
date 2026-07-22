// ============================================
// stock.component.ts
// Composant de gestion centralisée des stocks
// ============================================

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { StockLevelsService } from '../../../core/services/stock/stock-levels.service';
import { DrinksService } from '../../../core/services/catalogue/drinks.service';
import { CavesService } from '../../../core/services/cave/caves.service';
import { ApiStockLevel } from '../../../core/models/Stock/StockLevel';
import { Drink as ApiDrink } from '../../../core/models/Catalogue/Drink';

// ========== INTERFACES ==========

interface StockItem {
  id: string;
  nom: string;
  categorie: string;
  type: 'boisson' | 'materiel' | 'vin';
  stockInitial: number;
  stockActuel: number;
  stockMinimum: number;
  stockMaximum: number;
  unitesMesure: string;

  // Pour boissons (drinks)
  format?: string;
  supplier?: string;
  cave?: string;
  depot?: string;
  commercialName?: string;
  commercialContact?: string;
  packagingType?: string;
  bulkUnit?: string;
  bulkQuantity?: number;
  unitsPerBulk?: number;
  totalBottles?: number;

  // Pour vins (wine-pairing)
  wineType?: string;
  region?: string;
  vintage?: string;
  temperature?: string;
  pairingWith?: string[];

  // Pour matériel
  emplacement?: string;
  etat?: 'Neuf' | 'Bon' | 'Usé' | 'À remplacer';

  // Communs
  prixAchat: number;
  prixVente?: number;
  dateAcquisition: Date;
  dateDerniereEntree?: Date;
  dateDerniereSortie?: Date;
  icon: string;
  notes?: string;
}

interface StockMovement {
  id: string;
  stockItemId: string;
  type: 'entree' | 'sortie';
  quantite: number;
  date: Date;
  motif: string;
  responsable: string;
  reference?: string;
}

interface Cave {
  id: string;
  nom: string;
}

interface StockAlert {
  id: string;
  itemNom: string;
  type: 'critique' | 'faible' | 'excedent';
  message: string;
  stockActuel: number;
  stockMinimum: number;
}

// ========== COMPOSANT ==========

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  // Contrôles de formulaire
  caveControl = new FormControl('toutes');
  typeControl = new FormControl('tous');
  categorieControl = new FormControl('toutes');
  searchControl = new FormControl('');
  etatControl = new FormControl('tous');

  // Données
  stockItems: StockItem[] = [];
  filteredStockItems: StockItem[] = [];
  stockMovements: StockMovement[] = [];
  stockAlerts: StockAlert[] = [];

  // Configuration
  caves: Cave[] = [
    { id: 'cave1', nom: 'Cave Principale' },
    { id: 'cave2', nom: 'Cave Secondaire' },
    { id: 'cave3', nom: 'Cave Restaurant' }
  ];

  types = [
    { value: 'boisson', label: 'Boissons', icon: '🍷' },
    { value: 'vin', label: 'Vins & Accords', icon: '🍾' },
    { value: 'materiel', label: 'Matériel', icon: '🍴' }
  ];

  categories = {
    boisson: ['Bières', 'Sucreries', 'Champagnes', 'Vins Rouges', 'Vins Blancs', 'Vins Rosés', 'Vins Mousseux', 'Liqueurs', 'Boissons Énergisantes', 'Boissons Locales'],
    vin: ['Bordeaux', 'Bourgogne', 'Champagne', 'Loire', 'Rhône', 'Languedoc', 'Alsace', 'Porto'],
    materiel: ['Couverts', 'Vaisselle', 'Verrerie', 'Mobilier', 'Équipement cuisine', 'Matériel de nettoyage', 'Décoration']
  };

  etats = ['Neuf', 'Bon', 'Usé', 'À remplacer'];

  // États UI
  isLoading = false;
  isModalOpen = false;
  isMovementModalOpen = false;
  isDetailsModalOpen = false;
  selectedItem: StockItem | null = null;
  showAlerts = true;

  // Statistiques
  totalArticles = 0;
  valeurTotaleStock = 0;
  articlesEnRupture = 0;
  articlesAlerteFaible = 0;

  // Tri
  currentSort: 'nom' | 'stock' | 'valeur' | 'date' = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Vue
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private stockLevelsService: StockLevelsService,
    private drinksService: DrinksService,
    private cavesService: CavesService
  ) {}

  ngOnInit(): void {
    this.loadStockData();
  }

  // ========== CHARGEMENT DES DONNÉES ==========

  loadStockData(): void {
    this.isLoading = true;

    // Jointure StockLevels (quantités par cave) + Drinks (infos produit) :
    // le backend sépare volontairement les deux (un Drink peut exister dans
    // plusieurs caves, chacune avec son propre niveau de stock).
    forkJoin({
      levels: this.stockLevelsService.getAll(),
      drinks: this.drinksService.getAll(),
      caves: this.cavesService.getAll()
    }).subscribe({
      next: ({ levels, drinks, caves }) => {
        const drinkById = new Map(drinks.map(d => [d.id, d]));
        const caveById = new Map(caves.map(c => [c.id, c]));

        this.stockItems = levels
          .filter(level => drinkById.has(level.drinkId))
          .map(level => this.mapStockLevelToLocal(level, drinkById.get(level.drinkId)!, caveById.get(level.caveId)?.name));

        this.filteredStockItems = [...this.stockItems];
        this.isLoading = false;
        this.setupFilters();
        this.calculateStats();
        this.generateAlerts();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du stock depuis le backend :', error);
        this.stockItems = [];
        this.filteredStockItems = [];
        this.isLoading = false;
      }
    });
  }

  /** Convertit un niveau de stock + la boisson associée vers le modèle local de cet écran. */
  private mapStockLevelToLocal(level: ApiStockLevel, drink: ApiDrink, caveName?: string): StockItem {
    return {
      id: level.id,
      nom: drink.name,
      categorie: drink.category,
      type: 'boisson',
      stockInitial: level.currentQuantity,
      stockActuel: level.currentQuantity,
      stockMinimum: level.minThreshold,
      stockMaximum: level.maxThreshold,
      unitesMesure: 'bouteille(s)',
      format: drink.format,
      cave: caveName || level.caveId,
      depot: drink.depot,
      commercialName: drink.commercialName,
      commercialContact: drink.commercialContact,
      packagingType: drink.packagingType,
      bulkUnit: drink.bulkUnit,
      bulkQuantity: drink.bulkQuantity,
      unitsPerBulk: drink.unitsPerBulk,
      totalBottles: drink.bulkQuantity * drink.unitsPerBulk,
      prixAchat: drink.purchasePrice,
      prixVente: drink.sellingPrice,
      dateAcquisition: level.lastEntryDate ? new Date(level.lastEntryDate) : new Date(),
      dateDerniereEntree: level.lastEntryDate ? new Date(level.lastEntryDate) : undefined,
      dateDerniereSortie: level.lastExitDate ? new Date(level.lastExitDate) : undefined,
      icon: drink.icon || '🍷',
      notes: drink.description
    };
  }

  // ========== FILTRAGE ==========

  setupFilters(): void {
    this.caveControl.valueChanges.subscribe(() => this.applyFilters());
    this.typeControl.valueChanges.subscribe(() => this.applyFilters());
    this.categorieControl.valueChanges.subscribe(() => this.applyFilters());
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.etatControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    let result = [...this.stockItems];

    if (this.caveControl.value !== 'toutes') {
      const caveSelectionnee = this.caves.find(c => c.id === this.caveControl.value);
      if (caveSelectionnee) {
        result = result.filter(item => item.cave === caveSelectionnee.nom);
      }
    }

    if (this.typeControl.value !== 'tous') {
      result = result.filter(item => item.type === this.typeControl.value);
    }

    if (this.categorieControl.value !== 'toutes') {
      result = result.filter(item => item.categorie === this.categorieControl.value);
    }

    if (this.etatControl.value !== 'tous') {
      result = result.filter(item => item.etat === this.etatControl.value);
    }

    if (this.searchControl.value) {
      const search = this.searchControl.value.toLowerCase();
      result = result.filter(item =>
        item.nom.toLowerCase().includes(search) ||
        item.categorie.toLowerCase().includes(search) ||
        item.supplier?.toLowerCase().includes(search) ||
        item.region?.toLowerCase().includes(search) ||
        item.notes?.toLowerCase().includes(search)
      );
    }

    this.sortItems(result);
    this.filteredStockItems = result;
    this.calculateStats();
  }

  resetFilters(): void {
    this.caveControl.setValue('toutes');
    this.typeControl.setValue('tous');
    this.categorieControl.setValue('toutes');
    this.searchControl.setValue('');
    this.etatControl.setValue('tous');
  }

  // ========== TRI ==========

  sortItems(items: StockItem[]): void {
    items.sort((a, b) => {
      let comparison = 0;

      switch (this.currentSort) {
        case 'nom':
          comparison = a.nom.localeCompare(b.nom);
          break;
        case 'stock':
          comparison = a.stockActuel - b.stockActuel;
          break;
        case 'valeur':
          comparison = (a.stockActuel * a.prixAchat) - (b.stockActuel * b.prixAchat);
          break;
        case 'date':
          comparison = a.dateAcquisition.getTime() - b.dateAcquisition.getTime();
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  changeSortCriteria(criteria: 'nom' | 'stock' | 'valeur' | 'date'): void {
    if (this.currentSort === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = criteria;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  // ========== STATISTIQUES ==========

  calculateStats(): void {
    this.totalArticles = this.filteredStockItems.reduce((sum, item) => sum + item.stockActuel, 0);
    this.valeurTotaleStock = this.filteredStockItems.reduce((sum, item) =>
      sum + (item.stockActuel * item.prixAchat), 0
    );
    this.articlesEnRupture = this.filteredStockItems.filter(item =>
      item.stockActuel === 0
    ).length;
    this.articlesAlerteFaible = this.filteredStockItems.filter(item =>
      item.stockActuel > 0 && item.stockActuel <= item.stockMinimum
    ).length;
  }

  // ========== ALERTES ==========

  generateAlerts(): void {
    this.stockAlerts = [];

    this.stockItems.forEach(item => {
      if (item.stockActuel === 0) {
        this.stockAlerts.push({
          id: `alert-${item.id}`,
          itemNom: item.nom,
          type: 'critique',
          message: 'Rupture de stock',
          stockActuel: item.stockActuel,
          stockMinimum: item.stockMinimum
        });
      } else if (item.stockActuel <= item.stockMinimum) {
        this.stockAlerts.push({
          id: `alert-${item.id}`,
          itemNom: item.nom,
          type: 'faible',
          message: 'Stock faible - Réapprovisionnement recommandé',
          stockActuel: item.stockActuel,
          stockMinimum: item.stockMinimum
        });
      } else if (item.stockActuel >= item.stockMaximum) {
        this.stockAlerts.push({
          id: `alert-${item.id}`,
          itemNom: item.nom,
          type: 'excedent',
          message: 'Stock excédentaire',
          stockActuel: item.stockActuel,
          stockMinimum: item.stockMinimum
        });
      }
    });
  }

  // ========== GESTION DES MOUVEMENTS ==========

  openMovementModal(item: StockItem): void {
    this.selectedItem = item;
    this.isMovementModalOpen = true;
  }

  closeMovementModal(): void {
    this.isMovementModalOpen = false;
    this.selectedItem = null;
  }

  openDetailsModal(item: StockItem): void {
    this.selectedItem = item;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedItem = null;
  }

  addStockEntry(item: StockItem, quantite: number, motif: string): void {
    if (!quantite || quantite <= 0) {
      alert('⚠️ Veuillez saisir une quantité valide');
      return;
    }

    item.stockActuel += quantite;
    item.dateDerniereEntree = new Date();

    const movement: StockMovement = {
      id: this.generateId(),
      stockItemId: item.id,
      type: 'entree',
      quantite,
      date: new Date(),
      motif: motif || 'Réapprovisionnement',
      responsable: 'Admin'
    };

    this.stockMovements.push(movement);
    this.applyFilters();
    this.generateAlerts();
    alert('✅ Entrée de stock enregistrée');
    console.log('✅ Entrée de stock:', movement);
  }

  addStockExit(item: StockItem, quantite: number, motif: string): void {
    if (!quantite || quantite <= 0) {
      alert('⚠️ Veuillez saisir une quantité valide');
      return;
    }

    if (quantite > item.stockActuel) {
      alert('⚠️ Quantité insuffisante en stock');
      return;
    }

    item.stockActuel -= quantite;
    item.dateDerniereSortie = new Date();

    const movement: StockMovement = {
      id: this.generateId(),
      stockItemId: item.id,
      type: 'sortie',
      quantite,
      date: new Date(),
      motif: motif || 'Vente',
      responsable: 'Admin'
    };

    this.stockMovements.push(movement);
    this.applyFilters();
    this.generateAlerts();
    alert('✅ Sortie de stock enregistrée');
    console.log('✅ Sortie de stock:', movement);
  }

  // ========== EXPORT ==========

  exportStock(): void {
    const csv = this.generateCSV();
    this.downloadFile(csv, `stock-${Date.now()}.csv`);
  }

  private generateCSV(): string {
    const headers = [
      'ID', 'Nom', 'Type', 'Catégorie', 'Stock Actuel', 'Stock Min', 'Stock Max',
      'Unité', 'Cave/Emplacement', 'Prix Achat', 'Prix Vente', 'Valeur Stock', 'État/Notes'
    ];

    const rows = this.filteredStockItems.map(item => [
      item.id,
      item.nom,
      item.type,
      item.categorie,
      item.stockActuel,
      item.stockMinimum,
      item.stockMaximum,
      item.unitesMesure,
      item.cave || item.emplacement || '-',
      item.prixAchat,
      item.prixVente || '-',
      (item.stockActuel * item.prixAchat).toFixed(0),
      item.etat || item.notes || '-'
    ]);

    return [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
  }

  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // ========== UTILITAIRES ==========

  getStockStatus(item: StockItem): { class: string; label: string } {
    if (item.stockActuel === 0) {
      return { class: 'status-rupture', label: 'Rupture' };
    } else if (item.stockActuel <= item.stockMinimum) {
      return { class: 'status-faible', label: 'Faible' };
    } else if (item.stockActuel >= item.stockMaximum) {
      return { class: 'status-excedent', label: 'Excédent' };
    } else {
      return { class: 'status-normal', label: 'Normal' };
    }
  }

  getStockPercentage(item: StockItem): number {
    return Math.min((item.stockActuel / item.stockMaximum) * 100, 100);
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'boisson': '🍷',
      'vin': '🍾',
      'materiel': '🍴'
    };
    return icons[type] || '📦';
  }

  getCategoriesForType(): string[] {
    const type = this.typeControl.value;
    if (type === 'tous') {
      return Object.values(this.categories).flat();
    }
    return this.categories[type as keyof typeof this.categories] || [];
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}
