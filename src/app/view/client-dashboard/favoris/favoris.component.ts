import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavorisService, FavoriteItem } from '../../../core/services/favoris.service'; // ✅ Import correct
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.scss']
})
export class FavorisComponent implements OnInit {
  activeTab: 'wines' | 'caves' = 'wines';

  favoriteWines$!: Observable<FavoriteItem[]>;
  favoriteCaves$!: Observable<FavoriteItem[]>;

  constructor(
    private router: Router,
    private favorisService: FavorisService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // ✅ Utiliser les observables du service
    this.favoriteWines$ = this.favorisService.winesFavorites$;
    this.favoriteCaves$ = this.favorisService.cavesFavorites$;
  }

  setActiveTab(tab: 'wines' | 'caves'): void {
    this.activeTab = tab;
  }

  // ✅ Utiliser le service pour retirer des favoris
  removeWine(wine: FavoriteItem, event: Event): void {
    event.stopPropagation();

    if (this.favorisService.removeFromFavorites(wine.id, 'wine')) {
      this.notificationService.success(`${wine.name} retiré des favoris`);
    }
  }

  removeCave(cave: FavoriteItem, event: Event): void {
    event.stopPropagation();

    if (this.favorisService.removeFromFavorites(cave.id, 'cave')) {
      this.notificationService.success(`${cave.name} retiré des favoris`);
    }
  }

  viewWineDetail(wine: FavoriteItem): void {
    this.router.navigate(['/client/wine-detail', wine.id]);
  }

  viewCave(cave: FavoriteItem): void {
    this.router.navigate(['/client/cave-detail', cave.id]);
  }

  // ✅ Utiliser le service de panier
  addToCart(wine: FavoriteItem, event: Event): void {
    event.stopPropagation();

    if (this.cartService.addToCart({
      id: wine.id,
      name: wine.name,
      price: wine.price || 0,
      image: wine.image,
      maxStock: 50 // Valeur par défaut
    })) {
      this.notificationService.success(`${wine.name} ajouté au panier !`);
    }
  }

  goToCatalogue(): void {
    this.router.navigate(['/client/catalogue']);
  }
}
