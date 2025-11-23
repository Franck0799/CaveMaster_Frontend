// ==========================================
// DAILY REPORT COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface DailyReportData {
  id?: string;
  date: Date;
  openingCash: number;
  closingCash: number;
  totalSales: number;
  totalOrders: number;
  cashPayments: number;
  cardPayments: number;
  teamPresent: number;
  incidents: string[];
  notes: string;
  submittedBy?: string;
  submittedAt?: Date;
}

interface ReportHistory {
  id: string;
  date: Date;
  totalSales: number;
  difference: number;
  status: 'draft' | 'submitted' | 'approved';
}

@Component({
  selector: 'app-dailyreport',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dailyreport.component.html',
  styleUrls: ['./dailyreport.component.scss']
})
export class DailyReportComponent implements OnInit {
  reportDate = new Date();
  canSubmit = true;
  isEditing = false;
  showHistoryModal = false;
  showPrintPreview = false;

  report: DailyReportData = {
    date: new Date(),
    openingCash: 500,
    closingCash: 0,
    totalSales: 0,
    totalOrders: 0,
    cashPayments: 0,
    cardPayments: 0,
    teamPresent: 0,
    incidents: [],
    notes: ''
  };

  // Historique des rapports
  reportHistory: ReportHistory[] = [
    {
      id: '1',
      date: new Date('2025-01-05'),
      totalSales: 3240,
      difference: 12.50,
      status: 'approved'
    },
    {
      id: '2',
      date: new Date('2025-01-04'),
      totalSales: 2890,
      difference: -5.20,
      status: 'submitted'
    },
    {
      id: '3',
      date: new Date('2025-01-03'),
      totalSales: 3450,
      difference: 0,
      status: 'approved'
    }
  ];

