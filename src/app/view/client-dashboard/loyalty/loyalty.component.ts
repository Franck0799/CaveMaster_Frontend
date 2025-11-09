// ==========================================
// FICHIER: src/app/client/loyalty/loyalty.component.ts
// DESCRIPTION: Page du programme fidélité
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Reward {
  id: number;
  title: string;
  points: number;
  icon: string;
  description: string;
  available: boolean;
}

interface Offer {
  id: number;
  title: string;
  description: string;
  validUntil: string;
  code?: string;
}

interface PointHistory {
  id: number;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  date: string;
}

@Component({
  selector: 'app-loyalty',
  standalone: true,
  imports : [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyComponent implements OnInit {

  // Points de l'utilisateur
  userPoints = 1250;

  // Niveau actuel
  currentLevel = 'GOLD';
  currentLevelPoints = 1000;
  nextLevel = 'PLATINUM';
  nextLevelPoints = 1500;

  // Récompenses disponibles
  rewards: Reward[] = [
    {
      id: 1,
      title: 'Livraison gratuite',
      points: 500,
      icon: '🚚',
      description: 'Profitez d\'une livraison gratuite sur votre prochaine commande',
      available: true
    },
    {
      id: 2,
      title: 'Réduction 10€',
      points: 750,
      icon: '💰',
      description: 'Recevez un bon de réduction de 10€ valable 30 jours',
      available: true
    },
    {
      id: 3,
      title: 'Dégustation offerte',
      points: 1000,
      icon: '🍷',
      description: 'Participez gratuitement à une séance de dégustation',
      available: true
    },
    {
      id: 4,
      title: 'Bouteille premium',
      points: 1500,
      icon: '🍾',
      description: 'Recevez une bouteille premium de notre sélection',
      available: false
    },
    {
      id: 5,
      title: 'Invitation VIP',
      points: 2000,
      icon: '🎫',
      description: 'Accès exclusif à nos événements privés',
      available: false
    },
    {
      id: 6,
      title: 'Cave personnelle',
      points: 3000,
      icon: '🏆',
      description: 'Consultation gratuite pour créer votre cave personnelle',
      available: false
    }
  ];

  // Offres exclusives
  offers: Offer[] = [
    {
      id: 1,
      title: '20% sur votre prochaine commande',
      description: 'Offre réservée aux membres GOLD',
      validUntil: '2025-11-30',
      code: 'GOLD20'
    },
    {
      id: 2,
      title: 'Accès prioritaire aux nouveautés',
      description: 'Découvrez nos nouveaux vins 48h avant tout le monde',
      validUntil: '2025-12-31'
    },
    {
      id: 3,
      title: 'Double points ce mois-ci',
      description: 'Gagnez 2x plus de points sur tous vos achats',
      validUntil: '2025-11-30'
    }
  ];

  // Historique des points
  pointHistory: PointHistory[] = [
    { id: 1, type: 'earned', amount: 150, reason: 'Commande #12456', date: '2025-11-05' },
    { id: 2, type: 'earned', amount: 200, reason: 'Parrainage ami', date: '2025-11-01' },
    { id: 3, type: 'spent', amount: -500, reason: 'Livraison gratuite', date: '2025-10-28' },
    { id: 4, type: 'earned', amount: 300, reason: 'Commande #12450', date: '2025-10-20' },
    { id: 5, type: 'earned', amount: 100, reason: 'Bonus anniversaire', date: '2025-10-15' }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialisation
  }

  // Calculer le pourcentage vers le prochain niveau
  get progressPercent(): number {
    const progress = this.userPoints - this.currentLevelPoints;
    const total = this.nextLevelPoints - this.currentLevelPoints;
    return Math.min((progress / total) * 100, 100);
  }

  // Points restants pour le prochain niveau
  get pointsToNextLevel(): number {
    return Math.max(this.nextLevelPoints - this.userPoints, 0);
  }

  // Échanger des points contre une récompense
  redeemReward(reward: Reward): void {
    if (this.userPoints >= reward.points) {
      console.log('Échange de récompense:', reward);
      // Logique d'échange
      this.userPoints -= reward.points;
    }
  }

  // Copier un code promo
  copyCode(code: string, event: Event): void {
    event.stopPropagation();
    navigator.clipboard.writeText(code);
    console.log('Code copié:', code);
    // Afficher une notification de succès
  }

  // Obtenir la classe CSS selon le type de transaction
  getHistoryTypeClass(type: string): string {
    return type === 'earned' ? 'history-earned' : 'history-spent';
  }
}
