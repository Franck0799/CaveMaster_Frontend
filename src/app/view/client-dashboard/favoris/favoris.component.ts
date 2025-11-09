// ==========================================
// FICHIER: src/app/client/favorites/favorites.component.ts
// DESCRIPTION: Page des favoris (vins et caves)
// ==========================================

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Wine {
  id: number;
  name: string;
  region: string;
  price: number;
  image: string;
  rating: number;
  year: number;
  cave: string;
}

interface Cave {
  id: number;
  name: string;
  location: string;
  wines: number;
  rating: number;
  image: string;
  specialty: string;
}

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.scss']
})
export class FavorisComponent implements OnInit {

  // Onglet actif
  activeTab: 'wines' | 'caves' = 'wines';

  // Vins favoris
  favoriteWines: Wine[] = [
    { id: 1, name: 'Château Margaux 2015', region: 'Bordeaux', price: 450, image: '🍷', rating: 4.8, year: 2015, cave: 'Cave Prestige Paris' },
    { id: 2, name: 'Champagne Dom Pérignon', region: 'Champagne', price: 180, image: '🥂', rating: 4.9, year: 2012, cave: 'Cave Prestige Paris' },
    { id: 5, name: 'Sancerre Blanc', region: 'Loire', price: 32, image: '🍾', rating: 4.4, year: 2020, cave: 'Cave de Loire' },
  ];

  // Caves favorites
  favoriteCaves: Cave[] = [
    { id: 1, name: 'Cave Prestige Paris', location: 'Paris 8ème', wines: 250, rating: 4.7, image: '🏛️', specialty: 'Grands Crus' },
    { id: 2, name: 'Cave d\'Excellence', location: 'Lyon', wines: 180, rating: 4.8, image: '🏛️', specialty: 'Bourgogne' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialisation
  }

  // Changer d'onglet
  setActiveTab(tab: 'wines' | 'caves'): void {
    this.activeTab = tab;
  }

  // Retirer un vin des favoris
  removeWine(wine: Wine, event: Event): void {
    event.stopPropagation();
    this.favoriteWines = this.favoriteWines.filter(w => w.id !== wine.id);
  }

  // Retirer une cave des favoris
  removeCave(cave: Cave, event: Event): void {
    event.stopPropagation();
    this.favoriteCaves = this.favoriteCaves.filter(c => c.id !== cave.id);
  }

  // Voir détails d'un vin
  viewWineDetail(wine: Wine): void {
    this.router.navigate(['/client/wine-detail', wine.id]);
  }

  // Voir une cave
  viewCave(cave: Cave): void {
    this.router.navigate(['/client/cave-detail', cave.id]);
  }

  // Ajouter au panier
  addToCart(wine: Wine, event: Event): void {
    event.stopPropagation();
    console.log('Ajout au panier:', wine);
  }

  // Naviguer vers le catalogue
  goToCatalogue(): void {
    this.router.navigate(['/client/catalogue']);
  }
}
