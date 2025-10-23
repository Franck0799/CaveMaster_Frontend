// ==========================================
// FICHIER: src/app/features/recent-actions/recent-actions.component.ts
// DESCRIPTION: Composant pour afficher l'historique des actions récentes
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecentAction } from '../../core/models/models';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-recent-actions',
  templateUrl: './recent-actions.component.html',
  styleUrls: ['./recent-actions.component.scss']
})
export class RecentActionsComponent implements OnInit, OnDestroy {

  // Données
  actions: RecentAction[] = [];
  filteredActions: RecentAction[] = [];

  // Filtres
  selectedType: string | null = null;
  periodFilter: number = 7; // 7 derniers jours par défaut
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 1;

  // États UI
  isLoading: boolean = false;

  // Types d'actions disponibles
  actionTypes = [
    { value: 'vente', label: 'Ventes', icon: '💰', color: 'green' },
    { value: 'entree', label: 'Entrées', icon: '📥', color: 'blue' },
    { value: 'sortie', label: 'Sorties', icon: '📤', color: 'orange' },
    { value: 'alerte', label: 'Alertes', icon: '⚠️', color: 'red' },
    { value: 'info', label: 'Informations', icon: 'ℹ️', color: 'gray' }
  ];

  // Périodes disponibles
  periods = [
    { value: 1, label: "Aujourd'hui" },
    { value: 7, label: '7 derniers jours' },
    { value: 30, label: '30 derniers jours' },
    { value: 90, label: '3 derniers mois' },
    { value: 0, label: 'Toutes les actions' }
  ];

  // Statistiques
  stats = {
    total: 0,
    ventes: 0,
    entrees: 0,
    sorties: 0,
    alertes: 0
  };

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadActions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les actions depuis le service
   */
  loadActions(): void {
    this.isLoading = true;

    this.dataService.recentActions$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (actions) => {
          this.actions = actions.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          this.applyFilters();
          this.calculateStats();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des actions:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Applique tous les filtres
   */
  applyFilters(): void {
    let result = [...this.actions];

    // Filtre par type
    if (this.selectedType) {
      result = result.filter(a => a.type === this.selectedType);
    }

    // Filtre par période
    if (this.periodFilter > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.periodFilter);
      result = result.filter(a =>
        new Date(a.timestamp) >= cutoffDate
      );
    }

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(term) ||
        a.details.toLowerCase().includes(term)
      );
    }

    this.filteredActions = result;
    this.calculatePagination();
    this.currentPage = 1; // Reset à la première page
  }

  /**
   * Change le filtre de type
   */
  onTypeFilterChange(type: string | null): void {
    this.selectedType = type;
    this.applyFilters();
  }

  /**
   * Change le filtre de période
   */
  onPeriodFilterChange(days: number): void {
    this.periodFilter = days;
    this.applyFilters();
  }

  /**
   * Change le terme de recherche
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedType = null;
    this.periodFilter = 7;
    this.searchTerm = '';
    this.applyFilters();
  }

  /**
   * Calcule les statistiques
   */
  calculateStats(): void {
    this.stats.total = this.filteredActions.length;
    this.stats.ventes = this.filteredActions.filter(a => a.type === 'vente').length;
    this.stats.entrees = this.filteredActions.filter(a => a.type === 'entree').length;
    this.stats.sorties = this.filteredActions.filter(a => a.type === 'sortie').length;
    this.stats.alertes = this.filteredActions.filter(a => a.type === 'alerte').length;
  }

  /**
   * Calcule la pagination
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredActions.length / this.itemsPerPage);
  }

  /**
   * Récupère les actions de la page actuelle
   */
  getPaginatedActions(): RecentAction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredActions.slice(start, end);
  }

  /**
   * Va à une page spécifique
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Page précédente
   */
  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /**
   * Page suivante
   */
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  /**
   * Récupère la classe CSS selon le type d'action
   */
  getActionTypeClass(type: string): string {
    const typeObj = this.actionTypes.find(t => t.value === type);
    return `action-${typeObj?.color || 'gray'}`;
  }

  /**
   * Récupère l'icône selon le type
   */
  getActionIcon(type: string): string {
    const typeObj = this.actionTypes.find(t => t.value === type);
    return typeObj?.icon || 'ℹ️';
  }

  /**
   * Formate une date en format relatif
   */
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? 's' : ''}`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  }

  /**
   * Formate une date complète
   */
  formatFullDate(date: Date): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Export des actions en CSV
   */
  exportToCSV(): void {
    if (this.filteredActions.length === 0) {
      alert('Aucune action à exporter');
      return;
    }

    const headers = ['Date', 'Type', 'Titre', 'Détails'];
    const rows = this.filteredActions.map(action => [
      this.formatFullDate(action.timestamp),
      action.type,
      action.title.replace(/,/g, ';'), // Échappe les virgules
      action.details.replace(/,/g, ';')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `actions-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Génère les numéros de page à afficher
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= maxVisible - 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = this.totalPages - (maxVisible - 2); i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(this.totalPages);
      }
    }

    return pages;
  }
}
