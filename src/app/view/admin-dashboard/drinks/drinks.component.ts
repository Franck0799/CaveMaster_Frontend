// ==========================================
// FICHIER: src/app/features/drinks/drinks.component.ts
// DESCRIPTION: Composant pour gérer l'affichage et la gestion des boissons
// ==========================================

import { Component, OnInit } from '@angular/core';

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
 * Interface pour définir une boisson
 */
interface Drink {
  id: string;
  name: string;
  category: DrinkCategory;
  icon: string;
  price: number;
  stock: number;
  description?: string;
  sales?: number;
  createdAt?: Date;
}

/**
 * Interface pour le formulaire d'ajout/modification de boisson
 */
interface DrinkForm {
  name: string;
  category: DrinkCategory;
  icon: string;
  price: number;
  stock: number;
  description: string;
}

/**
 * Composant de gestion des boissons
 * Permet de visualiser, filtrer, ajouter, modifier et supprimer des boissons
 */
@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss']
})
export class DrinksComponent implements OnInit {

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
   * Indique si on est en mode édition
   */
  isEditMode: boolean = false;

  /**
   * Boisson sélectionnée pour modification (null = mode ajout)
   */
  selectedDrink: Drink | null = null;

  /**
   * Formulaire pour ajouter/modifier une boisson
   */
  drinkForm: DrinkForm = this.getEmptyForm();

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
   * Icônes disponibles pour les boissons
   */
  drinkIcons: string[] = [
    '🍷', '🍺', '🍻', '🥂', '🍾', '🍹', '🍸', '🥃', '🧃', '🥤',
    '☕', '🍵', '🧋', '🥛', '🍶', '🧉', '🍼', '🥫'
  ];

  // ========================================
  // CONSTRUCTEUR
  // ========================================

  constructor() {}

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  /**
   * Initialisation du composant
   * Charge les données
   */
  ngOnInit(): void {
    this.loadDrinks();
  }

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  /**
   * Charge la liste des boissons
   */
  loadDrinks(): void {
    this.isLoading = true;

    // TODO: Appel API
    // Simulation avec des données de test
    this.drinks = this.generateMockDrinks();
    this.filteredDrinks = [...this.drinks];

    this.isLoading = false;
    console.log('Boissons chargées:', this.drinks.length);
  }

  /**
   * Génère des boissons de test pour la démo
   * @returns Liste de boissons simulées
   */
  private generateMockDrinks(): Drink[] {
    return [
      {
        id: '1',
        name: 'Bordeaux Rouge 2018',
        category: DrinkCategory.VIN_ROUGE,
        icon: '🍷',
        price: 15000,
        stock: 45,
        description: 'Vin rouge de Bordeaux, millésime 2018',
        sales: 120,
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Champagne Moët & Chandon',
        category: DrinkCategory.CHAMPAGNE,
        icon: '🍾',
        price: 35000,
        stock: 20,
        description: 'Champagne brut impérial',
        sales: 85,
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Heineken',
        category: DrinkCategory.BIERES,
        icon: '🍺',
        price: 800,
        stock: 150,
        description: 'Bière blonde hollandaise',
        sales: 450,
        createdAt: new Date()
      },
      {
        id: '4',
        name: 'Chablis 2020',
        category: DrinkCategory.VIN_BLANC,
        icon: '🍷',
        price: 12000,
        stock: 30,
        description: 'Vin blanc sec de Bourgogne',
        sales: 95,
        createdAt: new Date()
      },
      {
        id: '5',
        name: 'Coca-Cola',
        category: DrinkCategory.BOISSONS_ENERGISANTES,
        icon: '🥤',
        price: 500,
        stock: 200,
        description: 'Boisson gazeuse classique',
        sales: 680,
        createdAt: new Date()
      },
      {
        id: '6',
        name: 'Rosé de Provence',
        category: DrinkCategory.VIN_ROSE,
        icon: '🍷',
        price: 9000,
        stock: 55,
        description: 'Vin rosé léger et fruité',
        sales: 145,
        createdAt: new Date()
      }
    ];
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
    console.log('Filtres appliqués:', result.length, 'résultats');
  }

