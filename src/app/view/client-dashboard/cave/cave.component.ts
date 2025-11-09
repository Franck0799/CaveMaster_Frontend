// ==========================================
// FICHIER: src/app/view/client-dashboard/caves/caves.component.ts
// DESCRIPTION: Liste des caves partenaires
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Cave {
  id: number;
  name: string;
  location: string;
  wines: number;
  rating: number;
  image: string;
  specialty: string;
  description: string;
}

@Component({
  selector: 'app-caves',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: `./cave.component.html`,
  styleUrls: [`./cave.component.scss`]
})
export class CaveComponent implements OnInit {
  caves: Cave[] = [
    {
      id: 1,
      name: 'Cave Prestige Paris',
      location: 'Paris 8ème',
      wines: 250,
      rating: 4.7,
      image: '🏛️',
      specialty: 'Grands Crus',
      description: 'Spécialisée dans les grands crus de Bordeaux et de Bourgogne, cette cave prestigieuse offre une sélection exceptionnelle.'
    },
    {
      id: 2,
      name: 'Cave d\'Excellence',
      location: 'Lyon',
      wines: 180,
      rating: 4.8,
      image: '🏛️',
      specialty: 'Bourgogne',
      description: 'Une référence incontournable pour les vins de Bourgogne, avec des millésimes rares et des domaines confidentiels.'
    },
    {
      id: 3,
      name: 'Cave du Sud',
      location: 'Marseille',
      wines: 120,
      rating: 4.5,
      image: '🏛️',
      specialty: 'Rhône & Provence',
      description: 'Découvrez les trésors du Sud de la France avec notre sélection de vins de la vallée du Rhône et de Provence.'
    },
    {
      id: 4,
      name: 'Cave de Loire',
      location: 'Tours',
      wines: 95,
      rating: 4.6,
      image: '🏛️',
      specialty: 'Vins de Loire',
      description: 'Spécialiste des vins de Loire, offrant blancs minéraux, rouges fruités et pétillants de qualité.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  viewCave(id: number): void {
    this.router.navigate(['/client/cave-detail', id]);
  }
}
