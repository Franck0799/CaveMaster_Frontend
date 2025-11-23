// ==========================================
// FICHIER: src/app/server/wine-suggestions/wine-suggestions.component.ts
// DESCRIPTION: Aide aux suggestions de vins et accords mets-vins
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // ← CORRECTION ICI
import { NotificationService } from '../../../core/services/notification.service';

interface Wine {
  id: number;
  name: string;
  region: string;
  year: number;
  type: 'red' | 'white' | 'rosé' | 'sparkling';
  price: number;
  description: string;
  grapeVariety: string;
  temperature: string;
  pairings: string[];
  stock: number;
  rating: number;
  image?: string;
}

interface DishCategory {
  id: string;
  name: string;
  icon: string;
  suggestedTypes: string[];
}

@Component({
  selector: 'app-wine-suggestions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './wine-suggestions.component.html',
  styleUrls: ['./wine-suggestions.component.scss']
})
export class WineSuggestionsComponent implements OnInit {
  selectedDish?: string;
  selectedWineType: string = 'all';
  selectedPriceRange: string = 'all';
  searchQuery = '';

  dishCategories: DishCategory[] = [
    { id: 'red-meat', name: 'Viandes Rouges', icon: 'meat', suggestedTypes: ['red'] },
    { id: 'white-meat', name: 'Viandes Blanches', icon: 'chicken', suggestedTypes: ['white', 'rosé'] },
    { id: 'fish', name: 'Poissons', icon: 'fish', suggestedTypes: ['white'] },
    { id: 'seafood', name: 'Fruits de Mer', icon: 'shell', suggestedTypes: ['white', 'sparkling'] },
    { id: 'pasta', name: 'Pâtes', icon: 'pasta', suggestedTypes: ['red', 'white'] },
    { id: 'cheese', name: 'Fromages', icon: 'cheese', suggestedTypes: ['red', 'white'] },
    { id: 'dessert', name: 'Desserts', icon: 'cake', suggestedTypes: ['sparkling', 'white'] }
  ];

  wines: Wine[] = [
    {
      id: 1,
      name: 'Château Margaux 2015',
      region: 'Bordeaux - Margaux',
      year: 2015,
      type: 'red',
      price: 85.00,
      description: 'Grand cru classé, élégant et puissant',
      grapeVariety: 'Cabernet Sauvignon, Merlot',
      temperature: '16-18°C',
      pairings: ['Viandes rouges', 'Gibier', 'Fromages affinés'],
      stock: 8,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Chablis Grand Cru 2018',
      region: 'Bourgogne - Chablis',
      year: 2018,
      type: 'white',
      price: 45.00,
      description: 'Minéral et frais, typique du terroir',
      grapeVariety: 'Chardonnay',
      temperature: '10-12°C',
      pairings: ['Fruits de mer', 'Poissons', 'Chèvre frais'],
      stock: 12,
      rating: 4.6
    },
    {
      id: 3,
      name: 'Châteauneuf-du-Pape 2016',
      region: 'Vallée du Rhône',
      year: 2016,
      type: 'red',
      price: 55.00,
      description: 'Puissant et épicé, longue finale',
      grapeVariety: 'Grenache, Syrah, Mourvèdre',
      temperature: '16-18°C',
      pairings: ['Viandes en sauce', 'Gibier', 'Plats mijotés'],
      stock: 15,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Sancerre Blanc 2020',
      region: 'Loire',
      year: 2020,
      type: 'white',
      price: 28.00,
      description: 'Vif et aromatique, notes d\'agrumes',
      grapeVariety: 'Sauvignon Blanc',
      temperature: '8-10°C',
      pairings: ['Poissons grillés', 'Salades', 'Fromage de chèvre'],
      stock: 20,
      rating: 4.5
    },
    {
      id: 5,
      name: 'Champagne Veuve Clicquot Brut',
      region: 'Champagne',
      year: 0,
      type: 'sparkling',
      price: 65.00,
      description: 'Élégant et raffiné, bulles fines',
      grapeVariety: 'Pinot Noir, Chardonnay',
      temperature: '6-8°C',
      pairings: ['Apéritif', 'Fruits de mer', 'Desserts légers'],
      stock: 10,
      rating: 4.9
    },
    {
      id: 6,
      name: 'Côtes du Rhône Villages 2019',
      region: 'Vallée du Rhône',
      year: 2019,
      type: 'red',
      price: 18.00,
      description: 'Fruité et équilibré, excellent rapport qualité-prix',
      grapeVariety: 'Grenache, Syrah',
      temperature: '15-17°C',
      pairings: ['Grillades', 'Pâtes', 'Charcuterie'],
      stock: 25,
      rating: 4.3
    },
    {
      id: 7,
      name: 'Pouilly-Fuissé 2019',
      region: 'Bourgogne - Mâconnais',
      year: 2019,
      type: 'white',
      price: 35.00,
      description: 'Riche et crémeux, notes de fruits blancs',
      grapeVariety: 'Chardonnay',
      temperature: '11-13°C',
      pairings: ['Poissons en sauce', 'Volailles', 'Fromages crémeux'],
      stock: 14,
      rating: 4.4
    },
    {
      id: 8,
      name: 'Bandol Rosé 2021',
      region: 'Provence',
      year: 2021,
      type: 'rosé',
      price: 22.00,
      description: 'Frais et fruité, robe saumonée',
      grapeVariety: 'Mourvèdre, Grenache, Cinsault',
      temperature: '8-10°C',
      pairings: ['Salades', 'Grillades', 'Cuisine méditerranéenne'],
      stock: 18,
      rating: 4.2
    }
  ];

