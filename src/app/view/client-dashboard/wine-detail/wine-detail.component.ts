// ==========================================
// FICHIER: src/app/view/client-dashboard/wine-detail/wine-detail.component.ts
// DESCRIPTION: Page de détail d'un vin
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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
  description: string;
  alcohol: number;
  volume: number;
  temperature: string;
}

@Component({
  selector: 'app-wine-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: `./wine-detail.component.html`,
  styleUrls: [`./wine-detailcomponent.scss`]
})
export class WineDetailComponent implements OnInit {
  wine: Wine | null = null;
  quantity = 1;
  isFavorite = false;
  similarWines: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadWine(id);
    this.loadSimilarWines();
  }

  loadWine(id: number): void {
    // Simulation - Remplacer par un service réel
    this.wine = {
      id,
      name: 'Château Margaux 2015',
      region: 'Bordeaux',
      price: 450,
      image: '🍷',
      rating: 4.8,
      type: 'Rouge',
      grape: 'Cabernet Sauvignon',
      year: 2015,
      cave: 'Cave Prestige Paris',
      stock: 12,
      description: 'Un vin d\'exception du prestigieux domaine de Château Margaux. Ce millésime 2015 offre une complexité aromatique remarquable avec des notes de fruits noirs, de violette et d\'épices douces. La structure tannique est puissante mais élégante, promettant un grand potentiel de garde.',
      alcohol: 13.5,
      volume: 750,
      temperature: '16-18°C'
    };
  }

  loadSimilarWines(): void {
    this.similarWines = [
      { id: 2, name: 'Château Latour', price: 520, image: '🍷' },
      { id: 4, name: 'Pauillac Reserve', price: 380, image: '🍷' },
      { id: 6, name: 'Saint-Julien', price: 290, image: '🍷' },
      { id: 8, name: 'Pomerol Excellence', price: 410, image: '🍷' }
    ];
  }

  goBack(): void {
    this.router.navigate(['/client/catalogue']);
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    // TODO: Implémenter le service de favoris
  }

  increaseQuantity(): void {
    if (this.wine && this.quantity < this.wine.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    console.log(`Ajout de ${this.quantity} x ${this.wine?.name} au panier`);
    // TODO: Implémenter le service de panier
    alert(`${this.quantity} bouteille(s) ajoutée(s) au panier !`);
  }

  viewWine(id: number): void {
    this.router.navigate(['/client/wine-detail', id]);
    window.scrollTo(0, 0);
  }
}
