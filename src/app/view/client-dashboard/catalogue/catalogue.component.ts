// ==========================================
// MISE À JOUR: src/app/view/client-dashboard/catalogue/catalogue.component.ts
// Intégration des services Cart, Favorites et Notifications
// ==========================================

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { FavorisService } from '../../../core/services/favoris.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DrinksService } from '../../../core/services/catalogue/drinks.service';
import { Drink } from '../../../core/models/Catalogue/Drink';

interface Wine {
  id: string;
  name: string;
  region: string;
  price: number;
  image: string;
  rating: number;
  type: string;
  grape: string;
  year: number;
  cave: string;
  stock: number;
}
@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
  wines: Wine[] = [];

  filteredWines: Wine[] = [];
  searchQuery = '';
  selectedType = 'all';
  selectedRegion = 'all';
  selectedPriceRange = 'all';
  sortBy = 'name';

  wineTypes = ['Rouge', 'Blanc', 'Rosé', 'Pétillant'];
  regions = ['Bordeaux', 'Bourgogne', 'Champagne', 'Loire', 'Rhône'];
  priceRanges = [
    { label: 'Moins de 50€', value: 'low' },
    { label: '50€ - 200€', value: 'mid' },
    { label: '200€ - 500€', value: 'high' },
    { label: 'Plus de 500€', value: 'premium' }
  ];

  sortOptions = [
    { label: 'Nom (A-Z)', value: 'name' },
    { label: 'Prix croissant', value: 'price-asc' },
    { label: 'Prix décroissant', value: 'price-desc' },
    { label: 'Meilleures notes', value: 'rating' },
    { label: 'Nouveautés', value: 'year' }
  ];

  viewMode: 'grid' | 'list' = 'grid';
  showFilters = true;

  constructor(
    private router: Router,
    private cartService: CartService,
    private favorisService: FavorisService,
    private notificationService: NotificationService,
    private drinksService: DrinksService
  ) {}

  ngOnInit(): void {
    this.loadWines();
  }

  loadWines(): void {
    this.drinksService.getAll().subscribe({
      next: (drinks) => {
        this.wines = drinks.map(d => this.mapDrinkToWine(d));
        this.applyFilters();
        console.log('Catalogue chargé depuis le backend :', this.wines.length);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du catalogue depuis le backend :', error);
        this.wines = [];
        this.applyFilters();
      }
    });
  }

  /** Convertit une boisson de l'API (modèle unifié) vers le modèle Wine local de cet écran. */
  private mapDrinkToWine(d: Drink): Wine {
    return {
      id: d.id,
      name: d.name,
      region: d.region || '',
      price: d.sellingPrice,
      image: d.image || d.icon || '🍷',
      rating: d.rating,
      type: d.category,
      grape: d.grapeVariety || '',
      year: d.vintage ? parseInt(d.vintage, 10) || 0 : 0,
      cave: '', // Le rattachement à une cave précise se fait via StockLevelsController, non joint ici.
      stock: 0  // Idem : le stock réel vient de StockLevelsController par cave.
    };
  }

  applyFilters(): void {
    let result = [...this.wines];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(wine =>
        wine.name.toLowerCase().includes(query) ||
        wine.region.toLowerCase().includes(query) ||
        wine.grape.toLowerCase().includes(query) ||
        wine.cave.toLowerCase().includes(query)
      );
    }

    if (this.selectedType !== 'all') {
      result = result.filter(wine => wine.type === this.selectedType);
    }

    if (this.selectedRegion !== 'all') {
      result = result.filter(wine => wine.region === this.selectedRegion);
    }

    if (this.selectedPriceRange !== 'all') {
      result = result.filter(wine => {
        switch (this.selectedPriceRange) {
          case 'low': return wine.price < 50;
          case 'mid': return wine.price >= 50 && wine.price < 200;
          case 'high': return wine.price >= 200 && wine.price < 500;
          case 'premium': return wine.price >= 500;
          default: return true;
        }
      });
    }

    this.sortWines(result);
    this.filteredWines = result;
  }

  sortWines(wines: Wine[]): void {
    wines.sort((a, b) => {
      switch (this.sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'year': return b.year - a.year;
        default: return 0;
      }
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedType = 'all';
    this.selectedRegion = 'all';
    this.selectedPriceRange = 'all';
    this.sortBy = 'name';
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  viewWineDetail(wine: Wine): void {
    this.router.navigate(['/client/wine-detail', wine.id]);
  }

  addToCart(wine: Wine, event: Event): void {
    event.stopPropagation();

    this.cartService.addToCart({
      id: wine.id,
      name: wine.name,
      price: wine.price,
      image: wine.image,
      maxStock: wine.stock
    });

    this.notificationService.success(`${wine.name} ajouté au panier !`);
  }

  toggleFavorite(wine: Wine, event: Event): void {
    event.stopPropagation();

    const isFav = this.favorisService.toggleFavorite({
      id: wine.id,
      type: 'wine',
      name: wine.name,
      image: wine.image,
      price: wine.price,
      region: wine.region,
      year: wine.year,
      rating: wine.rating,
      cave: wine.cave
    });

    if (isFav) {
      this.notificationService.success(`${wine.name} ajouté aux favoris !`);
    } else {
      this.notificationService.info(`${wine.name} retiré des favoris`);
    }
  }

  isFavorite(wine: Wine): boolean {
    return this.favorisService.isFavorite(wine.id, 'wine');
  }
}

