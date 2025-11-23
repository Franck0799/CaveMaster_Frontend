// ==========================================
// INCIDENT COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

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
  resolvedAt?: Date;
  resolution?: string;
  attachments?: string[];
}

@Component({
  selector: 'app-incident',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss']
})
export class IncidentComponent implements OnInit {
  selectedStatus = 'all';
  searchTerm = '';
  showAddModal = false;
  showDetailsModal = false;
  showUpdateModal = false;
  selectedIncident: Incident | null = null;

  // Formulaire nouvel incident
  newIncident: Partial<Incident> = {
    type: 'other',
    title: '',
    description: '',
    severity: 'medium'
  };

  // Formulaire mise à jour
  updateForm = {
    status: 'in-progress' as 'open' | 'in-progress' | 'resolved',
    assignedTo: '',
    notes: ''
  };

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
      assignedTo: 'Admin',
      resolvedAt: new Date(Date.now() - 12 * 3600000),
      resolution: 'Nouvelle commande passée et livrée'
    },
    {
      id: '4',
      type: 'security',
      title: 'Caméra de surveillance HS',
      description: 'La caméra de l\'entrée principale ne fonctionne plus.',
      severity: 'high',
      status: 'open',
      reportedBy: 'Thomas B.',
      reportedAt: new Date(Date.now() - 5 * 3600000)
    }
  ];

  filteredIncidents: Incident[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.filterByStatus('all');
  }

  // ===== FILTRAGE =====

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.incidents];

    // Filtre par statut
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(i => i.status === this.selectedStatus);
    }

    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term) ||
        i.reportedBy.toLowerCase().includes(term)
      );
    }

    // Tri par date (plus récent en premier)
    filtered.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());

    this.filteredIncidents = filtered;
  }

  getCountByStatus(status: string): number {
    return this.incidents.filter(i => i.status === status).length;
  }

  // ===== LABELS =====

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

  getSeverityLabel(severity: string): string {
    const labels: { [key: string]: string } = {
      'low': 'Faible',
      'medium': 'Moyen',
      'high': 'Élevé'
    };
    return labels[severity] || severity;
  }

  getSeverityIcon(severity: string): string {
    const icons: { [key: string]: string } = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🔴'
    };
    return icons[severity] || '⚪';
  }

  // ===== MODAL AJOUT =====

  openAddModal(): void {
    this.newIncident = {
      type: 'other',
      title: '',
      description: '',
      severity: 'medium'
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  reportIncident(): void {
    if (!this.validateNewIncident()) return;

    const incident: Incident = {
      id: Date.now().toString(),
      type: this.newIncident.type!,
      title: this.newIncident.title!,
      description: this.newIncident.description!,
      severity: this.newIncident.severity!,
      status: 'open',
      reportedBy: 'Jean Dupont', // User actuel
      reportedAt: new Date()
    };

    this.incidents.unshift(incident);
    this.applyFilters();

    this.notificationService.success(
      'Incident signalé avec succès',
      3000,
      { title: 'Incident créé' }
    );

    this.closeAddModal();
  }

  validateNewIncident(): boolean {
    if (!this.newIncident.title || this.newIncident.title.trim().length < 5) {
      this.notificationService.error('Le titre doit contenir au moins 5 caractères');
      return false;
    }

    if (!this.newIncident.description || this.newIncident.description.trim().length < 10) {
      this.notificationService.error('La description doit contenir au moins 10 caractères');
      return false;
    }

    return true;
  }

  // ===== MODAL DÉTAILS =====

  viewIncident(incident: Incident): void {
    this.selectedIncident = incident;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedIncident = null;
  }

  // ===== MODAL MISE À JOUR =====

  openUpdateModal(incident: Incident): void {
    this.selectedIncident = incident;
    this.updateForm = {
      status: incident.status,
      assignedTo: incident.assignedTo || '',
      notes: ''
    };
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedIncident = null;
  }

  updateStatus(incident?: Incident): void {
    const target = incident || this.selectedIncident;
    if (!target) return;

    this.openUpdateModal(target);
  }

  performUpdate(): void {
    if (!this.selectedIncident) return;

    const incident = this.incidents.find(i => i.id === this.selectedIncident!.id);
    if (!incident) return;

    incident.status = this.updateForm.status;
    if (this.updateForm.assignedTo) {
      incident.assignedTo = this.updateForm.assignedTo;
    }

    if (this.updateForm.status === 'resolved') {
      incident.resolvedAt = new Date();
      incident.resolution = this.updateForm.notes;
    }

    this.applyFilters();
    this.notificationService.success('Incident mis à jour');
    this.closeUpdateModal();
  }

  // ===== RÉSOLUTION RAPIDE =====

  resolveIncident(incident: Incident): void {
    if (incident.status === 'resolved') {
      this.notificationService.info('Cet incident est déjà résolu');
      return;
    }

    this.notificationService.showWithAction(
      `Marquer l'incident "${incident.title}" comme résolu ?`,
      'warning',
      'Confirmer',
      () => {
        const target = this.incidents.find(i => i.id === incident.id);
        if (target) {
          target.status = 'resolved';
          target.resolvedAt = new Date();
          target.resolution = 'Incident résolu';
          this.applyFilters();
          this.notificationService.success('Incident résolu');
        }
      }
    );
  }

  // ===== ACTIONS =====

  assignIncident(incident: Incident): void {
    const assignee = prompt('Assigner à :');
    if (assignee) {
      incident.assignedTo = assignee;
      this.notificationService.success(`Incident assigné à ${assignee}`);
    }
  }

  deleteIncident(incident: Incident): void {
    this.notificationService.showWithAction(
      'Supprimer définitivement cet incident ?',
      'warning',
      'Supprimer',
      () => {
        const index = this.incidents.findIndex(i => i.id === incident.id);
        if (index !== -1) {
          this.incidents.splice(index, 1);
          this.applyFilters();
          this.notificationService.success('Incident supprimé');
        }
      }
    );
  }

  duplicateIncident(incident: Incident): void {
    const duplicate: Incident = {
      ...incident,
      id: Date.now().toString(),
      title: `${incident.title} (copie)`,
      status: 'open',
      reportedAt: new Date(),
      resolvedAt: undefined,
      resolution: undefined
    };

    this.incidents.unshift(duplicate);
    this.applyFilters();
    this.notificationService.success('Incident dupliqué');
  }

  // ===== EXPORT =====

  exportIncidents(): void {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `incidents_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    this.notificationService.success('Incidents exportés');
  }

  generateCSV(): string {
    let csv = 'ID,Type,Titre,Sévérité,Statut,Signalé par,Date\n';

    this.filteredIncidents.forEach(incident => {
      csv += `${incident.id},${incident.type},${incident.title},${incident.severity},${incident.status},${incident.reportedBy},${incident.reportedAt.toISOString()}\n`;
    });

    return csv;
  }

  printIncidents(): void {
    window.print();
    this.notificationService.info('Impression lancée');
  }

  // ===== STATISTIQUES =====

  getAverageResolutionTime(): string {
    const resolved = this.incidents.filter(i => i.status === 'resolved' && i.resolvedAt);
    if (resolved.length === 0) return 'N/A';

    const totalMinutes = resolved.reduce((sum, i) => {
      const duration = i.resolvedAt!.getTime() - i.reportedAt.getTime();
      return sum + duration / 60000;
    }, 0);

    const avgMinutes = totalMinutes / resolved.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.floor(avgMinutes % 60);

    return `${hours}h ${minutes}min`;
  }

  getMostCommonType(): string {
    const typeCounts: { [key: string]: number } = {};
    this.incidents.forEach(i => {
      typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
    });

    let maxType = '';
    let maxCount = 0;

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxType = type;
        maxCount = count;
      }
    });

    return this.getTypeLabel(maxType);
  }

  // ===== UTILITAIRES =====

  getTimeAgo(date: Date): string {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;

    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  }

  refreshIncidents(): void {
    this.applyFilters();
    this.notificationService.info('Liste actualisée');
  }
}
