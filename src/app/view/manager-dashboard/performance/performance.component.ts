// ==========================================
// PERFORMANCE COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface EmployeePerformance {
  id: string;
  name: string;
  avatar: string;
  role: string;
  totalSales: number;
  ordersCompleted: number;
  averageTicket: number;
  rating: number;
  customerReviews: number;
  punctuality: number;
  productivity: number;
  efficiency: number;
  teamwork: number;
  complaints: number;
  compliments: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  target: number;
  current: number;
  deadline: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  selectedPeriod = 'week';
  sortBy: 'sales' | 'orders' | 'rating' | 'productivity' = 'sales';
  sortOrder: 'asc' | 'desc' = 'desc';

  showDetailsModal = false;
  showGoalsModal = false;
  showCompareModal = false;
  selectedEmployee: EmployeePerformance | null = null;

  employees: EmployeePerformance[] = [
    {
      id: '1',
      name: 'Marie Martin',
      avatar: '👩',
      role: 'Serveuse Senior',
      totalSales: 3240,
      ordersCompleted: 45,
      averageTicket: 72,
      rating: 4.8,
      customerReviews: 28,
      punctuality: 95,
      productivity: 92,
      efficiency: 88,
      teamwork: 90,
      complaints: 1,
      compliments: 12
    },
    {
      id: '2',
      name: 'Pierre Dubois',
      avatar: '👨',
      role: 'Serveur',
      totalSales: 2890,
      ordersCompleted: 38,
      averageTicket: 76,
      rating: 4.6,
      customerReviews: 22,
      punctuality: 88,
      productivity: 89,
      efficiency: 85,
      teamwork: 87,
      complaints: 2,
      compliments: 8
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      avatar: '👩',
      role: 'Serveuse',
      totalSales: 2650,
      ordersCompleted: 35,
      averageTicket: 75.71,
      rating: 4.7,
      customerReviews: 25,
      punctuality: 92,
      productivity: 87,
      efficiency: 90,
      teamwork: 93,
      complaints: 0,
      compliments: 10
    },
    {
      id: '4',
      name: 'Thomas Bernard',
      avatar: '👨',
      role: 'Serveur',
      totalSales: 2120,
      ordersCompleted: 28,
      averageTicket: 75.71,
      rating: 4.5,
      customerReviews: 18,
      punctuality: 85,
      productivity: 83,
      efficiency: 82,
      teamwork: 85,
      complaints: 3,
      compliments: 5
    }
  ];

  topPerformers: EmployeePerformance[] = [];
  filteredEmployees: EmployeePerformance[] = [];

  // Objectifs
  goals: PerformanceGoal[] = [
    {
      id: '1',
      employeeId: '1',
      title: 'Atteindre 5000€ de ventes',
      target: 5000,
      current: 3240,
      deadline: new Date('2025-01-31'),
      status: 'in-progress'
    },
    {
      id: '2',
      employeeId: '2',
      title: 'Obtenir 30 avis clients',
      target: 30,
      current: 22,
      deadline: new Date('2025-01-31'),
      status: 'in-progress'
    }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadPerformance();
  }

  // ===== CHARGEMENT DES DONNÉES =====

  loadPerformance(): void {
    this.sortEmployees();
    this.topPerformers = [...this.employees]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 3);

    this.notificationService.info(`Période: ${this.getPeriodLabel()}`);
  }

  sortEmployees(): void {
    this.filteredEmployees = [...this.employees].sort((a, b) => {
      let compareValue = 0;

      switch (this.sortBy) {
        case 'sales':
          compareValue = a.totalSales - b.totalSales;
          break;
        case 'orders':
          compareValue = a.ordersCompleted - b.ordersCompleted;
          break;
        case 'rating':
          compareValue = a.rating - b.rating;
          break;
        case 'productivity':
          compareValue = a.productivity - b.productivity;
          break;
      }

      return this.sortOrder === 'desc' ? -compareValue : compareValue;
    });
  }

  setSortBy(field: 'sales' | 'orders' | 'rating' | 'productivity'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.sortEmployees();
  }

  // ===== MODAL DÉTAILS =====

  viewDetails(employee: EmployeePerformance): void {
    this.selectedEmployee = employee;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedEmployee = null;
  }

  // ===== MODAL OBJECTIFS =====

  viewGoals(employee: EmployeePerformance): void {
    this.selectedEmployee = employee;
    this.showGoalsModal = true;
  }

  closeGoalsModal(): void {
    this.showGoalsModal = false;
    this.selectedEmployee = null;
  }

  getEmployeeGoals(employeeId: string): PerformanceGoal[] {
    return this.goals.filter(g => g.employeeId === employeeId);
  }

  getGoalProgress(goal: PerformanceGoal): number {
    return Math.min(Math.round((goal.current / goal.target) * 100), 100);
  }

  addGoal(employeeId: string): void {
    const title = prompt('Titre de l\'objectif:');
    if (!title) return;

    const target = prompt('Valeur cible:');
    if (!target) return;

    const days = prompt('Nombre de jours pour atteindre l\'objectif:');
    if (!days) return;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + parseInt(days));

    const goal: PerformanceGoal = {
      id: Date.now().toString(),
      employeeId,
      title,
      target: parseFloat(target),
      current: 0,
      deadline,
      status: 'pending'
    };

    this.goals.push(goal);
    this.notificationService.success('Objectif ajouté');
  }

  deleteGoal(goal: PerformanceGoal): void {
    this.notificationService.showWithAction(
      'Supprimer cet objectif ?',
      'warning',
      'Supprimer',
      () => {
        const index = this.goals.findIndex(g => g.id === goal.id);
        if (index !== -1) {
          this.goals.splice(index, 1);
          this.notificationService.success('Objectif supprimé');
        }
      }
    );
  }

  // ===== MODAL COMPARAISON =====

  compareEmployees(): void {
    this.showCompareModal = true;
  }

  closeCompareModal(): void {
    this.showCompareModal = false;
  }

  // ===== STATISTIQUES =====

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    return '⭐'.repeat(fullStars);
  }

  getPerformanceScore(employee: EmployeePerformance): number {
    return Math.round(
      (employee.productivity * 0.3) +
      (employee.punctuality * 0.2) +
      (employee.rating * 20 * 0.3) +
      (employee.efficiency * 0.2)
    );
  }

  getPerformanceLevel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Très bien';
    if (score >= 70) return 'Bien';
    if (score >= 60) return 'Moyen';
    return 'À améliorer';
  }

  getPerformanceLevelColor(score: number): string {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'primary';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  getTotalSales(): number {
    return this.employees.reduce((sum, e) => sum + e.totalSales, 0);
  }

  getAverageRating(): number {
    if (this.employees.length === 0) return 0;
    const total = this.employees.reduce((sum, e) => sum + e.rating, 0);
    return total / this.employees.length;
  }

  getAverageProductivity(): number {
    if (this.employees.length === 0) return 0;
    const total = this.employees.reduce((sum, e) => sum + e.productivity, 0);
    return Math.round(total / this.employees.length);
  }

  getTotalOrders(): number {
    return this.employees.reduce((sum, e) => sum + e.ordersCompleted, 0);
  }

  // ===== MÉTRIQUES DÉTAILLÉES =====

  getEmployeeMetrics(employee: EmployeePerformance): PerformanceMetric[] {
    return [
      {
        name: 'Ventes totales',
        value: employee.totalSales,
        target: 3500,
        unit: '€',
        trend: employee.totalSales > 3000 ? 'up' : 'down'
      },
      {
        name: 'Commandes',
        value: employee.ordersCompleted,
        target: 40,
        unit: '',
        trend: employee.ordersCompleted > 35 ? 'up' : 'down'
      },
      {
        name: 'Ticket moyen',
        value: employee.averageTicket,
        target: 70,
        unit: '€',
        trend: employee.averageTicket > 70 ? 'up' : 'down'
      },
      {
        name: 'Ponctualité',
        value: employee.punctuality,
        target: 90,
        unit: '%',
        trend: employee.punctuality > 90 ? 'up' : 'down'
      },
      {
        name: 'Productivité',
        value: employee.productivity,
        target: 85,
        unit: '%',
        trend: employee.productivity > 85 ? 'up' : 'stable'
      }
    ];
  }

  getMetricIcon(trend: string): string {
    const icons = {
      'up': '📈',
      'down': '📉',
      'stable': '➖'
    };
    return icons[trend as keyof typeof icons] || '➖';
  }

  getMetricColor(trend: string): string {
    const colors = {
      'up': 'success',
      'down': 'danger',
      'stable': 'warning'
    };
    return colors[trend as keyof typeof colors] || 'secondary';
  }

  // ===== ACTIONS =====

  sendFeedback(employee: EmployeePerformance): void {
    const feedback = prompt(`Feedback pour ${employee.name}:`);
    if (feedback) {
      this.notificationService.success(`Feedback envoyé à ${employee.name}`);
    }
  }

  scheduleReview(employee: EmployeePerformance): void {
    this.notificationService.info(`Entretien planifié avec ${employee.name}`);
  }

  awardBonus(employee: EmployeePerformance): void {
    const amount = prompt('Montant de la prime (€):');
    if (amount) {
      this.notificationService.success(`Prime de ${amount}€ attribuée à ${employee.name}`);
    }
  }

  sendEncouragement(employee: EmployeePerformance): void {
    this.notificationService.success(`Message d'encouragement envoyé à ${employee.name}`);
  }

  // ===== EXPORT =====

  exportPerformance(): void {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performances_${this.selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    this.notificationService.success('Performances exportées');
  }

  generateCSV(): string {
    let csv = 'Nom,Rôle,Ventes,Commandes,Ticket moyen,Note,Ponctualité,Productivité\n';

    this.filteredEmployees.forEach(e => {
      csv += `${e.name},${e.role},${e.totalSales},${e.ordersCompleted},${e.averageTicket},${e.rating},${e.punctuality},${e.productivity}\n`;
    });

    return csv;
  }

  printPerformance(): void {
    window.print();
    this.notificationService.info('Impression lancée');
  }

  exportDetailedReport(): void {
    this.notificationService.info('Export du rapport détaillé en cours...');

    setTimeout(() => {
      this.notificationService.success('Rapport détaillé généré');
    }, 2000);
  }

  // ===== RAPPORTS =====

  generateWeeklyReport(): void {
    this.notificationService.info('Génération du rapport hebdomadaire...');

    setTimeout(() => {
      this.notificationService.success('Rapport hebdomadaire généré');
    }, 2000);
  }

  generateMonthlyReport(): void {
    this.notificationService.info('Génération du rapport mensuel...');

    setTimeout(() => {
      this.notificationService.success('Rapport mensuel généré');
    }, 2000);
  }

  sendTeamSummary(): void {
    this.notificationService.success('Résumé de l\'équipe envoyé par email');
  }

  // ===== LABELS =====

  getPeriodLabel(): string {
    const labels: { [key: string]: string } = {
      'today': 'Aujourd\'hui',
      'week': 'Cette semaine',
      'month': 'Ce mois'
    };
    return labels[this.selectedPeriod] || this.selectedPeriod;
  }

  getGoalStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'in-progress': 'En cours',
      'completed': 'Terminé',
      'failed': 'Échoué'
    };
    return labels[status] || status;
  }

  getGoalStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': '⏳',
      'in-progress': '🎯',
      'completed': '✅',
      'failed': '❌'
    };
    return icons[status] || '📋';
  }

  // ===== ANALYSE =====

  getStrengths(employee: EmployeePerformance): string[] {
    const strengths: string[] = [];

    if (employee.punctuality >= 90) strengths.push('Excellente ponctualité');
    if (employee.productivity >= 90) strengths.push('Très productif');
    if (employee.rating >= 4.7) strengths.push('Excellentes notes clients');
    if (employee.teamwork >= 90) strengths.push('Esprit d\'équipe exemplaire');
    if (employee.complaints === 0) strengths.push('Aucune plainte');

    return strengths;
  }

  getWeaknesses(employee: EmployeePerformance): string[] {
    const weaknesses: string[] = [];

    if (employee.punctuality < 85) weaknesses.push('Ponctualité à améliorer');
    if (employee.productivity < 80) weaknesses.push('Productivité faible');
    if (employee.rating < 4.5) weaknesses.push('Notes clients moyennes');
    if (employee.complaints > 2) weaknesses.push('Trop de plaintes');
    if (employee.efficiency < 80) weaknesses.push('Efficacité à travailler');

    return weaknesses;
  }

  getRecommendations(employee: EmployeePerformance): string[] {
    const recommendations: string[] = [];

    if (employee.productivity < 85) {
      recommendations.push('Formation sur l\'optimisation du service');
    }
    if (employee.rating < 4.6) {
      recommendations.push('Session sur la relation client');
    }
    if (employee.punctuality < 90) {
      recommendations.push('Rappel sur l\'importance de la ponctualité');
    }

    return recommendations;
  }

  // ===== UTILITAIRES =====

  formatCurrency(value: number): string {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  }

  refreshPerformance(): void {
    this.loadPerformance();
    this.notificationService.info('Performances actualisées');
  }
}
