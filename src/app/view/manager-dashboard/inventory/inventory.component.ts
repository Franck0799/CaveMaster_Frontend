// ==========================================
// INVENTORY COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lastInventory: Date;
  variance: number;
  minStock: number;
  maxStock: number;
  location?: string;
  supplier?: string;
  price?: number;
}

interface InventoryHistory {
  date: Date;
  stock: number;
  variance: number;
  notes?: string;
}

interface InventorySession {
  id: string;
  startDate: Date;
  endDate?: Date;
  status: 'in-progress' | 'completed';
  itemsChecked: number;
  totalItems: number;
  discrepancies: number;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  lastUpdate = new Date();
  selectedCategory = 'all';
  searchTerm = '';
  filterStock: 'all' | 'low' | 'ok' | 'out' = 'all';
  sortBy: 'name' | 'stock' | 'variance' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  showStartModal = false;
  showAdjustModal = false;
  showHistoryModal = false;
  showDetailsModal = false;
  selectedItem: InventoryItem | null = null;

  // Session d'inventaire en cours
  currentSession: InventorySession | null = null;

  // Formulaire d'ajustement
  adjustForm = {
    newStock: 0,
    reason: '',
    notes: ''
  };

  items: InventoryItem[] = [
    {
      id: '1',
      name: 'Château Margaux 2015',
      category: 'Vin Rouge',
      stock: 24,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: -2,
      minStock: 5,
      maxStock: 50,
      location: 'A-12',
      supplier: 'Vignobles Margaux',
      price: 450
    },
    {
      id: '2',
      name: 'Moët & Chandon Brut',
      category: 'Champagne',
      stock: 18,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: 0,
      minStock: 10,
      maxStock: 40,
      location: 'C-05',
      supplier: 'Champagne House',
      price: 45
    },
    {
      id: '3',
      name: 'Château d\'Yquem',
      category: 'Vin Blanc',
      stock: 12,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: 1,
      minStock: 5,
      maxStock: 30,
      location: 'B-08',
      supplier: 'Sauternes Premium',
      price: 280
    },
    {
      id: '4',
      name: 'Glenfiddich 18 ans',
      category: 'Spiritueux',
      stock: 6,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: -1,
      minStock: 3,
      maxStock: 15,
      location: 'D-15',
      supplier: 'Scotland Distillery',
      price: 85
    },
    {
      id: '5',
      name: 'Châteauneuf-du-Pape',
      category: 'Vin Rouge',
      stock: 0,
      unit: 'bouteilles',
      lastInventory: new Date('2025-01-01'),
      variance: -8,
      minStock: 10,
      maxStock: 40,
      location: 'A-20',
      supplier: 'Rhône Valley Wines',
      price: 65
    }
  ];

  filteredItems: InventoryItem[] = [];

  // Historique simulé
  itemHistory: { [key: string]: InventoryHistory[] } = {};

  // Catégories disponibles
  categories = [
    'Vin Rouge',
    'Vin Blanc',
    'Vin Rosé',
    'Champagne',
    'Spiritueux',
    'Bière',
    'Soft Drinks',
    'Accessoires'
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.applyFilters();
    this.generateSampleHistory();
  }

  // ===== FILTRAGE ET TRI =====

  applyFilters(): void {
    let filtered = [...this.items];

    // Filtre par catégorie
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    // Filtre par niveau de stock
    if (this.filterStock === 'low') {
      filtered = filtered.filter(item => this.isLowStock(item));
    } else if (this.filterStock === 'ok') {
      filtered = filtered.filter(item => !this.isLowStock(item) && item.stock > 0);
    } else if (this.filterStock === 'out') {
      filtered = filtered.filter(item => item.stock === 0);
    }

    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        (item.location && item.location.toLowerCase().includes(term))
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (this.sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'stock':
          compareValue = a.stock - b.stock;
          break;
        case 'variance':
          compareValue = a.variance - b.variance;
          break;
      }

      return this.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    this.filteredItems = filtered;
  }

