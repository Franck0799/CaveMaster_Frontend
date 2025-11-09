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

interface Wine {
  id: number;
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
  wines: Wine[] = [
    { id: 1, name: 'Château Margaux 2015', region: 'Bordeaux', price: 450, image: '🍷', rating: 4.8, type: 'Rouge', grape: 'Cabernet Sauvignon', year: 2015, cave: 'Cave Prestige Paris', stock: 12 },
    { id: 2, name: 'Domaine de la Romanée-Conti', region: 'Bourgogne', price: 1200, image: '🍷', rating: 5.0, type: 'Rouge', grape: 'Pinot Noir', year: 2016, cave: 'Cave d\'Excellence', stock: 3 },
    { id: 3, name: 'Champagne Dom Pérignon', region: 'Champagne', price: 180, image: '🥂', rating: 4.9, type: 'Pétillant', grape: 'Chardonnay', year: 2012, cave: 'Cave Prestige Paris', stock: 25 },
    { id: 4, name: 'Châteauneuf-du-Pape', region: 'Rhône', price: 85, image: '🍷', rating: 4.6, type: 'Rouge', grape: 'Grenache', year: 2018, cave: 'Cave du Sud', stock: 18 },
    { id: 5, name: 'Sancerre Blanc', region: 'Loire', price: 32, image: '🍾', rating: 4.4, type: 'Blanc', grape: 'Sauvignon Blanc', year: 2020, cave: 'Cave de Loire', stock: 45 },
    { id: 6, name: 'Pouilly-Fuissé', region: 'Bourgogne', price: 45, image: '🍾', rating: 4.5, type: 'Blanc', grape: 'Chardonnay', year: 2019, cave: 'Cave d\'Excellence', stock: 32 },
  ];

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
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.applyFilters();
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

