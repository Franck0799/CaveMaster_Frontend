// ==========================================
// FICHIER: src/app/view/admin-dashboard/drinks/drinks.component.ts
// DESCRIPTION: Composant pour gérer l'affichage et la gestion des boissons
// AVEC FORMULAIRE COMPLET ET DÉTAILLÉ
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Énumération des catégories de boissons
 */
export enum DrinkCategory {
  BIERES = 'Bières',
  SUCRERIES = 'Sucreries',
  CHAMPAGNE = 'Champagne',
  VIN_BLANC = 'Vin Blanc',
  VIN_ROUGE = 'Vin Rouge',
  VIN_ROSE = 'Vin Rosé',
  VIN_MOUSSEUX = 'Vin Mousseux',
  LIQUEURS = 'Liqueurs',
  BOISSONS_ENERGISANTES = 'Boissons Énergisantes',
  BOISSONS_LOCALES = 'Boissons Locales'
}

/**
 * Énumération des formats de boissons
 */
export enum DrinkFormat {
  CL_25 = '25cl',
  CL_33 = '33cl',
  CL_50 = '50cl',
  CL_65 = '65cl',
  CL_75 = '75cl',
  L_1 = '1L',
  L_1_5 = '1.5L',
  L_2 = '2L'
}

/**
 * Énumération des fournisseurs
 */
export enum Supplier {
  SOLIBRA = 'Solibra',
  BRASSIVOIRE = 'Brassivoire',
  SICOBRA = 'Sicobra',
  UNIBRA = 'Unibra',
  AUTRES = 'Autres'
}

/**
 * Énumération des types de conditionnement
 */
export enum PackagingType {
  BOUTEILLE = 'Bouteille',
  CANETTE = 'Canette',
  VERRE = 'Verre',
  PLASTIQUE = 'Plastique',
  SACHET = 'Sachet'
}

/**
 * Énumération des unités de gros
 */
export enum BulkUnit {
  CARTON = 'Carton',
  CASIER = 'Casier',
  PACK = 'Pack',
  CAISSE = 'Caisse'
}

/**
 * Interface pour définir une boisson (version complète)
 */
interface Drink {
  id: string;
  name: string;
  format: DrinkFormat;
  supplier: Supplier;
  category: DrinkCategory;
  depot: string;
  commercialName: string;
  commercialContact: string;
  packagingType: PackagingType;
  bulkUnit: BulkUnit;
  bulkQuantity: number; // Ex: 1 carton, 2 casiers
  unitsPerBulk: number; // Ex: 12 bouteilles par carton
  totalBottles: number; // Calculé automatiquement
  purchasePrice: number; // Prix d'achat par bouteille
  sellingPrice: number; // Prix de vente par bouteille
  icon: string;
  stock: number;
  description?: string;
  sales?: number;
  createdAt?: Date;
  badge?: 'hot' | 'new';
}

/**
 * Interface pour le formulaire d'ajout/modification de boisson
 */
interface DrinkForm {
  name: string;
  format: DrinkFormat;
  supplier: Supplier;
  category: DrinkCategory;
  depot: string;
  commercialName: string;
  commercialContact: string;
  packagingType: PackagingType;
  bulkUnit: BulkUnit;
  bulkQuantity: number;
  unitsPerBulk: number;
  totalBottles: number;
  purchasePrice: number;
  sellingPrice: number;
  icon: string;
  stock: number;
  description: string;
}

/**
 * Mapping entre les slugs d'URL et les catégories
 */
const CATEGORY_SLUG_MAP: { [key: string]: DrinkCategory } = {
  'Bières': DrinkCategory.BIERES,
  'Sucreries': DrinkCategory.SUCRERIES,
  'Champagne': DrinkCategory.CHAMPAGNE,
  'Vin Blanc': DrinkCategory.VIN_BLANC,
  'Vin Rouge': DrinkCategory.VIN_ROUGE,
  'Vin Rosé': DrinkCategory.VIN_ROSE,
  'Vin Mousseux': DrinkCategory.VIN_MOUSSEUX,
  'Liqueurs': DrinkCategory.LIQUEURS,
  'Boissons Énergisantes': DrinkCategory.BOISSONS_ENERGISANTES,
  'Boissons Locales': DrinkCategory.BOISSONS_LOCALES
};

/**
 * Composant de gestion des boissons
 */
@Component({
  selector: 'app-drinks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss']
})
export class DrinksComponent implements OnInit, OnDestroy {

  // ========================================
  // PROPRIÉTÉS
  // ========================================

  drinks: Drink[] = [];
  filteredDrinks: Drink[] = [];
  selectedCategory: DrinkCategory | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedDrink: Drink | null = null;
  drinkForm: DrinkForm = this.getEmptyForm();

  // Énumérations pour le template
  drinkCategories = Object.values(DrinkCategory);
  drinkFormats = Object.values(DrinkFormat);
  suppliers = Object.values(Supplier);
  packagingTypes = Object.values(PackagingType);
  bulkUnits = Object.values(BulkUnit);

