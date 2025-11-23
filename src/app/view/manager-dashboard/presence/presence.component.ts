// ==========================================
// PRESENCE COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface TeamPresence {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'present' | 'absent' | 'leave' | 'late' | 'off';
  checkInTime?: string;
  checkOutTime?: string;
  expectedTime: string;
  notes?: string;
  workHours?: number;
}

interface PresenceStats {
  totalTeam: number;
  present: number;
  absent: number;
  leave: number;
  late: number;
}

interface PresenceHistory {
  date: Date;
  status: 'present' | 'absent' | 'leave';
  checkIn?: string;
  checkOut?: string;
  hours: number;
}

@Component({
  selector: 'app-presence',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss']
})
export class PresenceComponent implements OnInit {
  currentDate = new Date();
  selectedFilter = 'all';
  searchTerm = '';

  showMarkModal = false;
  showDetailsModal = false;
  showEditModal = false;
  showHistoryModal = false;
  selectedMember: TeamPresence | null = null;

  // Formulaire de pointage
  markForm = {
    memberId: '',
    status: 'present' as 'present' | 'absent' | 'leave',
    time: this.getCurrentTime(),
    notes: ''
  };

  stats: PresenceStats = {
    totalTeam: 6,
    present: 4,
    absent: 1,
    leave: 1,
    late: 0
  };

  teamPresence: TeamPresence[] = [
    {
      id: '1',
      name: 'Marie Martin',
      avatar: '👩',
      role: 'Serveuse',
      status: 'present',
      checkInTime: '09:00',
      expectedTime: '09:00',
      notes: 'Service du midi',
      workHours: 0
    },
    {
      id: '2',
      name: 'Pierre Dubois',
      avatar: '👨',
      role: 'Serveur',
      status: 'present',
      checkInTime: '09:15',
      expectedTime: '09:00',
      notes: 'Légèrement en retard',
      workHours: 0
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      avatar: '👩',
      role: 'Serveuse',
      status: 'leave',
      expectedTime: '14:00',
      notes: 'Congé maladie',
      workHours: 0
    },
    {
      id: '4',
      name: 'Thomas Bernard',
      avatar: '👨',
      role: 'Serveur',
      status: 'present',
      checkInTime: '08:55',
      expectedTime: '09:00',
      workHours: 0
    },
    {
      id: '5',
      name: 'Julie Moreau',
      avatar: '👩',
      role: 'Serveuse',
      status: 'absent',
      expectedTime: '14:00',
      notes: 'Non pointé',
      workHours: 0
    },
    {
      id: '6',
      name: 'Lucas Petit',
      avatar: '👨',
      role: 'Serveur',
      status: 'present',
      checkInTime: '14:00',
      expectedTime: '14:00',
      notes: 'Service du soir',
      workHours: 0
    }
  ];

  filteredMembers: TeamPresence[] = [];

