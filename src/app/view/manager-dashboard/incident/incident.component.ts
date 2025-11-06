// ==========================================
// INCIDENTS COMPONENT (Signalement d'incidents)
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Incident {
  id: string;
  type: 'equipment' | 'customer' | 'stock' | 'security' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  reportedBy: string;
  reportedAt: Date;
  assignedTo?: string;
}

@Component({
  selector: 'app-incident',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./incident.component.html`,
  styleUrls: [`./incident.component.scss`]
})
export class IncidentComponent implements OnInit {
  selectedStatus = 'all';

  incidents: Incident[] = [
    {
      id: '1',
      type: 'equipment',
      title: 'Machine à café en panne',
      description: 'La machine à café principale ne fonctionne plus depuis ce matin.',
      severity: 'high',
      status: 'open',
      reportedBy: 'Marie M.',
      reportedAt: new Date(Date.now() - 2 * 3600000)
    },
    {
      id: '2',
      type: 'customer',
      title: 'Client mécontent du service',
      description: 'Table T05 se plaint du temps d\'attente trop long.',
      severity: 'medium',
      status: 'in-progress',
      reportedBy: 'Pierre D.',
      reportedAt: new Date(Date.now() - 4 * 3600000),
      assignedTo: 'Manager'
    },
    {
      id: '3',
      type: 'stock',
      title: 'Rupture de stock',
      description: 'Plus de Château Margaux 2015 disponible.',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'Sophie L.',
      reportedAt: new Date(Date.now() - 24 * 3600000),
      assignedTo: 'Admin'
    }
  ];

  filteredIncidents: Incident[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filterByStatus('all');
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (status === 'all') {
      this.filteredIncidents = this.incidents;
    } else {
      this.filteredIncidents = this.incidents.filter(i => i.status === status);
    }
  }

  getCountByStatus(status: string): number {
    return this.incidents.filter(i => i.status === status).length;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'equipment': '🔧 Équipement',
      'customer': '👤 Client',
      'stock': '📦 Stock',
      'security': '🔒 Sécurité',
      'other': '📝 Autre'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'open': 'Ouvert',
      'in-progress': 'En cours',
      'resolved': 'Résolu'
    };
    return labels[status] || status;
  }

  reportIncident(): void {
    console.log('Signaler un nouvel incident');
  }

  viewIncident(incident: Incident): void {
    console.log('Voir incident:', incident);
  }

  updateStatus(incident: Incident): void {
    console.log('Mettre à jour statut:', incident);
  }

  resolveIncident(incident: Incident): void {
    if (confirm(`Marquer l'incident "${incident.title}" comme résolu ?`)) {
      incident.status = 'resolved';
      this.filterByStatus(this.selectedStatus);
      console.log('Incident résolu:', incident);
    }
  }
}