  currentSort: 'name' | 'price' | 'stock' | 'sales' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  drinkIcons: string[] = [
    '🍷', '🍺', '🍻', '🥂', '🍾', '🍹', '🍸', '🥃', '🧃', '🥤',
    '☕', '🍵', '🧋', '🥛', '🍶', '🧉', '🍼', '🥫'
  ];

  private routeSubscription?: Subscription;

  // ========================================
  // CONSTRUCTEUR
  // ========================================

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadDrinks();

    this.routeSubscription = this.route.data.subscribe(data => {
      if (data['category']) {
        const categorySlug = data['category'];
        const category = CATEGORY_SLUG_MAP[categorySlug];
        if (category) {
          this.selectedCategory = category;
          this.applyFilters();
        }
      } else {
        this.selectedCategory = null;
        this.applyFilters();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  loadDrinks(): void {
    this.isLoading = true;
    this.drinks = this.generateMockDrinks();
    this.filteredDrinks = [...this.drinks];
    this.isLoading = false;
    console.log('✅ Boissons chargées:', this.drinks.length);
  }

  private generateMockDrinks(): Drink[] {
    return [
      {
        id: '1',
        name: 'Heineken',
        format: DrinkFormat.CL_33,
        supplier: Supplier.SOLIBRA,
        category: DrinkCategory.BIERES,
        depot: 'Dépôt Abidjan Zone 4',
        commercialName: 'Kouadio Jean',
        commercialContact: '+225 07 00 00 00 01',
        packagingType: PackagingType.BOUTEILLE,
        bulkUnit: BulkUnit.CARTON,
        bulkQuantity: 3,
        unitsPerBulk: 12,
        totalBottles: 36,
        purchasePrice: 650,
        sellingPrice: 800,
        icon: '🍺',
        stock: 150,
        description: 'Bière blonde hollandaise',
        sales: 450,
        createdAt: new Date(),
        badge: 'hot'
      },
      {
        id: '2',
        name: 'Guinness',
        format: DrinkFormat.CL_33,
        supplier: Supplier.BRASSIVOIRE,
        category: DrinkCategory.BIERES,
        depot: 'Dépôt Yopougon',
        commercialName: 'Koné Moussa',
        commercialContact: '+225 05 00 00 00 02',
        packagingType: PackagingType.CANETTE,
        bulkUnit: BulkUnit.PACK,
        bulkQuantity: 2,
        unitsPerBulk: 24,
        totalBottles: 48,
        purchasePrice: 850,
        sellingPrice: 1000,
        icon: '🍺',
        stock: 100,
        description: 'Bière brune irlandaise',
        sales: 320,
        createdAt: new Date()
      }
    ];
  }

  // ========================================
  // CALCUL AUTOMATIQUE
  // ========================================

  /**
   * Calcule automatiquement le nombre total de bouteilles
   */
  calculateTotalBottles(): void {
    this.drinkForm.totalBottles = this.drinkForm.bulkQuantity * this.drinkForm.unitsPerBulk;
    console.log('🔢 Nombre total de bouteilles:', this.drinkForm.totalBottles);
  }

  /**
   * Calcule la marge bénéficiaire
   */
  calculateMargin(): number {
    if (this.drinkForm.purchasePrice && this.drinkForm.sellingPrice) {
      return this.drinkForm.sellingPrice - this.drinkForm.purchasePrice;
    }
    return 0;
  }

  /**
   * Calcule le pourcentage de marge
   */
  calculateMarginPercentage(): number {
    if (this.drinkForm.purchasePrice && this.drinkForm.sellingPrice) {
      const margin = this.calculateMargin();
      return (margin / this.drinkForm.purchasePrice) * 100;
    }
    return 0;
  }

  // ========================================
  // FILTRAGE ET RECHERCHE
  // ========================================

  applyFilters(): void {
    let result = [...this.drinks];

    if (this.selectedCategory) {
      result = result.filter(drink => drink.category === this.selectedCategory);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(drink =>
        drink.name.toLowerCase().includes(term) ||
        drink.description?.toLowerCase().includes(term) ||
        drink.category.toLowerCase().includes(term) ||
        drink.supplier.toLowerCase().includes(term)
      );
    }

    this.sortDrinks(result);
    this.filteredDrinks = result;
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.searchTerm = '';
    this.router.navigate(['/admin', 'drinks']);
  }

  // ========================================
  // TRI
  // ========================================

  changeSortCriteria(criteria: 'name' | 'price' | 'stock' | 'sales'): void {
    if (this.currentSort === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = criteria;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  private sortDrinks(drinks: Drink[]): void {
    drinks.sort((a, b) => {
      let comparison = 0;

      switch (this.currentSort) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.sellingPrice - b.sellingPrice;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'sales':
          comparison = (a.sales || 0) - (b.sales || 0);
          break;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // ========================================
  // MODAL - AJOUT/MODIFICATION
  // ========================================

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedDrink = null;
    this.drinkForm = this.getEmptyForm();
    this.isModalOpen = true;
  }

  openEditModal(drink: Drink): void {
    this.isEditMode = true;
    this.selectedDrink = drink;
    this.drinkForm = {
      name: drink.name,
      format: drink.format,
      supplier: drink.supplier,
      category: drink.category,
      depot: drink.depot,
      commercialName: drink.commercialName,
      commercialContact: drink.commercialContact,
      packagingType: drink.packagingType,
      bulkUnit: drink.bulkUnit,
      bulkQuantity: drink.bulkQuantity,
      unitsPerBulk: drink.unitsPerBulk,
      totalBottles: drink.totalBottles,
      purchasePrice: drink.purchasePrice,
      sellingPrice: drink.sellingPrice,
      icon: drink.icon,
      stock: drink.stock,
      description: drink.description || ''
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.selectedDrink = null;
    this.drinkForm = this.getEmptyForm();
  }

  saveDrink(): void {
    if (!this.validateForm()) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.isEditMode && this.selectedDrink) {
      this.updateDrink();
    } else {
      this.addDrink();
    }
  }

  private addDrink(): void {
    const newDrink: Drink = {
      id: this.generateId(),
      ...this.drinkForm,
      sales: 0,
      createdAt: new Date()
    };

    this.drinks.unshift(newDrink);
    this.applyFilters();

    console.log('✅ Boisson ajoutée:', newDrink);
    alert('✅ Boisson ajoutée avec succès !');
    this.closeModal();
  }

  private updateDrink(): void {
    if (!this.selectedDrink) return;

    const index = this.drinks.findIndex(d => d.id === this.selectedDrink!.id);
    if (index !== -1) {
      this.drinks[index] = {
        ...this.selectedDrink,
        ...this.drinkForm
      };

      this.applyFilters();
      console.log('✅ Boisson mise à jour:', this.drinks[index]);
      alert('✅ Boisson mise à jour avec succès !');
      this.closeModal();
    }
  }

  // ========================================
  // SUPPRESSION
  // ========================================

  deleteDrink(drink: Drink): void {
    if (confirm(`❌ Êtes-vous sûr de vouloir supprimer "${drink.name}" ?`)) {
      this.drinks = this.drinks.filter(d => d.id !== drink.id);
      this.applyFilters();
      console.log('🗑️ Boisson supprimée:', drink.id);
      alert('✅ Boisson supprimée avec succès');
    }
  }

  // ========================================
  // VALIDATION
  // ========================================

  private validateForm(): boolean {
    return !!(
      this.drinkForm.name &&
      this.drinkForm.format &&
      this.drinkForm.supplier &&
      this.drinkForm.category &&
      this.drinkForm.depot &&
      this.drinkForm.commercialName &&
      this.drinkForm.commercialContact &&
      this.drinkForm.packagingType &&
      this.drinkForm.bulkUnit &&
      this.drinkForm.bulkQuantity > 0 &&
      this.drinkForm.unitsPerBulk > 0 &&
      this.drinkForm.purchasePrice > 0 &&
      this.drinkForm.sellingPrice > 0 &&
      this.drinkForm.icon &&
      this.drinkForm.stock >= 0
    );
  }

  private getEmptyForm(): DrinkForm {
    return {
      name: '',
      format: DrinkFormat.CL_33,
      supplier: Supplier.SOLIBRA,
      category: DrinkCategory.BIERES,
      depot: '',
      commercialName: '',
      commercialContact: '',
      packagingType: PackagingType.BOUTEILLE,
      bulkUnit: BulkUnit.CARTON,
      bulkQuantity: 1,
      unitsPerBulk: 12,
      totalBottles: 12,
      purchasePrice: 0,
      sellingPrice: 0,
      icon: '🍷',
      stock: 0,
      description: ''
    };
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  private generateId(): string {
    return `drink_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  getCategoryClass(category: DrinkCategory): string {
    const classMap: { [key in DrinkCategory]: string } = {
      [DrinkCategory.BIERES]: 'category-beer',
      [DrinkCategory.SUCRERIES]: 'category-sweet',
      [DrinkCategory.CHAMPAGNE]: 'category-champagne',
      [DrinkCategory.VIN_BLANC]: 'category-white-wine',
      [DrinkCategory.VIN_ROUGE]: 'category-red-wine',
      [DrinkCategory.VIN_ROSE]: 'category-rose-wine',
      [DrinkCategory.VIN_MOUSSEUX]: 'category-sparkling',
      [DrinkCategory.LIQUEURS]: 'category-liquor',
      [DrinkCategory.BOISSONS_ENERGISANTES]: 'category-energy',
      [DrinkCategory.BOISSONS_LOCALES]: 'category-local'
    };
    return classMap[category] || '';
  }

  getStockBadge(stock: number): { label: string; class: string } {
    if (stock < 10) {
      return { label: 'Stock faible', class: 'badge-danger' };
    } else if (stock < 50) {
      return { label: 'Stock moyen', class: 'badge-warning' };
    } else {
      return { label: 'Stock suffisant', class: 'badge-success' };
    }
  }

  isCriticalStock(stock: number): boolean {
    return stock < 10;
  }

  getSortIcon(column: string): string {
    if (this.currentSort !== column) {
      return '⇅';
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  getDrinkCountByCategory(category: DrinkCategory): number {
    return this.drinks.filter(d => d.category === category).length;
  }
}
