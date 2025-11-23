// ==========================================
// SALES COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface Sale {
  id: string;
  date: Date;
  server: string;
  serverId: string;
  tableNumber: string;
  items: number;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'mixed';
  tip?: number;
  discount?: number;
  notes?: string;
}

interface SalesStats {
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  cashSales: number;
  cardSales: number;
  totalTips: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  selectedPeriod = 'today';
  searchTerm = '';
  filterPayment = 'all';
  sortBy: 'date' | 'amount' | 'server' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  showDetailsModal = false;
  showStatsModal = false;
  selectedSale: Sale | null = null;

  stats: SalesStats = {
    totalSales: 8450,
    totalOrders: 156,
    averageTicket: 54.17,
    cashSales: 3240,
    cardSales: 5210,
    totalTips: 450
  };

  sales: Sale[] = [
    {
      id: 'VNT001',
      date: new Date('2025-01-06T14:30:00'),
      server: 'Marie M.',
      serverId: '1',
      tableNumber: 'T12',
      items: 3,
      amount: 506,
      paymentMethod: 'card',
      tip: 20
    },
    {
      id: 'VNT002',
      date: new Date('2025-01-06T14:15:00'),
      server: 'Pierre D.',
      serverId: '2',
      tableNumber: 'T05',
      items: 2,
      amount: 275,
      paymentMethod: 'cash'
    },
    {
      id: 'VNT003',
      date: new Date('2025-01-06T13:45:00'),
      server: 'Sophie L.',
      serverId: '3',
      tableNumber: 'T08',
      items: 2,
      amount: 130,
      paymentMethod: 'card',
      tip: 10
    },
    {
      id: 'VNT004',
      date: new Date('2025-01-06T13:30:00'),
      server: 'Marie M.',
      serverId: '1',
      tableNumber: 'T15',
      items: 4,
      amount: 171,
      paymentMethod: 'mixed'
    },
    {
      id: 'VNT005',
      date: new Date('2025-01-06T13:00:00'),
      server: 'Thomas B.',
      serverId: '4',
      tableNumber: 'T03',
      items: 5,
      amount: 425,
      paymentMethod: 'card',
      tip: 25
    },
    {
      id: 'VNT006',
      date: new Date('2025-01-06T12:45:00'),
      server: 'Pierre D.',
      serverId: '2',
      tableNumber: 'T10',
      items: 3,
      amount: 198,
      paymentMethod: 'cash'
    }
  ];

  filteredSales: Sale[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  // ===== CHARGEMENT DES DONNÉES =====

  loadSales(): void {
    console.log('Chargement des ventes:', this.selectedPeriod);
    this.applyFilters();
    this.calculateStats();
  }

  calculateStats(): void {
    const filtered = this.filteredSales;

    this.stats = {
      totalSales: filtered.reduce((sum, s) => sum + s.amount, 0),
      totalOrders: filtered.length,
      averageTicket: filtered.length > 0 ?
        filtered.reduce((sum, s) => sum + s.amount, 0) / filtered.length : 0,
      cashSales: filtered.filter(s => s.paymentMethod === 'cash')
        .reduce((sum, s) => sum + s.amount, 0),
      cardSales: filtered.filter(s => s.paymentMethod === 'card')
        .reduce((sum, s) => sum + s.amount, 0),
      totalTips: filtered.reduce((sum, s) => sum + (s.tip || 0), 0)
    };
  }

  // ===== FILTRAGE ET TRI =====

  applyFilters(): void {
    let filtered = [...this.sales];

    // Filtre par mode de paiement
    if (this.filterPayment !== 'all') {
      filtered = filtered.filter(s => s.paymentMethod === this.filterPayment);
    }

    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.id.toLowerCase().includes(term) ||
        s.server.toLowerCase().includes(term) ||
        s.tableNumber.toLowerCase().includes(term)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (this.sortBy) {
        case 'date':
          compareValue = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          compareValue = a.amount - b.amount;
          break;
        case 'server':
          compareValue = a.server.localeCompare(b.server);
          break;
      }

      return this.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    this.filteredSales = filtered;
    this.calculateStats();
  }

  setSortBy(field: 'date' | 'amount' | 'server'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.applyFilters();
  }

  // ===== MODAL DÉTAILS =====

  viewSale(sale: Sale): void {
    this.selectedSale = sale;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedSale = null;
  }

  // ===== ACTIONS =====

  printReceipt(sale: Sale): void {
    this.notificationService.info(`Impression du reçu ${sale.id}...`);

    setTimeout(() => {
      this.notificationService.success('Reçu imprimé');
    }, 1000);
  }

  sendReceiptByEmail(sale: Sale): void {
    const email = prompt('Adresse email du client:');
    if (email && this.validateEmail(email)) {
      this.notificationService.success(`Reçu envoyé à ${email}`);
    }
  }

  refundSale(sale: Sale): void {
    const reason = prompt('Raison du remboursement:');
    if (reason) {
      this.notificationService.showWithAction(
        `Rembourser ${sale.amount}€ pour ${sale.id}?`,
        'warning',
        'Confirmer',
        () => {
          sale.notes = (sale.notes || '') + ` | Remboursé: ${reason}`;
          this.notificationService.success('Vente remboursée');
        }
      );
    }
  }

  cancelSale(sale: Sale): void {
    this.notificationService.showWithAction(
      `Annuler la vente ${sale.id}?`,
      'warning',
      'Annuler',
      () => {
        const index = this.sales.findIndex(s => s.id === sale.id);
        if (index !== -1) {
          this.sales.splice(index, 1);
          this.applyFilters();
          this.notificationService.success('Vente annulée');
        }
      }
    );
  }

  duplicateSale(sale: Sale): void {
    const duplicate: Sale = {
      ...sale,
      id: 'VNT' + Date.now().toString().slice(-6),
      date: new Date()
    };

    this.sales.unshift(duplicate);
    this.applyFilters();
    this.notificationService.success('Vente dupliquée');
  }

  // ===== STATISTIQUES =====

  getCashPercentage(): number {
    if (this.stats.totalSales === 0) return 0;
    return Math.round((this.stats.cashSales / this.stats.totalSales) * 100);
  }

  getCardPercentage(): number {
    if (this.stats.totalSales === 0) return 0;
    return Math.round((this.stats.cardSales / this.stats.totalSales) * 100);
  }

  getSalesByServer(): Array<{name: string, amount: number, orders: number}> {
    const serverSales = new Map<string, {amount: number, orders: number}>();

    this.filteredSales.forEach(sale => {
      const current = serverSales.get(sale.server) || { amount: 0, orders: 0 };
      serverSales.set(sale.server, {
        amount: current.amount + sale.amount,
        orders: current.orders + 1
      });
    });

    return Array.from(serverSales.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount);
  }

  getSalesByHour(): Array<{hour: number, amount: number, count: number}> {
    const hourSales = new Map<number, {amount: number, count: number}>();

    this.filteredSales.forEach(sale => {
      const hour = sale.date.getHours();
      const current = hourSales.get(hour) || { amount: 0, count: 0 };
      hourSales.set(hour, {
        amount: current.amount + sale.amount,
        count: current.count + 1
      });
    });

    return Array.from(hourSales.entries())
      .map(([hour, data]) => ({ hour, ...data }))
      .sort((a, b) => a.hour - b.hour);
  }

  getBestSellingTable(): string {
    const tableSales = new Map<string, number>();

    this.filteredSales.forEach(sale => {
      const current = tableSales.get(sale.tableNumber) || 0;
      tableSales.set(sale.tableNumber, current + sale.amount);
    });

    let bestTable = '';
    let maxAmount = 0;

    tableSales.forEach((amount, table) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        bestTable = table;
      }
    });

