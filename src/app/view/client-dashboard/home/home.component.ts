// ==========================================
// MISE À JOUR: src/app/view/client-dashboard/home/home.component.ts
// Intégration des services
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

}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.scss']
})
export class HomeComponent implements OnInit {

  promotions: Wine[] = [];

  newWines: Wine[] = [];

  caves = [
    { id: 1, name: 'Cave Prestige Paris', location: 'Paris 8ème', wines: 250, rating: 4.7, image: '🏛️', specialty: 'Grands Crus' },
    { id: 2, name: 'Cave d\'Excellence', location: 'Lyon', wines: 180, rating: 4.8, image: '🏛️', specialty: 'Bourgogne' },
    { id: 3, name: 'Cave du Sud', location: 'Marseille', wines: 120, rating: 4.5, image: '🏛️', specialty: 'Rhône & Provence' },
    { id: 4, name: 'Cave de Loire', location: 'Tours', wines: 95, rating: 4.6, image: '🏛️', specialty: 'Vins de Loire' }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private favorisService: FavorisService,
    private notificationService: NotificationService,
    private drinksService: DrinksService
  ) {}

  ngOnInit(): void {
    this.drinksService.getAll().subscribe({
      next: (drinks) => {
        this.promotions = drinks.filter(d => d.isFeatured).slice(0, 3).map(d => this.mapDrinkToWine(d));
        this.newWines = drinks.filter(d => d.badge === 'new' || d.isPopular).slice(0, 3).map(d => this.mapDrinkToWine(d));
      },
      error: (error) => {
        console.error('Erreur lors du chargement du catalogue (page d\'accueil) :', error);
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
      cave: ''
    };
  }

  addToCart(wine: Wine, event: Event): void {
    event.stopPropagation();

    this.cartService.addToCart({
      id: wine.id,
      name: wine.name,
      price: wine.price,
      image: wine.image,
      maxStock: 50
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
