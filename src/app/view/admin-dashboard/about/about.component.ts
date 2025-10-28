// ============================================
// ABOUT COMPONENT
// ============================================
// about.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  features: Feature[] = [
    {
      icon: '📊',
      title: 'Gestion Complète',
      description: 'Gérez vos caves, stocks, employés et managers en un seul endroit'
    },
    {
      icon: '📱',
      title: 'Application Mobile',
      description: 'Accessible depuis n\'importe quel appareil, partout et à tout moment'
    },
    {
      icon: '🔒',
      title: 'Sécurisé',
      description: 'Vos données sont protégées avec un cryptage de niveau bancaire'
    },
    {
      icon: '📈',
      title: 'Statistiques en Temps Réel',
      description: 'Suivez vos performances avec des rapports détaillés et actualisés'
    }
  ];

  team: TeamMember[] = [
    {
      name: 'Franck KONGO',
      role: 'CEO, Fondateur & Développeur Full-Stack',
      avatar: '👨‍💼',
      bio: 'Spécialiste en gestion de caves '
    },
    {
      name: 'Auxence CHABEHOU',
      role: 'CTO',
      avatar: '👨‍💼',
      bio: 'Développeuse senior full-stack'
    }
  ];

  ngOnInit(): void {}
}