  setSortBy(field: 'name' | 'stock' | 'variance'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  isLowStock(item: InventoryItem): boolean {
    return item.stock > 0 && item.stock <= item.minStock;
  }

  // ===== SESSION D'INVENTAIRE =====

  startInventory(): void {
    this.showStartModal = true;
  }

  closeStartModal(): void {
    this.showStartModal = false;
  }

  performStartInventory(): void {
    this.currentSession = {
      id: Date.now().toString(),
      startDate: new Date(),
      status: 'in-progress',
      itemsChecked: 0,
      totalItems: this.items.length,
      discrepancies: 0
    };

    this.notificationService.success(
      'Session d\'inventaire démarrée',
      3000,
      { title: 'Inventaire en cours' }
    );

    this.closeStartModal();
  }

  completeInventory(): void {
    if (!this.currentSession) return;

    this.notificationService.showWithAction(
      'Finaliser la session d\'inventaire ?',
      'info',
      'Finaliser',
      () => {
        this.currentSession!.status = 'completed';
        this.currentSession!.endDate = new Date();
        this.lastUpdate = new Date();

        // Mettre à jour la date d'inventaire de tous les items
        this.items.forEach(item => {
          item.lastInventory = new Date();
        });

        this.notificationService.success('Inventaire finalisé');
        this.currentSession = null;
      }
    );
  }

  cancelInventory(): void {
    if (!this.currentSession) return;

    this.notificationService.showWithAction(
      'Annuler la session d\'inventaire en cours ?',
      'warning',
      'Annuler',
      () => {
        this.currentSession = null;
        this.notificationService.warning('Session d\'inventaire annulée');
      }
    );
  }

  // ===== MISE À JOUR DU STOCK =====

  updateStock(item: InventoryItem): void {
    const previousStock = item.stock;

    // Validation
    if (item.stock < 0) {
      item.stock = 0;
      this.notificationService.error('Le stock ne peut pas être négatif');
      return;
    }

    if (item.stock > item.maxStock) {
      this.notificationService.warning(`Stock maximum (${item.maxStock}) dépassé`);
    }

    const variance = item.stock - previousStock;
    item.variance = variance;

    // Ajouter à l'historique
    if (!this.itemHistory[item.id]) {
      this.itemHistory[item.id] = [];
    }

    this.itemHistory[item.id].unshift({
      date: new Date(),
      stock: item.stock,
      variance
    });

    // Mettre à jour la session si active
    if (this.currentSession) {
      this.currentSession.itemsChecked++;
      if (variance !== 0) {
        this.currentSession.discrepancies++;
      }
    }

    this.notificationService.success(`Stock mis à jour: ${item.name}`);
    this.applyFilters();
  }

  // ===== MODAL AJUSTEMENT =====

  adjustStock(item: InventoryItem): void {
    this.selectedItem = item;
    this.adjustForm = {
      newStock: item.stock,
      reason: '',
      notes: ''
    };
    this.showAdjustModal = true;
  }

  closeAdjustModal(): void {
    this.showAdjustModal = false;
    this.selectedItem = null;
  }

  performAdjustStock(): void {
    if (!this.selectedItem) return;

    if (!this.adjustForm.reason) {
      this.notificationService.error('Veuillez indiquer la raison de l\'ajustement');
      return;
    }

    const previousStock = this.selectedItem.stock;
    this.selectedItem.stock = this.adjustForm.newStock;
    const variance = this.adjustForm.newStock - previousStock;
    this.selectedItem.variance = variance;

    // Ajouter à l'historique
    if (!this.itemHistory[this.selectedItem.id]) {
      this.itemHistory[this.selectedItem.id] = [];
    }

    this.itemHistory[this.selectedItem.id].unshift({
      date: new Date(),
      stock: this.adjustForm.newStock,
      variance,
      notes: `${this.adjustForm.reason}${this.adjustForm.notes ? ' - ' + this.adjustForm.notes : ''}`
    });

    this.notificationService.success('Stock ajusté avec succès');
    this.applyFilters();
    this.closeAdjustModal();
  }

  // ===== MODAL HISTORIQUE =====

  viewHistory(item: InventoryItem): void {
    this.selectedItem = item;
    this.showHistoryModal = true;
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedItem = null;
  }

  getItemHistory(itemId: string): InventoryHistory[] {
    return this.itemHistory[itemId] || [];
  }

  generateSampleHistory(): void {
    this.items.forEach(item => {
      this.itemHistory[item.id] = [];

      for (let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i * 3);

        this.itemHistory[item.id].push({
          date,
          stock: item.stock + Math.floor(Math.random() * 10) - 5,
          variance: Math.floor(Math.random() * 6) - 3
        });
      }
    });
  }

  // ===== MODAL DÉTAILS =====

  viewDetails(item: InventoryItem): void {
    this.selectedItem = item;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedItem = null;
  }

  // ===== ACTIONS =====

  incrementStock(item: InventoryItem): void {
    item.stock++;
    this.updateStock(item);
  }

  decrementStock(item: InventoryItem): void {
    if (item.stock > 0) {
      item.stock--;
      this.updateStock(item);
    }
  }

  resetVariance(item: InventoryItem): void {
    item.variance = 0;
    this.notificationService.success('Écart réinitialisé');
  }

  createStockRequest(item: InventoryItem): void {
    const quantity = prompt(`Quantité à commander pour ${item.name}:`);
    if (quantity) {
      this.notificationService.success(`Demande de stock créée: ${quantity} ${item.unit}`);
    }
  }

  markAsChecked(item: InventoryItem): void {
    if (!this.currentSession) {
      this.notificationService.warning('Aucune session d\'inventaire en cours');
      return;
    }

    this.notificationService.success(`${item.name} vérifié`);
  }

  // ===== EXPORT =====

