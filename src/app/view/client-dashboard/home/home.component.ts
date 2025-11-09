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

}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: '../home/home.component.html',
  styleUrls: ['../home/home.component.scss']
})
export class HomeComponent implements OnInit {

  promotions: Wine[] = [
    { id: 1, name: 'Château Margaux 2015', region: 'Bordeaux', price: 450, image: '🍷', rating: 4.8, type: 'Rouge', grape: 'Cabernet Sauvignon', year: 2015, cave: 'Cave Prestige Paris' },
    { id: 2, name: 'Domaine de la Romanée-Conti', region: 'Bourgogne', price: 1200, image: '🍷', rating: 5.0, type: 'Rouge', grape: 'Pinot Noir', year: 2016, cave: 'Cave d\'Excellence' },
    { id: 3, name: 'Champagne Dom Pérignon', region: 'Champagne', price: 180, image: '🥂', rating: 4.9, type: 'Pétillant', grape: 'Chardonnay', year: 2012, cave: 'Cave Prestige Paris' }
  ];

  newWines: Wine[] = [
    { id: 4, name: 'Châteauneuf-du-Pape', region: 'Rhône', price: 85, image: '🍷', rating: 4.6, type: 'Rouge', grape: 'Grenache', year: 2018, cave: 'Cave du Sud' },
    { id: 5, name: 'Sancerre Blanc', region: 'Loire', price: 32, image: '🍾', rating: 4.4, type: 'Blanc', grape: 'Sauvignon Blanc', year: 2020, cave: 'Cave de Loire' },
    { id: 6, name: 'Pouilly-Fuissé', region: 'Bourgogne', price: 45, image: '🍾', rating: 4.5, type: 'Blanc', grape: 'Chardonnay', year: 2019, cave: 'Cave d\'Excellence' }
  ];

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
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

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