  filteredWines: Wine[] = [];
  selectedWine?: Wine;

  constructor(private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedDish = params['dishes'];
    });

    this.filterWines();
  }

  filterWines(): void {
    let wines = [...this.wines];

    // Filtre par type
    if (this.selectedWineType !== 'all') {
      wines = wines.filter(wine => wine.type === this.selectedWineType);
    }

    // Filtre par prix
    if (this.selectedPriceRange !== 'all') {
      wines = wines.filter(wine => {
        switch (this.selectedPriceRange) {
          case 'low': return wine.price < 30;
          case 'medium': return wine.price >= 30 && wine.price < 60;
          case 'high': return wine.price >= 60;
          default: return true;
        }
      });
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      wines = wines.filter(wine =>
        wine.name.toLowerCase().includes(query) ||
        wine.region.toLowerCase().includes(query) ||
        wine.grapeVariety.toLowerCase().includes(query) ||
        wine.pairings.some(p => p.toLowerCase().includes(query))
      );
    }

    this.filteredWines = wines;
  }

  selectDishCategory(category: DishCategory): void {
    // Afficher les vins compatibles avec ce type de plat
    this.filteredWines = this.wines.filter(wine =>
      category.suggestedTypes.includes(wine.type)
    );
  }

  selectWine(wine: Wine): void {
    this.selectedWine = this.selectedWine?.id === wine.id ? undefined : wine;
  }

  getWineTypeLabel(type: string): string {
    const labels: any = {
      'red': 'Rouge',
      'white': 'Blanc',
      'rosé': 'Rosé',
      'sparkling': 'Effervescent'
    };
    return labels[type] || type;
  }

  getWineTypeIcon(type: string): string {
    const icons: any = {
      'red': '🍷',
      'white': '🥂',
      'rosé': '🌸',
      'sparkling': '🍾'
    };
    return icons[type] || '🍷';
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'Rupture';
    if (stock < 5) return 'Stock faible';
    return 'En stock';
  }

  getStockColor(stock: number): string {
    if (stock === 0) return 'danger';
    if (stock < 5) return 'warning';
    return 'success';
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalfStar) {
      stars.push('half');
    }
    while (stars.length < 5) {
      stars.push('empty');
    }

    return stars;
  }

  addToOrder(wine: Wine): void {
    // TODO: Ajouter au panier / à la commande
    console.log('Add wine to order:', wine);
    alert(`${wine.name} ajouté à la commande`);
  }

  viewWineDetails(wine: Wine): void {
    // TODO: Ouvrir modal avec détails complets
    this.selectedWine = wine;
  }

  resetFilters(): void {
    this.selectedWineType = 'all';
    this.selectedPriceRange = 'all';
    this.searchQuery = '';
    this.filterWines();
  }
}