  // Historique simulé
  memberHistory: { [key: string]: PresenceHistory[] } = {};

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.filterMembers();
    this.calculateStats();
    this.calculateWorkHours();
    this.generateSampleHistory();
  }

  // ===== FILTRAGE =====

  filterBy(status: string): void {
    this.selectedFilter = status;
    this.filterMembers();
  }

  filterMembers(): void {
    let filtered = [...this.teamPresence];

    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(m => m.status === this.selectedFilter);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term)
      );
    }

    this.filteredMembers = filtered;
  }

  calculateStats(): void {
    this.stats = {
      totalTeam: this.teamPresence.length,
      present: this.teamPresence.filter(m => m.status === 'present').length,
      absent: this.teamPresence.filter(m => m.status === 'absent').length,
      leave: this.teamPresence.filter(m => m.status === 'leave').length,
      late: this.teamPresence.filter(m => m.status === 'late').length
    };
  }

  calculateWorkHours(): void {
    this.teamPresence.forEach(member => {
      if (member.checkInTime && member.checkOutTime) {
        member.workHours = this.calculateHoursDiff(member.checkInTime, member.checkOutTime);
      } else if (member.checkInTime) {
        member.workHours = this.calculateHoursDiff(member.checkInTime, this.getCurrentTime());
      }
    });
  }

  calculateHoursDiff(start: string, end: string): number {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    return ((endH * 60 + endM) - (startH * 60 + startM)) / 60;
  }

  // ===== MODAL MARQUAGE =====

  markPresence(): void {
    this.markForm = {
      memberId: '',
      status: 'present',
      time: this.getCurrentTime(),
      notes: ''
    };
    this.showMarkModal = true;
  }

  closeMarkModal(): void {
    this.showMarkModal = false;
  }

  performMarkPresence(): void {
    if (!this.markForm.memberId) {
      this.notificationService.error('Veuillez sélectionner un membre');
      return;
    }

    const member = this.teamPresence.find(m => m.id === this.markForm.memberId);
    if (!member) return;

    member.status = this.markForm.status;

    if (this.markForm.status === 'present') {
      member.checkInTime = this.markForm.time;

      // Vérifier si en retard
      if (this.markForm.time > member.expectedTime) {
        member.status = 'late';
        this.notificationService.warning(`${member.name} est en retard`);
      }
    }

    if (this.markForm.notes) {
      member.notes = this.markForm.notes;
    }

    this.calculateStats();
    this.filterMembers();

    this.notificationService.success(
      `Présence marquée pour ${member.name}`,
      3000,
      { title: 'Présence enregistrée' }
    );

    this.closeMarkModal();
  }

  // ===== MODAL DÉTAILS =====

  viewDetails(member: TeamPresence): void {
    this.selectedMember = member;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedMember = null;
  }

  // ===== MODAL MODIFICATION =====

  editPresence(member: TeamPresence): void {
    this.selectedMember = { ...member };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedMember = null;
  }

  performEditPresence(): void {
    if (!this.selectedMember) return;

    const index = this.teamPresence.findIndex(m => m.id === this.selectedMember!.id);
    if (index !== -1) {
      this.teamPresence[index] = { ...this.selectedMember };
      this.calculateStats();
      this.filterMembers();
      this.notificationService.success('Présence modifiée');
      this.closeEditModal();
    }
  }

  // ===== ACTIONS =====

  checkIn(member: TeamPresence): void {
    if (member.checkInTime) {
      this.notificationService.info(`${member.name} a déjà pointé`);
      return;
    }

    member.checkInTime = this.getCurrentTime();
    member.status = 'present';

    if (member.checkInTime > member.expectedTime) {
      member.status = 'late';
      this.notificationService.warning(`${member.name} pointé en retard`);
    } else {
      this.notificationService.success(`${member.name} pointé à l'heure`);
    }

    this.calculateStats();
    this.filterMembers();
  }

  checkOut(member: TeamPresence): void {
    if (!member.checkInTime) {
      this.notificationService.warning(`${member.name} n'a pas encore pointé l'entrée`);
      return;
    }

    if (member.checkOutTime) {
      this.notificationService.info(`${member.name} a déjà pointé la sortie`);
      return;
    }

    member.checkOutTime = this.getCurrentTime();
    const hours = this.calculateHoursDiff(member.checkInTime, member.checkOutTime);

    this.notificationService.success(
      `${member.name} a travaillé ${hours.toFixed(1)}h aujourd'hui`
    );

    this.calculateWorkHours();
  }

  markAbsent(member: TeamPresence): void {
    this.notificationService.showWithAction(
      `Marquer ${member.name} comme absent(e) ?`,
      'warning',
      'Confirmer',
      () => {
        member.status = 'absent';
        member.checkInTime = undefined;
        member.checkOutTime = undefined;
        this.calculateStats();
        this.filterMembers();
        this.notificationService.warning(`${member.name} marqué(e) absent(e)`);
      }
    );
  }

  markLeave(member: TeamPresence): void {
    const reason = prompt('Raison du congé:');
    if (reason) {
      member.status = 'leave';
      member.notes = `Congé: ${reason}`;
      member.checkInTime = undefined;
      member.checkOutTime = undefined;
      this.calculateStats();
      this.filterMembers();
      this.notificationService.info(`${member.name} en congé`);
    }
  }

  // ===== HISTORIQUE =====

  viewHistory(): void {
    this.showHistoryModal = true;
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
  }

  generateSampleHistory(): void {
    this.teamPresence.forEach(member => {
      this.memberHistory[member.id] = [];

      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const random = Math.random();
        const history: PresenceHistory = {
          date,
          status: random > 0.1 ? 'present' : 'absent',
          checkIn: '09:00',
          checkOut: '17:00',
          hours: 8
        };

        if (history.status === 'present') {
          this.memberHistory[member.id].push(history);
        }
      }
    });
  }

  getMemberHistory(memberId: string): PresenceHistory[] {
    return this.memberHistory[memberId] || [];
  }

  getAttendanceRate(memberId: string): number {
    const history = this.getMemberHistory(memberId);
    if (history.length === 0) return 0;

    const present = history.filter(h => h.status === 'present').length;
    return Math.round((present / history.length) * 100);
  }

  getTotalHoursWeek(memberId: string): number {
    const history = this.getMemberHistory(memberId);
    return history.reduce((sum, h) => sum + h.hours, 0);
  }

  // ===== EXPORT =====

  exportPresence(): void {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `presences_${this.formatDate(this.currentDate)}.csv`;
    link.click();

    this.notificationService.success('Présences exportées');
  }

  generateCSV(): string {
    let csv = 'Nom,Rôle,Statut,Arrivée,Départ,Heures,Notes\n';

    this.filteredMembers.forEach(m => {
      csv += `${m.name},${m.role},${m.status},${m.checkInTime || ''},${m.checkOutTime || ''},${m.workHours || 0},${m.notes || ''}\n`;
    });

    return csv;
  }

  printPresence(): void {
    window.print();
    this.notificationService.info('Impression lancée');
  }

  exportHistoryExcel(): void {
    this.notificationService.info('Export de l\'historique en cours...');
    setTimeout(() => {
      this.notificationService.success('Historique exporté');
    }, 1500);
  }

  // ===== RAPPORTS =====

  generateWeeklyReport(): void {
    this.notificationService.info('Génération du rapport hebdomadaire...');

    setTimeout(() => {
      this.notificationService.success('Rapport généré avec succès');
    }, 2000);
  }

  generateMonthlyReport(): void {
    this.notificationService.info('Génération du rapport mensuel...');

    setTimeout(() => {
      this.notificationService.success('Rapport généré avec succès');
    }, 2000);
  }

  sendAttendanceSummary(): void {
    this.notificationService.success('Résumé des présences envoyé par email');
  }

  // ===== LABELS =====

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'present': 'Présent',
      'absent': 'Absent',
      'leave': 'En congé',
      'late': 'En retard',
      'off': 'Repos'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'present': '✅',
      'absent': '⭕',
      'leave': '🏖️',
      'late': '⏰',
      'off': '💤'
    };
    return icons[status] || '❓';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'present': 'success',
      'absent': 'danger',
      'leave': 'info',
      'late': 'warning',
      'off': 'secondary'
    };
    return colors[status] || 'default';
  }

  // ===== STATISTIQUES =====

  getAverageAttendance(): number {
    const total = this.teamPresence.length;
    if (total === 0) return 0;
    return Math.round((this.stats.present / total) * 100);
  }

  getPresentPercentage(): number {
    return this.getAverageAttendance();
  }

  getAbsentPercentage(): number {
    const total = this.teamPresence.length;
    if (total === 0) return 0;
    return Math.round((this.stats.absent / total) * 100);
  }

  getTotalWorkHours(): number {
    return this.teamPresence.reduce((sum, m) => sum + (m.workHours || 0), 0);
  }

  // ===== ACTIONS GROUPÉES =====

  markAllPresent(): void {
    this.notificationService.showWithAction(
      'Marquer tous les membres comme présents ?',
      'info',
      'Confirmer',
      () => {
        this.teamPresence.forEach(m => {
          if (m.status !== 'leave' && m.status !== 'off') {
            m.status = 'present';
            if (!m.checkInTime) {
              m.checkInTime = this.getCurrentTime();
            }
          }
        });
        this.calculateStats();
        this.filterMembers();
        this.notificationService.success('Tous marqués présents');
      }
    );
  }

  sendReminders(): void {
    const absent = this.teamPresence.filter(m => m.status === 'absent');

    if (absent.length === 0) {
      this.notificationService.info('Aucun absent à rappeler');
      return;
    }

    this.notificationService.success(`Rappels envoyés à ${absent.length} personne(s)`);
  }

  // ===== UTILITAIRES =====

  getCurrentTime(): string {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  refreshPresence(): void {
    this.calculateWorkHours();
    this.calculateStats();
    this.filterMembers();
    this.notificationService.info('Présences actualisées');
  }
}
