// ==========================================
// FICHIER: src/app/server/orders/orders.component.ts
// DESCRIPTION: Prise de commande avec carte interactive
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
  isWine?: boolean;
  wineType?: string;
  year?: number;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  wineRecommendation?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-server-orders',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule,RouterModule, ReactiveFormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  tableId?: number;
  tableNumber?: string;

  categories: Category[] = [
    { id: 'all', name: 'Tout', icon: 'grid', count: 0 },
    { id: 'starters', name: 'Entrées', icon: 'coffee', count: 8 },
    { id: 'mains', name: 'Plats', icon: 'utensils', count: 12 },
    { id: 'desserts', name: 'Desserts', icon: 'cake', count: 6 },
    { id: 'wines', name: 'Vins', icon: 'wine', count: 25 },
    { id: 'drinks', name: 'Boissons', icon: 'droplet', count: 10 }
  ];

  selectedCategory = 'all';
  searchQuery = '';

  menuItems: MenuItem[] = [
    // Entrées
    { id: 1, name: 'Salade César', category: 'starters', price: 12.50, description: 'Salade verte, poulet, parmesan, croûtons', available: true },
    { id: 2, name: 'Foie Gras Poêlé', category: 'starters', price: 18.00, description: 'Foie gras, chutney de figues', available: true },
    { id: 3, name: 'Carpaccio de Bœuf', category: 'starters', price: 15.00, description: 'Bœuf mariné, roquette, copeaux de parmesan', available: true },

    // Plats
    { id: 4, name: 'Magret de Canard', category: 'mains', price: 24.00, description: 'Magret rôti, sauce aux fruits rouges, gratin dauphinois', available: true },
    { id: 5, name: 'Pavé de Saumon', category: 'mains', price: 22.00, description: 'Saumon grillé, légumes de saison, sauce hollandaise', available: true },
    { id: 6, name: 'Entrecôte Grillée', category: 'mains', price: 26.00, description: 'Entrecôte 300g, frites maison, sauce au poivre', available: true },
    { id: 7, name: 'Risotto aux Champignons', category: 'mains', price: 19.00, description: 'Risotto crémeux, champignons frais, parmesan', available: true },

    // Desserts
    { id: 8, name: 'Tiramisu', category: 'desserts', price: 8.50, description: 'Tiramisu maison au mascarpone', available: true },
    { id: 9, name: 'Moelleux au Chocolat', category: 'desserts', price: 9.00, description: 'Moelleux coulant, glace vanille', available: true },
    { id: 10, name: 'Crème Brûlée', category: 'desserts', price: 7.50, description: 'Crème brûlée traditionnelle', available: true },

    // Vins
    { id: 11, name: 'Château Margaux 2015', category: 'wines', price: 85.00, description: 'Rouge - Bordeaux', available: true, isWine: true, wineType: 'red', year: 2015 },
    { id: 12, name: 'Chablis Grand Cru', category: 'wines', price: 45.00, description: 'Blanc - Bourgogne', available: true, isWine: true, wineType: 'white', year: 2018 },
    { id: 13, name: 'Champagne Veuve Clicquot', category: 'wines', price: 65.00, description: 'Brut - Champagne', available: true, isWine: true, wineType: 'sparkling' },

    // Boissons
    { id: 14, name: 'Eau Minérale', category: 'drinks', price: 4.00, available: true },
    { id: 15, name: 'Coca-Cola', category: 'drinks', price: 4.50, available: true },
    { id: 16, name: 'Jus d\'Orange Pressé', category: 'drinks', price: 5.50, available: true }
  ];

  filteredItems: MenuItem[] = [];
  cart: OrderItem[] = [];
  showWineSuggestions = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tableId = params['tableId'];
      this.tableNumber = params['tableNumber'];
    });

    this.updateCategoryCount();
    this.filterItems();
  }

  updateCategoryCount(): void {
    const allCategory = this.categories.find(c => c.id === 'all');
    if (allCategory) {
      allCategory.count = this.menuItems.filter(item => item.available).length;
    }
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterItems();
  }

  filterItems(): void {
    let items = this.menuItems.filter(item => item.available);

    // Filtre par catégorie
    if (this.selectedCategory !== 'all') {
      items = items.filter(item => item.category === this.selectedCategory);
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    this.filteredItems = items;
  }

  addToCart(item: MenuItem): void {
    const existingItem = this.cart.find(cartItem => cartItem.menuItem.id === item.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        menuItem: item,
        quantity: 1
      });
    }

    // Suggérer des vins si c'est un plat
    if (item.category === 'mains') {
      this.showWineSuggestions = true;
    }
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
  }

  updateQuantity(index: number, delta: number): void {
    const item = this.cart[index];
    item.quantity += delta;

    if (item.quantity <= 0) {
      this.removeFromCart(index);
    }
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) =>
      total + (item.menuItem.price * item.quantity), 0
    );
  }

  getCartItemsCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  sendToKitchen(): void {
    if (this.cart.length === 0) {
      alert('Le panier est vide');
      return;
    }

    if (!this.tableNumber) {
      alert('Aucune table sélectionnée');
      return;
    }

    // TODO: Envoyer la commande au backend
    console.log('Commande envoyée:', {
      tableId: this.tableId,
      tableNumber: this.tableNumber,
      items: this.cart,
      total: this.getCartTotal()
    });

    alert(`Commande envoyée pour la table ${this.tableNumber} !`);
    this.cart = [];
    this.router.navigate(['/server/active-orders']);
  }

  clearCart(): void {
    if (confirm('Vider le panier ?')) {
      this.cart = [];
    }
  }

  goToWineSuggestions(): void {
    // Récupérer les plats du panier
    const mains = this.cart
      .filter(item => item.menuItem.category === 'mains')
      .map(item => item.menuItem.name);

    this.router.navigate(['/server/wine-suggestions'], {
      queryParams: { dishes: mains.join(',') }
    });
  }

  addNoteToItem(index: number): void {
    const note = prompt('Ajouter une note pour cet item:');
    if (note !== null) {
      this.cart[index].notes = note;
    }
  }

  getWineTypeIcon(wineType?: string): string {
  const icons: any = {
    'red': '🍷',      // Rouge
    'white': '🥂',    // Blanc
    'rosé': '🌸',     // Rosé
    'sparkling': '🍾' // Effervescent
  };
  return icons[wineType || ''] || '🍷';
}
}