  /**
   * Gère le changement de catégorie
   */
  onCategoryChange(): void {
    this.applyFilters();
  }

  /**
   * Gère le changement du terme de recherche
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedCategory = null;
    this.searchTerm = '';
    this.filteredDrinks = [...this.drinks];
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
    this.isEditMode = false;
    this.selectedDrink = null;
    this.drinkForm = this.getEmptyForm();
    this.isModalOpen = true;
  }

  /**
   * Ouvre le modal en mode modification
   */
  openEditModal(drink: Drink): void {
    this.isEditMode = true;
    this.selectedDrink = drink;
    this.drinkForm = {
      name: drink.name,
      category: drink.category,
      icon: drink.icon,
      price: drink.price,
      stock: drink.stock,
      description: drink.description || ''
    };
    this.isModalOpen = true;
  }

  /**
   * Ferme le modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.selectedDrink = null;
    this.drinkForm = this.getEmptyForm();
  }

  /**
   * Sauvegarde la boisson (ajout ou modification)
   */
  saveDrink(): void {
    // Validation basique
    if (!this.validateForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.isEditMode && this.selectedDrink) {
      // Mode modification
      this.updateDrink();
    } else {
      // Mode ajout
      this.addDrink();
    }
  }

  /**
   * Ajoute une nouvelle boisson
   */
  private addDrink(): void {
    const newDrink: Drink = {
      id: this.generateId(),
      name: this.drinkForm.name,
      category: this.drinkForm.category,
      icon: this.drinkForm.icon,
      price: this.drinkForm.price,
      stock: this.drinkForm.stock,
      description: this.drinkForm.description,
      sales: 0,
      createdAt: new Date()
    };

    this.drinks.unshift(newDrink);
    this.applyFilters();

    // TODO: Appel API
    console.log('Boisson ajoutée:', newDrink);

    alert('Boisson ajoutée avec succès !');
    this.closeModal();
  }

  /**
   * Met à jour une boisson existante
   */
  private updateDrink(): void {
    if (!this.selectedDrink) return;

    const index = this.drinks.findIndex(d => d.id === this.selectedDrink!.id);
    if (index !== -1) {
      this.drinks[index] = {
        ...this.selectedDrink,
        name: this.drinkForm.name,
        category: this.drinkForm.category,
        icon: this.drinkForm.icon,
        price: this.drinkForm.price,
        stock: this.drinkForm.stock,
        description: this.drinkForm.description
      };

      this.applyFilters();

      // TODO: Appel API
      console.log('Boisson mise à jour:', this.drinks[index]);

      alert('Boisson mise à jour avec succès !');
      this.closeModal();
    }
  }

  // ========================================
  // SUPPRESSION
  // ========================================

  /**
   * Supprime une boisson après confirmation
   */
  deleteDrink(drink: Drink): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${drink.name}" ?`)) {
      this.drinks = this.drinks.filter(d => d.id !== drink.id);
      this.applyFilters();

      // TODO: Appel API
      console.log('Boisson supprimée:', drink.id);

      alert('Boisson supprimée avec succès');
    }
  }

  // ========================================
  // VALIDATION
  // ========================================

  /**
   * Valide le formulaire
   * @returns true si le formulaire est valide
   */
  private validateForm(): boolean {
    return !!(
      this.drinkForm.name &&
      this.drinkForm.category &&
      this.drinkForm.icon &&
      this.drinkForm.price > 0 &&
      this.drinkForm.stock >= 0
    );
  }

  /**
   * Retourne un formulaire vide
   * @returns Formulaire initialisé
   */
  private getEmptyForm(): DrinkForm {
    return {
      name: '',
      category: DrinkCategory.VIN_ROUGE,
      icon: '🍷',
      price: 0,
      stock: 0,
      description: ''
    };
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

  /**
   * Exporte les boissons en CSV
   */
  exportToCSV(): void {
    console.log('Export des boissons en CSV...');
    // TODO: Implémenter l'export CSV
    alert('Boissons exportées avec succès !');
  }

  /**
   * Imprime les boissons
   */
  printDrinks(): void {
    window.print();
  }
}