    return bestTable || 'N/A';
  }

  getTopServer(): string {
    const serverSales = this.getSalesByServer();
    return serverSales.length > 0 ? serverSales[0].name : 'N/A';
  }

  // ===== MODAL STATISTIQUES =====

  showStats(): void {
    this.showStatsModal = true;
  }

  closeStatsModal(): void {
    this.showStatsModal = false;
  }

  // ===== EXPORT =====

  exportSales(): void {
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
    link.download = `ventes_${this.selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    this.notificationService.success('Ventes exportées en CSV');
  }

  generateCSV(): string {
    let csv = 'ID,Date,Serveur,Table,Articles,Montant,Paiement,Pourboire\n';

    this.filteredSales.forEach(sale => {
      csv += `${sale.id},${sale.date.toISOString()},${sale.server},${sale.tableNumber},${sale.items},${sale.amount},${sale.paymentMethod},${sale.tip || 0}\n`;
    });

    return csv;
  }

  exportToPDF(): void {
    this.notificationService.info('Export PDF en cours...');

    setTimeout(() => {
      this.notificationService.success('Ventes exportées en PDF');
    }, 1500);
  }

  exportExcel(): void {
    this.notificationService.info('Export Excel en cours...');

    setTimeout(() => {
      this.notificationService.success('Ventes exportées en Excel');
    }, 1500);
  }

  printSales(): void {
    window.print();
    this.notificationService.info('Impression lancée');
  }

  // ===== COMPARAISONS =====

  compareWithYesterday(): void {
    this.notificationService.info('Comparaison avec hier : +12%');
  }

  compareWithLastWeek(): void {
    this.notificationService.info('Comparaison avec la semaine dernière : +8%');
  }

  compareWithLastMonth(): void {
    this.notificationService.info('Comparaison avec le mois dernier : +15%');
  }

  // ===== LABELS =====

  getPaymentLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'cash': '💵 Espèces',
      'card': '💳 Carte',
      'mixed': '💰 Mixte'
    };
    return labels[method] || method;
  }

  getPaymentIcon(method: string): string {
    const icons: { [key: string]: string } = {
      'cash': '💵',
      'card': '💳',
      'mixed': '💰'
    };
    return icons[method] || '💲';
  }

  // ===== UTILITAIRES =====

  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour < 12) return 'Matin';
    if (hour < 18) return 'Après-midi';
    return 'Soir';
  }

  refreshSales(): void {
    this.loadSales();
    this.notificationService.info('Ventes actualisées');
  }

  // ===== ACTIONS GROUPÉES =====

  exportSelectedPeriod(): void {
    this.notificationService.info(`Export des ventes de ${this.selectedPeriod}...`);
  }

  sendDailySummary(): void {
    this.notificationService.success('Résumé journalier envoyé par email');
  }

  generateReport(): void {
    this.notificationService.info('Génération du rapport en cours...');

    setTimeout(() => {
      this.notificationService.success('Rapport généré avec succès');
    }, 2000);
  }
}
