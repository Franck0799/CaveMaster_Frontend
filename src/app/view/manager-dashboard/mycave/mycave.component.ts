// ==========================================
// MY CAVE COMPONENT (Gestion cave assignée)
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';


interface WineProduct {
  id: string;
  name: string;
  category: string;
  vintage: string;
  price: number;
  stock: number;
  minStock: number;
  location: string;
  supplier: string;
  image?: string;
}

@Component({
  selector: 'app-mycave',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: `./mycave.component.html`,
  styleUrls:[ `./mycave.component.scss`]
})
export class MyCaveComponent implements OnInit {
  caveName = 'Cave Bordeaux';
  selectedCategory = 'all';
  stockFilter = 'all';
  searchTerm = '';

  products: WineProduct[] = [
    {
      id: '1',
      name: 'Château Margaux',
      category: 'Vin Rouge',
      vintage: '2015',
      price: 450.00,
      stock: 2,
      minStock: 5,
      location: 'A-12',
      supplier: 'Vignobles Margaux'
    },
    {
      id: '2',
      name: 'Moët & Chandon Brut',
      category: 'Champagne',
      vintage: '2018',
      price: 45.00,
      stock: 1,
      minStock: 3,
      location: 'C-05',
      supplier: 'Champagne House'
    },
    {
      id: '3',
      name: 'Château d\'Yquem',
      category: 'Vin Blanc',
      vintage: '2014',
      price: 280.00,
      stock: 15,
      minStock: 5,
      location: 'B-08',
      supplier: 'Sauternes Premium'
    },
    {
      id: '4',
      name: 'Glenfiddich 18 ans',
      category: 'Spiritueux',
      vintage: '2005',
      price: 85.00,
      stock: 0,
      minStock: 2,
      location: 'D-15',
      supplier: 'Scotland Distillery'
    },
    {
      id: '5',
      name: 'Châteauneuf-du-Pape',
      category: 'Vin Rouge',
      vintage: '2019',
      price: 65.00,
      stock: 24,
      minStock: 10,
      location: 'A-20',
      supplier: 'Rhône Valley Wines'
    },
    {
      id: '6',
      name: 'Dom Pérignon',
      category: 'Champagne',
      vintage: '2012',
      price: 180.00,
      stock: 8,
      minStock: 5,
      location: 'C-01',
      supplier: 'Champagne Premium'
    }
  ];

  filteredProducts: WineProduct[] = [];

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.products;

    // Filtre catégorie
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filtre stock
    if (this.stockFilter === 'low') {
      filtered = filtered.filter(p => this.isLowStock(p));
    } else if (this.stockFilter === 'ok') {
      filtered = filtered.filter(p => !this.isLowStock(p) && p.stock > 0);
    } else if (this.stockFilter === 'out') {
      filtered = filtered.filter(p => p.stock === 0);
    }

    // Recherche
    if (this.searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredProducts = filtered;
  }

  isLowStock(product: WineProduct): boolean {
    return product.stock > 0 && product.stock < product.minStock;
  }

  getLowStockCount(): number {
    return this.products.filter(p => this.isLowStock(p)).length;
  }

  getTotalValue(): number {
    return this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  }

  getUniqueCategories(): number {
    return new Set(this.products.map(p => p.category)).size;
  }

  adjustStock(product: WineProduct): void {
    console.log('Ajuster stock:', product);
  }

  viewDetails(product: WineProduct): void {
    console.log('Voir détails:', product);
  }

  exportInventory(): void {
    console.log('Exporter inventaire');
  }
}
