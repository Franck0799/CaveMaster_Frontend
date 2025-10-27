
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RapportTemplate {
  id: string;
  type: string;
  titre: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  selectedPeriode: string = 'mois';
  selectedCave: string = 'all';
  dateDebut: string = '';
  dateFin: string = '';

  rapportTemplates: RapportTemplate[] = [
    {
      id: 'ventes',
      type: 'ventes',
      titre: 'Rapport de Ventes',
      description: 'Analyse complète des ventes par période',
      icon: '📊',
      color: 'success'
    },
    {
      id: 'stock',
      type: 'stock',
      titre: 'Rapport de Stock',
      description: 'État des stocks et mouvements',
      icon: '📦',
      color: 'info'
    },
    {
      id: 'caisse',
      type: 'caisse',
      titre: 'Rapport de Caisse',
      description: 'Encaissements et transactions',
      icon: '💰',
      color: 'warning'
    },
    {
      id: 'equipe',
      type: 'equipe',
      titre: 'Rapport d\'Équipe',
      description: 'Performances et présences du personnel',
      icon: '👥',
      color: 'primary'
    },
    {
      id: 'clients',
      type: 'clients',
      titre: 'Rapport Clients',
      description: 'Analyse de la clientèle et fidélité',
      icon: '👤',
      color: 'accent'
    },
    {
      id: 'global',
      type: 'global',
      titre: 'Rapport Global',
      description: 'Vue d\'ensemble complète de l\'activité',
      icon: '📋',
      color: 'purple'
    }
  ];

  rapportsRecents = [
    {
      id: 'rpt-1',
      titre: 'Rapport Ventes - Octobre 2025',
      type: 'ventes',
      date: '2025-10-08',
      taille: '2.4 MB',
      statut: 'complete'
    },
    {
      id: 'rpt-2',
      titre: 'Rapport Stock - Semaine 40',
      type: 'stock',
      date: '2025-10-07',
      taille: '1.8 MB',
      statut: 'complete'
    },
    {
      id: 'rpt-3',
      titre: 'Rapport Caisse - Septembre 2025',
      type: 'caisse',
      date: '2025-10-01',
      taille: '3.2 MB',
      statut: 'complete'
    }
  ];

  ngOnInit(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.dateDebut = firstDay.toISOString().split('T')[0];
    this.dateFin = today.toISOString().split('T')[0];
  }

  genererRapport(typeRapport: string): void {
    console.log(`Génération du rapport ${typeRapport}`, {
      periode: this.selectedPeriode,
      cave: this.selectedCave,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin
    });
    alert(`Génération du rapport ${typeRapport} en cours...`);
  }

  telechargerRapport(rapportId: string): void {
    console.log(`Téléchargement du rapport ${rapportId}`);
    alert(`Téléchargement du rapport ${rapportId}...`);
  }

  getColorClass(color: string): string {
    return `template-card-${color}`;
  }
}

