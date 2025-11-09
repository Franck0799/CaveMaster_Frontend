// ==========================================
// FICHIER: src/app/view/client-dashboard/cave-detail/cave-detail.component.ts
// DESCRIPTION: Détail d'une cave
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-cave-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ` `,
  styles: [``]
})
export class CaveDetailComponent {
  cave: any;
  wines: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCave(id);
  }

  loadCave(id: number): void {
    this.cave = {
      id,
      name: 'Cave Prestige Paris',
      location: 'Paris 8ème',
      wines: 250,
      rating: 4.7,
      image: '🏛️',
      specialty: 'Grands Crus'
    };

    this.wines = [
      { id: 1, name: 'Château Margaux', price: 450, image: '🍷' },
      { id: 2, name: 'Dom Pérignon', price: 180, image: '🥂' },
      { id: 3, name: 'Romanée-Conti', price: 1200, image: '🍷' }
    ];
  }

  goBack(): void {
    this.router.navigate(['/client/caves']);
  }

  viewWine(id: number): void {
    this.router.navigate(['/client/wine-detail', id]);
  }
}
