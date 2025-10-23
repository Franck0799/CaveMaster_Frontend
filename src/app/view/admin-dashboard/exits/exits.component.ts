// ==========================================
// FICHIER: src/app/features/exits/exits.component.ts
// DESCRIPTION: Composant pour gérer les sorties de stock (ventes, transferts, pertes)
// ==========================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import {CommonModule}
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StockExit, Drink, Cave } from '../../../core/models/models';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-exits',
  templateUrl: './exits.component.html',
  styleUrls: ['./exits.component.scss']
})
export class ExitsComponent implements OnInit, OnDestroy {

  // Données
  exits: StockExit[] = [];
  filteredExits: StockExit[] = [];
  drinks: Drink[] = [];
  caves: Cave[] = [];

  // États UI
  isLoading: boolean = false;
  isAddModalOpen: boolean = false;

  // Formulaire
  exitForm: Partial<StockExit> = {
    drinkId: '',
    quantity: 0,
    type: 'vente',
    unitPrice: 0,
    caveId: '',
    destination: '',
    notes: ''
  };

  // Filtres
  selectedCaveFilter: string | null = null;
  selectedTypeFilter: 'vente' | 'transfert' | 'perte' | null = null;
  periodFilter: number = 30;
  searchTerm: string = '';

  // Statistiques
  stats = {
    totalExits: 0,
    totalQuantity: 0,
    totalRevenue: 0,
    recentExits: 0
  };

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des données
  loadData(): void {
    this.isLoading = true;

    this.dataService.stockExits$
      .pipe(takeUntil(this.destroy$))
      .subscribe(exits => {
        this.exits = exits.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.applyFilters();
        this.calculateStats();
        this.isLoading = false;
      });

    this.dataService.drinks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(drinks => this.drinks = drinks);

    this.dataService.caves$
      .pipe(takeUntil(this.destroy$))
      .subscribe(caves => this.caves = caves);
  }

  // Filtrage
  applyFilters(): void {
    let result = [...this.exits];

    if (this.selectedCaveFilter) {
      result = result.filter(exit => exit.caveId === this.selectedCaveFilter);
    }

    if (this.selectedTypeFilter) {
      result = result.filter(exit => exit.type === this.selectedTypeFilter);
    }

    if (this.periodFilter) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.periodFilter);
      result = result.filter(exit => new Date(exit.date) >= cutoffDate);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(exit =>
        exit.drinkName.toLowerCase().includes(term) ||
        exit.destination?.toLowerCase().includes(term) ||
        exit.notes?.toLowerCase().includes(term)
      );
    }

    this.filteredExits = result;
  }

  onCaveFilterChange(caveId: string | null): void {
    this.selectedCaveFilter = caveId;
    this.applyFilters();
  }

  onTypeFilterChange(type: 'vente' | 'transfert' | 'perte' | null): void {
    this.selectedTypeFilter = type;
    this.applyFilters();
  }

  onPeriodFilterChange(days: number): void {
    this.periodFilter = days;
    this.applyFilters();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCaveFilter = null;
    this.selectedTypeFilter = null;
    this.periodFilter = 30;
    this.searchTerm = '';
    this.applyFilters();
  }

  // Calcul des statistiques
  calculateStats(): void {
    this.stats.totalExits = this.exits.length;
    this.stats.totalQuantity = this.exits.reduce((sum, exit) => sum + exit.quantity, 0);
    this.stats.totalRevenue = this.exits
      .filter(exit => exit.type === 'vente')
      .reduce((sum, exit) => sum + exit.totalAmount, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.stats.recentExits = this.exits.filter(
      exit => new Date(exit.date) >= sevenDaysAgo
    ).length;
  }

  // Modal
  openAddModal(): void {
    this.exitForm = {
      drinkId: '',
      quantity: 0,
      type: 'vente',
      unitPrice: 0,
      caveId: '',
      destination: '',
      notes: ''
    };
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  saveExit(): void {
    if (!this.exitForm.drinkId || !this.exitForm.quantity ||
        !this.exitForm.unitPrice || !this.exitForm.caveId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const drink = this.drinks.find(d => d.id === this.exitForm.drinkId);
    if (!drink) {
      alert('Boisson non trouvée');
      return;
    }

    if (drink.stock < this.exitForm.quantity!) {
      alert(`Stock insuffisant. Disponible: ${drink.stock} unités`);
      return;
    }

    const totalAmount = this.exitForm.quantity! * this.exitForm.unitPrice!;

    const newExit: StockExit = {
      id: this.generateId(),
      drinkId: this.exitForm.drinkId!,
      drinkName: drink.name,
      quantity: this.exitForm.quantity!,
      date: new Date(),
      type: this.exitForm.type!,
      destination: this.exitForm.destination,
      unitPrice: this.exitForm.unitPrice!,
      totalAmount: totalAmount,
      caveId: this.exitForm.caveId!,
      processedBy: 'current-user-id',
      notes: this.exitForm.notes
    };

    this.dataService.addStockExit(newExit);
    this.closeAddModal();
  }

  calculateTotalAmount(): number {
    return (this.exitForm.quantity || 0) * (this.exitForm.unitPrice || 0);
  }

  // Utilitaires
  private generateId(): string {
    return `exit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCaveName(caveId: string): string {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.name : 'Cave inconnue';
  }

  getRelativeDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine(s)`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  }

  getTypeLabel(type: string): string {
    const labels: {[key: string]: string} = {
      'vente': 'Vente',
      'transfert': 'Transfert',
      'perte': 'Perte'
    };
    return labels[type] || type;
  }

  getTypeClass(type: string): string {
    const classes: {[key: string]: string} = {
      'vente': 'type-sale',
      'transfert': 'type-transfer',
      'perte': 'type-loss'
    };
    return classes[type] || '';
  }

  exportToCSV(): void {
    if (this.filteredExits.length === 0) {
      alert('Aucune sortie à exporter');
      return;
    }

    const headers = ['Date', 'Boisson', 'Type', 'Quantité', 'Prix Unitaire', 'Montant Total', 'Cave', 'Destination', 'Notes'];

    const rows = this.filteredExits.map(exit => [
      this.formatDate(exit.date),
      exit.drinkName,
      this.getTypeLabel(exit.type),
      exit.quantity,
      exit.unitPrice,
      exit.totalAmount,
      this.getCaveName(exit.caveId),
      exit.destination || '',
      exit.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sorties_stock_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewEntryDetails(exit: StockExit): void {
    // À implémenter
    console.log('Voir détails:', exit);
  }

  deleteEntry(exit: StockExit): void {
    if (confirm(`Supprimer cette sortie de ${exit.drinkName} ?`)) {
      this.dataService.deleteStockExit(exit.id);
    }
  }
}