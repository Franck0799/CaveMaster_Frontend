// ============================================
// IMPROVEMENTS COMPONENT
// ============================================
// improvements.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Improvement {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'enhancement';
  title: string;
  description: string;
}

@Component({
  selector: 'app-improvements',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './improvements.component.html',
  styleUrls: ['./improvements.component.scss']
})
export class ImprovementsComponent implements OnInit {
  improvements: Improvement[] = [
    {
      id: '1',
      version: 'v1.5.0',
      date: '2025-01-20',
      type: 'feature',
      title: 'Nouveau module d\'accords mets & vins',
      description: 'Ajout d\'une section complète pour gérer les accords entre plats et vins avec recommandations'
    },
    {
      id: '2',
      version: 'v1.4.2',
      date: '2025-01-15',
      type: 'fix',
      title: 'Correction du bug d\'export CSV',
      description: 'Résolution du problème d\'encodage lors de l\'export des données en CSV'
    },
    {
      id: '3',
      version: 'v1.4.0',
      date: '2025-01-10',
      type: 'enhancement',
      title: 'Amélioration des performances',
      description: 'Optimisation du chargement des pages et réduction du temps de réponse de 40%'
    },
    {
      id: '4',
      version: 'v1.3.5',
      date: '2025-01-05',
      type: 'feature',
      title: 'Scanner de code-barres',
      description: 'Nouveau module de scan pour ajouter rapidement des produits au stock'
    }
  ];

  ngOnInit(): void {}

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'feature': '✨',
      'fix': '🐛',
      'enhancement': '⚡'
    };
    return icons[type] || '📝';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'feature': 'Nouvelle fonctionnalité',
      'fix': 'Correction de bug',
      'enhancement': 'Amélioration'
    };
    return labels[type] || 'Mise à jour';
  }
}
