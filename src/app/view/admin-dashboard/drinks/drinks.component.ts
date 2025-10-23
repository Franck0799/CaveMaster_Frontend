// ==========================================
// FICHIER: src/app/features/drinks/drinks.component.ts
// DESCRIPTION: Composant pour gérer l'affichage et la gestion des boissons
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Drink, DrinkCategory } from '../../core/models/models';
import { DataService } from '../../core/services/data.service';

/**
 * Composant de gestion des boissons
 * Permet de visualiser, filtrer, ajouter, modifier et supprimer des boissons
 */
@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss']
})
export class DrinksComponent implements OnInit, OnDestroy {

  // ========================================
  // PROPRIÉTÉS
  // ========================================

  /**
   * Liste complète de toutes les boissons
   */
  drinks: Drink[] = [];

  /**
   * Liste filtrée des boissons à afficher
   */
  filteredDrinks: Drink[] = [];

  /**
   * Catégorie sélectionnée pour le filtre
   * null = toutes les catégories
   */
  selectedCategory: DrinkCategory | null = null;

  /**
   * Terme de recherche saisi par l'utilisateur
   */
  searchTerm: string = '';

  /**
   * Indicateur de chargement des données
   */
  isLoading: boolean = false;

  /**
   * Indique si le modal d'ajout/modification est ouvert
   */
  isModalOpen: boolean = false;

  /**
   * Boisson sélectionnée pour modification (null = mode ajout)
   */
  selectedDrink: Drink | null = null;

  /**
   * Formulaire pour ajouter/modifier une boisson
   */
  drinkForm: Partial<Drink> = {
    name: '',
    category: DrinkCategory.VIN_ROUGE,
    icon: '🍷',
    price: 0,
    stock: 0,
    description: ''
  };

  /**
   * Énumération des catégories (pour le template)
   */
  drinkCategories = Object.values(DrinkCategory);

  /**
   * Tri actuel appliqué
   */
  currentSort: 'name' | 'price' | 'stock' | 'sales' = 'name';

  /**
   * Direction du tri (ascendant/descendant)
   */
  sortDirection: 'asc' | 'desc' = 'asc';

  /**
   * Subject pour gérer la désinscription des observables
   */
  private destroy$ = new Subject<void>();

  // ========================================
  // CONSTRUCTEUR
  // ========================================

  /**
   * Injection du service de données
   */
  constructor(private dataService: DataService) {}

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  /**
   * Initialisation du composant
   * Charge les données et configure les abonnements
   */
  ngOnInit(): void {
    this.loadDrinks();
  }

  /**
   * Nettoyage lors de la destruction du composant
   * Désabonnement de tous les observables
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  /**
   * Charge la liste des boissons depuis le service
   */
  loadDrinks(): void {
    this.isLoading = true;

    // S'abonne aux changements de la liste des boissons
    this.dataService.drinks$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (drinks) => {
          this.drinks = drinks;
          this.applyFilters(); // Applique les filtres après chargement
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des boissons:', error);
          this.isLoading = false;
        }
      });
  }

  // ========================================
  // FILTRAGE ET RECHERCHE
  // ========================================

  /**
   * Applique tous les filtres (catégorie + recherche)
   */
  applyFilters(): void {
    let result = [...this.drinks];

    // Filtre par catégorie
    if (this.selectedCategory) {
      result = result.filter(drink => drink.category === this.selectedCategory);
    }

    // Filtre par terme de recherche (nom, description)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(drink =>
        drink.name.toLowerCase().includes(term) ||
        drink.description?.toLowerCase().includes(term) ||
        drink.category.toLowerCase().includes(term)
      );
    }

    // Applique le tri actuel
    this.sortDrinks(result);

    this.filteredDrinks = result;
  }

  /**
   * Gère le changement de catégorie
   */
  onCategoryChange(category: DrinkCategory | null): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  /**
   * Gère le changement du terme de recherche
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedCategory = null;
    this.searchTerm = '';
    this.applyFilters();
  }

  // ========================================
  // TRI
  // ========================================

  /**
   * Change le critère de tri
   */
  changeSortCriteria(criteria: 'name' | 'price' | 'stock' | 'sales'): void {
    // Si on clique sur le même critère, inverse la direction
    if (this.currentSort === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = criteria;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  /**
   * Trie la liste des boissons selon le critère actuel
   */
  private sortDrinks(drinks: Drink[]): void {
    drinks.sort((a, b) => {
      let comparison = 0;

      switch (this.currentSort) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
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

  /**
   * Ouvre le modal en mode ajout
   */
  openAddModal(): void {
    this.selectedDrink = null;
    this.drinkForm = {
      name: '',
      category: DrinkCategory.VIN_ROUGE,
      icon: '🍷',
      price: 0,
      stock: 0,
      description: ''
    };
    this.isModalOpen = true;
  }

  /**
   * Ouvre le modal en mode modification
   */
  openEditModal(drink: Drink): void {
    this.selectedDrink = drink;
    this.drinkForm = { ...drink }; // Clone l'objet
    this.isModalOpen = true;
  }

  /**
   * Ferme le modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedDrink = null;
    this.drinkForm = {
      name: '',
      category: DrinkCategory.VIN_ROUGE,
      icon: '🍷',
      price: 0,
      stock: 0,
      description: ''
    };
  }

  /**
   * Sauvegarde la boisson (ajout ou modification)
   */
  saveDrink(): void {
    // Validation basique
    if (!this.drinkForm.name || !this.drinkForm.price || this.drinkForm.stock === undefined) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.selectedDrink) {
      // Mode modification
      this.dataService.updateDrink(this.selectedDrink.id, this.drinkForm);
    } else {
      // Mode ajout - génère un ID unique
      const newDrink: Drink = {
        id: this.generateId(),
        name: this.drinkForm.name!,
        category: this.drinkForm.category!,
        icon: this.drinkForm.icon!,
        price: this.drinkForm.price!,
        stock: this.drinkForm.stock!,
        description: this.drinkForm.description,
        sales: 0
      };
      this.dataService.addDrink(newDrink);
    }

    this.closeModal();
  }

  // ========================================
  // SUPPRESSION
  // ========================================

  /**
   * Supprime une boisson après confirmation
   */
  deleteDrink(drink: Drink): void {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer "${drink.name}" ?`);
    if (confirmed) {
      this.dataService.deleteDrink(drink.id);
    }
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  /**
   * Génère un ID unique pour une nouvelle boisson
   */
  private generateId(): string {
    return `drink_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Formate un nombre avec des espaces comme séparateurs de milliers
   */
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Retourne la classe CSS pour une catégorie
   */
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

  /**
   * Retourne le badge de stock (Faible, Moyen, Bon)
   */
  getStockBadge(stock: number): { label: string; class: string } {
    if (stock < 10) {
      return { label: 'Stock faible', class: 'badge-danger' };
    } else if (stock < 50) {
      return { label: 'Stock moyen', class: 'badge-warning' };
    } else {
      return { label: 'Stock suffisant', class: 'badge-success' };
    }
  }

  /**
   * Vérifie si une boisson a un stock critique
   */
  isCriticalStock(stock: number): boolean {
    return stock < 10;
  }

  /**
   * Retourne l'icône de tri pour une colonne
   */
  getSortIcon(column: string): string {
    if (this.currentSort !== column) {
      return '⇅'; // Icône neutre
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  /**
   * Compte le nombre de boissons par catégorie
   */
  getDrinkCountByCategory(category: DrinkCategory): number {
    return this.drinks.filter(d => d.category === category).length;
  }
}
