import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Interface pour les boissons vedettes du carousel
 */
interface FeaturedDrink {
  id: string;
  icon: string;
  name: string;
  category: string;
  price: string;
  stock: string;
}

/**
 * Interface pour les produits populaires
 */
interface PopularProduct {
  id: string;
  icon: string;
  name: string;
  category: string;
  sales: number;
  price: number;
  badge?: 'hot' | 'new';
}

/**
 * Interface pour une action récente
 */
interface RecentAction {
  id: string;
  type: 'add' | 'remove' | 'update' | 'alert';
  icon: string;
  title: string;
  details: string;
  time: string;
}

/**
 * Composant Home - Page d'accueil du dashboard
 * Affiche les statistiques, carousel, produits populaires et actions récentes
 */
@Component({
  selector: 'app-home',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Carousel des boissons vedettes
  featuredDrinks: FeaturedDrink[] = [];
  currentDrinkIndex: number = 0;
  carouselInterval: any;

  // Produits populaires
  products: PopularProduct[] = [];

  // Actions récentes
  recentActions: RecentAction[] = [];

  // État de chargement
  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  /**
   * Charge toutes les données du dashboard
   */
  loadDashboardData(): void {
    this.isLoading = true;

    // Charger les données (simulées pour la démo)
    this.featuredDrinks = this.generateFeaturedDrinks();
    this.products = this.generatePopularProducts();
    this.recentActions = this.generateRecentActions();

    this.isLoading = false;
  }

  /**
   * Génère les boissons vedettes pour le carousel
   */
  private generateFeaturedDrinks(): FeaturedDrink[] {
    return [
      {
        id: '1',
        icon: '🍷',
        name: 'Château Margaux 2015',
        category: 'Vin Rouge Premium',
        price: '450 000 FCFA',
        stock: 'Stock: 12 bouteilles'
      },
      {
        id: '2',
        icon: '🥂',
        name: 'Champagne Dom Pérignon',
        category: 'Champagne Prestige',
        price: '285 000 FCFA',
        stock: 'Stock: 8 bouteilles'
      },
      {
        id: '3',
        icon: '🥃',
        name: 'Whisky Macallan 18 ans',
        category: 'Spiritueux Haut de Gamme',
        price: '520 000 FCFA',
        stock: 'Stock: 5 bouteilles'
      },
      {
        id: '4',
        icon: '🍾',
        name: 'Moët & Chandon Impérial',
        category: 'Champagne',
        price: '85 000 FCFA',
        stock: 'Stock: 25 bouteilles'
      }
    ];
  }

  /**
   * Génère les produits populaires
   */
  private generatePopularProducts(): PopularProduct[] {
    return [
      {
        id: '1',
        icon: '🍷',
        name: 'Bordeaux Supérieur',
        category: 'Vin Rouge',
        sales: 156,
        price: 25000,
        badge: 'hot'
      },
      {
        id: '2',
        icon: '🥂',
        name: 'Champagne Brut',
        category: 'Champagne',
        sales: 98,
        price: 65000,
        badge: 'hot'
      },
      {
        id: '3',
        icon: '🍺',
        name: 'Heineken 33cl',
        category: 'Bière',
        sales: 432,
        price: 1500
      },
      {
        id: '4',
        icon: '🍾',
        name: 'Prosecco Italien',
        category: 'Vin Mousseux',
        sales: 67,
        price: 18000,
        badge: 'new'
      },
      {
        id: '5',
        icon: '🥃',
        name: 'Cognac Hennessy VS',
        category: 'Spiritueux',
        sales: 89,
        price: 45000
      },
      {
        id: '6',
        icon: '🍷',
        name: 'Chablis Grand Cru',
        category: 'Vin Blanc',
        sales: 54,
        price: 38000,
        badge: 'new'
      }
    ];
  }

  /**
   * Génère les actions récentes
   */
  private generateRecentActions(): RecentAction[] {
    return [
      {
        id: '1',
        type: 'add',
        icon: '📦',
        title: 'Nouvelle entrée de stock',
        details: '50 bouteilles de Château Margaux 2015 ajoutées',
        time: 'Il y a 5 min'
      },
      {
        id: '2',
        type: 'remove',
        icon: '📤',
        title: 'Sortie de stock',
        details: '12 bouteilles de Champagne Moët vendues',
        time: 'Il y a 15 min'
      },
      {
        id: '3',
        type: 'add',
        icon: '👤',
        title: 'Nouvel employé ajouté',
        details: 'Paul Mensah - Magasinier à Cave Principale',
        time: 'Il y a 1 heure'
      },
      {
        id: '4',
        type: 'alert',
        icon: '⚠️',
        title: 'Stock faible détecté',
        details: 'Heineken 33cl - Seulement 8 unités restantes',
        time: 'Il y a 2 heures'
      },
      {
        id: '5',
        type: 'update',
        icon: '✏️',
        title: 'Produit modifié',
        details: 'Prix du Martini Rosso mis à jour: 8500 FCFA',
        time: 'Il y a 3 heures'
      }
    ];
  }

  // ===== GESTION DU CAROUSEL =====

  /**
   * Démarre le carousel automatique
   */
  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextDrink();
    }, 5000); // Change toutes les 5 secondes
  }

  /**
   * Arrête le carousel
   */
  stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  /**
   * Retourne la boisson courante du carousel
   */
  getCurrentDrink(): FeaturedDrink {
    return this.featuredDrinks[this.currentDrinkIndex] || this.featuredDrinks[0];
  }

  /**
   * Passe à la boisson suivante
   */
  nextDrink(): void {
    this.currentDrinkIndex = (this.currentDrinkIndex + 1) % this.featuredDrinks.length;
  }

  /**
   * Revient à la boisson précédente
   */
  previousDrink(): void {
    this.currentDrinkIndex = this.currentDrinkIndex === 0
      ? this.featuredDrinks.length - 1
      : this.currentDrinkIndex - 1;
  }

  /**
   * Va à une boisson spécifique
   */
  goToDrink(index: number): void {
    this.currentDrinkIndex = index;
  }

  /**
   * Vérifie si un indicateur est actif
   */
  isIndicatorActive(index: number): boolean {
    return this.currentDrinkIndex === index;
  }

  // ===== UTILITAIRES =====

  /**
   * Formate un nombre avec séparateurs de milliers
   */
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Retourne la classe CSS selon le type d'action
   */
  getActionTypeClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'add': 'action-type-add',
      'remove': 'action-type-remove',
      'update': 'action-type-update',
      'alert': 'action-type-alert'
    };
    return classMap[type] || 'action-type-default';
  }
}