  // Stats rapides
  weekStats = {
    averageSales: 3193,
    bestDay: 'Vendredi',
    totalWeek: 15965
  };

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadTodayData();
    this.checkSubmissionStatus();
  }

  // ===== CALCULS =====

  get cashDifference(): number {
    const expected = this.report.openingCash + this.report.cashPayments;
    return this.report.closingCash - expected;
  }

  get totalPayments(): number {
    return this.report.cashPayments + this.report.cardPayments;
  }

  get averageTicket(): number {
    if (this.report.totalOrders === 0) return 0;
    return this.report.totalSales / this.report.totalOrders;
  }

  // ===== CHARGEMENT DES DONNÉES =====

  loadTodayData(): void {
    // Simuler le chargement des données du jour
    this.report.totalSales = 3240;
    this.report.totalOrders = 45;
    this.report.cashPayments = 1240;
    this.report.cardPayments = 2000;
    this.report.teamPresent = 4;

    // Charger depuis le localStorage si existe
    const savedReport = localStorage.getItem('daily_report_' + this.formatDate(this.reportDate));
    if (savedReport) {
      const parsed = JSON.parse(savedReport);
      this.report = { ...this.report, ...parsed };
      this.isEditing = true;
    }
  }

  checkSubmissionStatus(): void {
    const today = this.formatDate(new Date());
    const reportDate = this.formatDate(this.reportDate);

    // Ne peut soumettre que pour aujourd'hui
    this.canSubmit = (today === reportDate);
  }

  // ===== GESTION DES INCIDENTS =====

  addIncident(): void {
    this.report.incidents.push('');
    this.notificationService.info('Incident ajouté');
  }

  removeIncident(index: number): void {
    if (confirm('Supprimer cet incident ?')) {
      this.report.incidents.splice(index, 1);
      this.notificationService.success('Incident supprimé');
    }
  }

  updateIncident(index: number, value: string): void {
    this.report.incidents[index] = value;
  }

  // ===== VALIDATION ET SOUMISSION =====

  validateReport(): boolean {
    if (this.report.closingCash <= 0) {
      this.notificationService.error('Veuillez renseigner la fermeture de caisse');
      return false;
    }

    if (Math.abs(this.cashDifference) > 50) {
      const confirm = window.confirm(
        `Attention: Différence de caisse importante (${this.cashDifference.toFixed(2)}€).\nVoulez-vous continuer ?`
      );
      if (!confirm) return false;
    }

    if (this.report.incidents.length > 0) {
      const emptyIncidents = this.report.incidents.filter(i => !i.trim());
      if (emptyIncidents.length > 0) {
        this.notificationService.error('Veuillez décrire tous les incidents ou les supprimer');
        return false;
      }
    }

    return true;
  }

  submitReport(): void {
    if (!this.validateReport()) return;

    this.notificationService.showWithAction(
      'Confirmer la soumission du rapport journalier ?',
      'warning',
      'Confirmer',
      () => {
        this.performSubmit();
      }
    );
  }

  performSubmit(): void {
    // Préparer les données
    const reportToSubmit: DailyReportData = {
      ...this.report,
      id: Date.now().toString(),
      submittedBy: 'Jean Dupont',
      submittedAt: new Date()
    };

    // Sauvegarder
    const key = 'daily_report_' + this.formatDate(this.reportDate);
    localStorage.setItem(key, JSON.stringify(reportToSubmit));

    // Ajouter à l'historique
    this.reportHistory.unshift({
      id: reportToSubmit.id!,
      date: reportToSubmit.date,
      totalSales: reportToSubmit.totalSales,
      difference: this.cashDifference,
      status: 'submitted'
    });

    this.notificationService.success(
      'Rapport journalier enregistré avec succès !',
      3000,
      { title: 'Rapport enregistré' }
    );

    this.canSubmit = false;
  }

  saveDraft(): void {
    const key = 'daily_report_draft_' + this.formatDate(this.reportDate);
    localStorage.setItem(key, JSON.stringify(this.report));
    this.notificationService.success('Brouillon sauvegardé');
  }

  // ===== HISTORIQUE =====

  viewHistory(): void {
    this.showHistoryModal = true;
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
  }

  loadHistoryReport(history: ReportHistory): void {
    const key = 'daily_report_' + this.formatDate(history.date);
    const saved = localStorage.getItem(key);

    if (saved) {
      this.report = JSON.parse(saved);
      this.reportDate = history.date;
      this.checkSubmissionStatus();
      this.closeHistoryModal();
      this.notificationService.info('Rapport chargé');
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'draft': 'Brouillon',
      'submitted': 'Soumis',
      'approved': 'Approuvé'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'draft': '📝',
      'submitted': '📤',
      'approved': '✅'
    };
    return icons[status] || '📄';
  }

  // ===== IMPRESSION ET EXPORT =====

  printReport(): void {
    this.showPrintPreview = true;

    setTimeout(() => {
      window.print();
      this.showPrintPreview = false;
    }, 100);
  }

  exportToPDF(): void {
    this.notificationService.info('Export PDF en cours...');

    // Simuler l'export
    setTimeout(() => {
      this.notificationService.success('Rapport exporté en PDF');
    }, 1500);
  }

  exportToExcel(): void {
    this.notificationService.info('Export Excel en cours...');

    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport_${this.formatDate(this.reportDate)}.csv`;
    link.click();

    this.notificationService.success('Rapport exporté en CSV');
  }

  generateCSV(): string {
    return `Date,Ouverture,Fermeture,Ventes,Commandes,Espèces,Carte,Différence
${this.formatDate(this.report.date)},${this.report.openingCash},${this.report.closingCash},${this.report.totalSales},${this.report.totalOrders},${this.report.cashPayments},${this.report.cardPayments},${this.cashDifference}`;
  }

  // ===== COMPARAISON =====

  compareWithYesterday(): void {
    this.notificationService.info('Comparaison avec hier : +12%');
  }

  compareWithLastWeek(): void {
    this.notificationService.info('Comparaison avec la semaine dernière : +8%');
  }

  // ===== UTILITAIRES =====

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  }

  getDifferenceClass(): string {
    const diff = this.cashDifference;
    if (Math.abs(diff) < 5) return 'neutral';
    return diff > 0 ? 'positive' : 'negative';
  }

  resetForm(): void {
    if (confirm('Réinitialiser le formulaire ? Toutes les modifications seront perdues.')) {
      this.loadTodayData();
      this.notificationService.info('Formulaire réinitialisé');
    }
  }
}
