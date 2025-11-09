// ==========================================
// FICHIER: src/app/client/home/home.component.ts
// DESCRIPTION: Page d'accueil client - ACTUALISÉ avec standalone
// ==========================================

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Interface pour un vin
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

// Interface pour une cave
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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Données des promotions
  promotions: Wine[] = [
    {
      id: 1,
      name: 'Château Margaux 2015',
      region: 'Bordeaux',
      price: 450,
      image: '🍷',
      rating: 4.8,
      type: 'Rouge',
      grape: 'Cabernet Sauvignon',
      year: 2015,
      cave: 'Cave Prestige Paris'
    },
    {
      id: 2,
      name: 'Domaine de la Romanée-Conti',
      region: 'Bourgogne',
      price: 1200,
      image: '🍷',
      rating: 5.0,
      type: 'Rouge',
      grape: 'Pinot Noir',
      year: 2016,
      cave: 'Cave d\'Excellence'
    },
    {
      id: 3,
      name: 'Champagne Dom Pérignon',
      region: 'Champagne',
      price: 180,
      image: '🥂',
      rating: 4.9,
      type: 'Pétillant',
      grape: 'Chardonnay',
      year: 2012,
      cave: 'Cave Prestige Paris'
    }
  ];

  // Données des nouveautés
  newWines: Wine[] = [
    {
      id: 4,
      name: 'Châteauneuf-du-Pape',
      region: 'Rhône',
      price: 85,
      image: '🍷',
      rating: 4.6,
      type: 'Rouge',
      grape: 'Grenache',
      year: 2018,
      cave: 'Cave du Sud'
    },
    {
      id: 5,
      name: 'Sancerre Blanc',
      region: 'Loire',
      price: 32,
      image: '🍾',
      rating: 4.4,
      type: 'Blanc',
      grape: 'Sauvignon Blanc',
      year: 2020,
      cave: 'Cave de Loire'
    },
    {
      id: 6,
      name: 'Pouilly-Fuissé',
      region: 'Bourgogne',
      price: 45,
      image: '🍾',
      rating: 4.5,
      type: 'Blanc',
      grape: 'Chardonnay',
      year: 2019,
      cave: 'Cave d\'Excellence'
    }
  ];

  // Caves partenaires
  caves: Cave[] = [
    {
      id: 1,
      name: 'Cave Prestige Paris',
      location: 'Paris 8ème',
      wines: 250,
      rating: 4.7,
      image: '🏛️',
      specialty: 'Grands Crus'
    },
    {
      id: 2,
      name: 'Cave d\'Excellence',
      location: 'Lyon',
      wines: 180,
      rating: 4.8,
      image: '🏛️',
      specialty: 'Bourgogne'
    },
    {
      id: 3,
      name: 'Cave du Sud',
      location: 'Marseille',
      wines: 120,
      rating: 4.5,
      image: '🏛️',
      specialty: 'Rhône & Provence'
    },
    {
      id: 4,
      name: 'Cave de Loire',
      location: 'Tours',
      wines: 95,
      rating: 4.6,
      image: '🏛️',
      specialty: 'Vins de Loire'
    }
  ];

  // Injection du Router pour la navigation
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialisation du composant
    console.log('Home component initialized');
  }

  // Navigation vers le catalogue
  navigateToCatalog(): void {
    // Navigation vers la page catalogue
    this.router.navigate(['/client/catalogue']);
  }

  // Navigation vers la liste des caves
  navigateToCaves(): void {
    // Navigation vers la page des caves
    this.router.navigate(['/client/caves']);
  }

  // Navigation vers le détail d'un vin
  viewWineDetail(wine: Wine): void {
    // Navigation vers la page de détail avec l'ID du vin
    this.router.navigate(['/client/wine-detail', wine.id]);
  }

  // Ajouter un vin au panier
  addToCart(wine: Wine, event: Event): void {
    // Empêcher la propagation du clic vers le parent
    event.stopPropagation();

    // Logique d'ajout au panier (à implémenter avec un service)
    console.log('Ajout au panier:', wine);

    // TODO: Appeler le service CartService pour ajouter le vin
    // this.cartService.addToCart(wine);
  }

  // Ajouter/retirer un vin des favoris
  toggleFavorite(wine: Wine, event: Event): void {
    // Empêcher la propagation du clic vers le parent
    event.stopPropagation();

    // Logique de gestion des favoris (à implémenter avec un service)
    console.log('Toggle favori:', wine);

    // TODO: Appeler le service FavoritesService
    // this.favoritesService.toggleFavorite(wine);
  }
}
