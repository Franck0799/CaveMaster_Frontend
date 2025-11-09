// ==========================================
// FICHIER: src/app/client/catalogue/catalogue.component.ts
// DESCRIPTION: Page du catalogue des vins - CORRIGÉ
// ==========================================

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';  // ✅ Ajout de RouterModule
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule  // ✅ Ajout de RouterModule dans les imports
  ],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {

  // Liste complète des vins
  wines: Wine[] = [
    { id: 1, name: 'Château Margaux 2015', region: 'Bordeaux', price: 450, image: '🍷', rating: 4.8, type: 'Rouge', grape: 'Cabernet Sauvignon', year: 2015, cave: 'Cave Prestige Paris', stock: 12 },
    { id: 2, name: 'Domaine de la Romanée-Conti', region: 'Bourgogne', price: 1200, image: '🍷', rating: 5.0, type: 'Rouge', grape: 'Pinot Noir', year: 2016, cave: 'Cave d\'Excellence', stock: 3 },
    { id: 3, name: 'Champagne Dom Pérignon', region: 'Champagne', price: 180, image: '🥂', rating: 4.9, type: 'Pétillant', grape: 'Chardonnay', year: 2012, cave: 'Cave Prestige Paris', stock: 25 },
    { id: 4, name: 'Châteauneuf-du-Pape', region: 'Rhône', price: 85, image: '🍷', rating: 4.6, type: 'Rouge', grape: 'Grenache', year: 2018, cave: 'Cave du Sud', stock: 18 },
    { id: 5, name: 'Sancerre Blanc', region: 'Loire', price: 32, image: '🍾', rating: 4.4, type: 'Blanc', grape: 'Sauvignon Blanc', year: 2020, cave: 'Cave de Loire', stock: 45 },
    { id: 6, name: 'Pouilly-Fuissé', region: 'Bourgogne', price: 45, image: '🍾', rating: 4.5, type: 'Blanc', grape: 'Chardonnay', year: 2019, cave: 'Cave d\'Excellence', stock: 32 },
    { id: 7, name: 'Chablis Grand Cru', region: 'Bourgogne', price: 95, image: '🍾', rating: 4.7, type: 'Blanc', grape: 'Chardonnay', year: 2018, cave: 'Cave d\'Excellence', stock: 15 },
    { id: 8, name: 'Pomerol Château Pétrus', region: 'Bordeaux', price: 2500, image: '🍷', rating: 5.0, type: 'Rouge', grape: 'Merlot', year: 2015, cave: 'Cave Prestige Paris', stock: 2 },
    { id: 9, name: 'Côtes du Rhône Villages', region: 'Rhône', price: 22, image: '🍷', rating: 4.2, type: 'Rouge', grape: 'Grenache', year: 2020, cave: 'Cave du Sud', stock: 65 },
    { id: 10, name: 'Muscadet Sèvre et Maine', region: 'Loire', price: 18, image: '🍾', rating: 4.0, type: 'Blanc', grape: 'Melon', year: 2021, cave: 'Cave de Loire', stock: 80 },
  ];

  // Vins filtrés affichés
  filteredWines: Wine[] = [];

  // Filtres
  searchQuery = '';
  selectedType = 'all';
  selectedRegion = 'all';
  selectedPriceRange = 'all';
  sortBy = 'name';

  // Options de filtres
  wineTypes = ['Rouge', 'Blanc', 'Rosé', 'Pétillant'];
  regions = ['Bordeaux', 'Bourgogne', 'Champagne', 'Loire', 'Rhône', 'Alsace', 'Provence'];
  priceRanges = [
    { label: 'Moins de 50€', value: 'low' },
    { label: '50€ - 200€', value: 'mid' },
    { label: '200€ - 500€', value: 'high' },
    { label: 'Plus de 500€', value: 'premium' }
  ];

  // Options de tri
  sortOptions = [
    { label: 'Nom (A-Z)', value: 'name' },
    { label: 'Prix croissant', value: 'price-asc' },
    { label: 'Prix décroissant', value: 'price-desc' },
    { label: 'Meilleures notes', value: 'rating' },
    { label: 'Nouveautés', value: 'year' }
  ];

  // État de la vue
  viewMode: 'grid' | 'list' = 'grid';
  showFilters = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  // Appliquer tous les filtres
  applyFilters(): void {
    let result = [...this.wines];

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(wine =>
        wine.name.toLowerCase().includes(query) ||
        wine.region.toLowerCase().includes(query) ||
        wine.grape.toLowerCase().includes(query) ||
        wine.cave.toLowerCase().includes(query)
      );
    }

    // Filtre par type
    if (this.selectedType !== 'all') {
      result = result.filter(wine => wine.type === this.selectedType);
    }

    // Filtre par région
    if (this.selectedRegion !== 'all') {
      result = result.filter(wine => wine.region === this.selectedRegion);
    }

    // Filtre par prix
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

    // Tri
    this.sortWines(result);

    this.filteredWines = result;
  }

  // Trier les vins
  sortWines(wines: Wine[]): void {
    wines.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.year - a.year;
        default:
          return 0;
      }
    });
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedType = 'all';
    this.selectedRegion = 'all';
    this.selectedPriceRange = 'all';
    this.sortBy = 'name';
    this.applyFilters();
  }

  // Toggle vue grille/liste
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // Toggle affichage des filtres
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // Voir détails d'un vin
  viewWineDetail(wine: Wine): void {
    this.router.navigate(['/client/wine-detail', wine.id]);
  }

  // Ajouter au panier
  addToCart(wine: Wine, event: Event): void {
    event.stopPropagation();
    console.log('Ajout au panier:', wine);
    // Logique d'ajout au panier
  }

  // Ajouter aux favoris
  toggleFavorite(wine: Wine, event: Event): void {
    event.stopPropagation();
    console.log('Toggle favori:', wine);
    // Logique de gestion des favoris
  }
}
