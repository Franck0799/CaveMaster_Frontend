// ==========================================
// INVENTORY COMPONENT (Inventaire)
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lastInventory: Date;
  variance: number;
}

@Component({
  selector: 'app-inventory',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./inventory.component.html`,
  styleUrls: [`./inventory.component.scss`]
})
export class InventoryComponent implements OnInit {
  lastUpdate = new Date();
  selectedCategory = 'all';
  searchTerm = '';

  items: InventoryItem[] = [
    {
      id: '1',
      name: 'Château Margaux 2015',
      category: 'Vin Rouge',
      stock: 24,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: -2
    },
    {
      id: '2',
      name: 'Moët & Chandon Brut',
      category: 'Champagne',
      stock: 18,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: 0
    },
    {
      id: '3',
      name: 'Château d\'Yquem',
      category: 'Vin Blanc',
      stock: 12,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: +1
    },
    {
      id: '4',
      name: 'Glenfiddich 18 ans',
      category: 'Spiritueux',
      stock: 6,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: -1
    }
  ];

  filteredItems: InventoryItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.items;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredItems = filtered;
  }

  updateStock(item: InventoryItem): void {
    console.log('Stock mis à jour:', item);
  }

  viewHistory(item: InventoryItem): void {
    console.log('Voir historique:', item);
  }

  adjustStock(item: InventoryItem): void {
    console.log('Ajuster stock:', item);
  }

  startInventory(): void {
    console.log('Démarrer un nouvel inventaire');
  }

  exportInventory(): void {
    console.log('Exporter l\'inventaire');
  }
}