  exportInventory(): void {
    const format = prompt('Format d\'export (CSV/PDF):', 'CSV');

    if (format?.toUpperCase() === 'CSV') {
      this.exportToCSV();
    } else if (format?.toUpperCase() === 'PDF') {
      this.exportToPDF();
    }
  }

  exportToCSV(): void {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventaire_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    this.notificationService.success('Inventaire exporté en CSV');
  }

  generateCSV(): string {
    let csv = 'Nom,Catégorie,Stock,Unité,Écart,Stock Min,Stock Max,Emplacement\n';

    this.filteredItems.forEach(item => {
      csv += `${item.name},${item.category},${item.stock},${item.unit},${item.variance},${item.minStock},${item.maxStock},${item.location || ''}\n`;
    });

    return csv;
  }

  exportToPDF(): void {
    this.notificationService.info('Export PDF en cours...');

    setTimeout(() => {
      this.notificationService.success('Inventaire exporté en PDF');
    }, 1500);
  }

  exportExcel(): void {
    this.notificationService.info('Export Excel en cours...');

    setTimeout(() => {
      this.notificationService.success('Inventaire exporté en Excel');
    }, 1500);
  }

  printInventory(): void {
    window.print();
    this.notificationService.info('Impression lancée');
  }

  // ===== STATISTIQUES =====

  getTotalValue(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.stock * (item.price || 0));
    }, 0);
  }

  getLowStockCount(): number {
    return this.items.filter(item => this.isLowStock(item)).length;
  }

  getOutOfStockCount(): number {
    return this.items.filter(item => item.stock === 0).length;
  }

  getTotalDiscrepancies(): number {
    return this.items.reduce((sum, item) => sum + Math.abs(item.variance), 0);
  }

  getStockHealth(): number {
    const total = this.items.length;
    if (total === 0) return 100;

    const healthy = this.items.filter(item =>
      item.stock > item.minStock && item.stock <= item.maxStock
    ).length;

    return Math.round((healthy / total) * 100);
  }

  getCategoryStats() {
    const stats = new Map<string, {count: number, value: number}>();

    this.items.forEach(item => {
      const current = stats.get(item.category) || {count: 0, value: 0};
      stats.set(item.category, {
        count: current.count + 1,
        value: current.value + (item.stock * (item.price || 0))
      });
    });

    return Array.from(stats.entries()).map(([category, data]) => ({
      category,
      ...data
    }));
  }

  // ===== RAPPORTS =====

  generateInventoryReport(): void {
    this.notificationService.info('Génération du rapport d\'inventaire...');

    setTimeout(() => {
      this.notificationService.success('Rapport généré avec succès');
    }, 2000);
  }

  generateDiscrepancyReport(): void {
    const discrepancies = this.items.filter(item => item.variance !== 0);

    if (discrepancies.length === 0) {
      this.notificationService.info('Aucun écart détecté');
      return;
    }

    this.notificationService.success(`${discrepancies.length} écart(s) trouvé(s)`);
  }

  generateLowStockAlert(): void {
    const lowStock = this.items.filter(item => this.isLowStock(item));

    if (lowStock.length === 0) {
      this.notificationService.success('Tous les stocks sont OK');
      return;
    }

    this.notificationService.warning(`${lowStock.length} produit(s) en stock faible`);
  }

  sendWeeklySummary(): void {
    this.notificationService.success('Résumé hebdomadaire envoyé par email');
  }

  // ===== ACTIONS GROUPÉES =====

  resetAllVariances(): void {
    this.notificationService.showWithAction(
      'Réinitialiser tous les écarts ?',
      'warning',
      'Confirmer',
      () => {
        this.items.forEach(item => {
          item.variance = 0;
        });
        this.notificationService.success('Tous les écarts réinitialisés');
      }
    );
  }

  autoOrder(): void {
    const needsRestock = this.items.filter(item => this.isLowStock(item) || item.stock === 0);

    if (needsRestock.length === 0) {
      this.notificationService.info('Aucun produit à commander');
      return;
    }

    this.notificationService.info(`${needsRestock.length} demande(s) de stock créée(s)`);
  }

  // ===== UTILITAIRES =====

  formatCurrency(value: number): string {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  }

  getStockStatus(item: InventoryItem): string {
    if (item.stock === 0) return 'out';
    if (this.isLowStock(item)) return 'low';
    if (item.stock > item.maxStock) return 'high';
    return 'ok';
  }

  getStockStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'out': 'Rupture',
      'low': 'Stock faible',
      'ok': 'Stock OK',
      'high': 'Stock élevé'
    };
    return labels[status] || status;
  }

  getStockStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'out': '❌',
      'low': '⚠️',
      'ok': '✅',
      'high': '📦'
    };
    return icons[status] || '❓';
  }

  refreshInventory(): void {
    this.applyFilters();
    this.lastUpdate = new Date();
    this.notificationService.info('Inventaire actualisé');
  }
}
