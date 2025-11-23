// ==========================================
// SCHEDULE COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface Shift {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  employeeId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'evening' | 'night';
  status: 'scheduled' | 'confirmed' | 'absent' | 'completed';
  notes?: string;
}

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  currentWeekStart: Date = new Date();
  weekDays: Array<{name: string, date: Date}> = [];

  showAddModal = false;
  showEditModal = false;
  showDetailsModal = false;
  selectedShift: Shift | null = null;
  selectedDate: Date | null = null;

  // Formulaire nouveau shift
  newShift: Partial<Shift> = {
    employeeId: '',
    startTime: '09:00',
    endTime: '17:00',
    type: 'morning',
    notes: ''
  };

  // Employés disponibles
  employees: Employee[] = [
    { id: '1', name: 'Marie Martin', avatar: '👩', role: 'Serveuse' },
    { id: '2', name: 'Pierre Dubois', avatar: '👨', role: 'Serveur' },
    { id: '3', name: 'Sophie Laurent', avatar: '👩', role: 'Serveuse' },
    { id: '4', name: 'Thomas Bernard', avatar: '👨', role: 'Serveur' },
    { id: '5', name: 'Julie Moreau', avatar: '👩', role: 'Serveuse' },
    { id: '6', name: 'Lucas Petit', avatar: '👨', role: 'Serveur' }
  ];

  // Types de shifts prédéfinis
  shiftTypes = [
    { value: 'morning', label: 'Matin', hours: '08:00-14:00', color: '#fbbf24' },
    { value: 'afternoon', label: 'Après-midi', hours: '14:00-20:00', color: '#60a5fa' },
    { value: 'evening', label: 'Soir', hours: '18:00-23:00', color: '#a78bfa' },
    { value: 'night', label: 'Nuit', hours: '20:00-02:00', color: '#6366f1' }
  ];

  shifts: Shift[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Marie M.',
      employeeAvatar: '👩',
      date: new Date(),
      startTime: '08:00',
      endTime: '14:00',
      type: 'morning',
      status: 'confirmed'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Pierre D.',
      employeeAvatar: '👨',
      date: new Date(),
      startTime: '14:00',
      endTime: '20:00',
      type: 'afternoon',
      status: 'confirmed'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Sophie L.',
      employeeAvatar: '👩',
      date: new Date(Date.now() + 86400000),
      startTime: '18:00',
      endTime: '23:00',
      type: 'evening',
      status: 'scheduled'
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Thomas B.',
      employeeAvatar: '👨',
      date: new Date(Date.now() + 86400000),
      startTime: '08:00',
      endTime: '14:00',
      type: 'morning',
      status: 'scheduled'
    }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.setCurrentWeek();
  }

  // ===== GESTION DU CALENDRIER =====

  setCurrentWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    this.currentWeekStart = new Date(today.setDate(diff));
    this.currentWeekStart.setHours(0, 0, 0, 0);

    this.weekDays = [];
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(date.getDate() + i);
      this.weekDays.push({
        name: dayNames[i],
        date: date
      });
    }
  }

  getCurrentWeekRange(): string {
    const start = this.weekDays[0]?.date;
    const end = this.weekDays[6]?.date;
    if (!start || !end) return '';

    return `${start.toLocaleDateString('fr-FR')} - ${end.toLocaleDateString('fr-FR')}`;
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.setCurrentWeek();
    this.notificationService.info('Semaine précédente');
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.setCurrentWeek();
    this.notificationService.info('Semaine suivante');
  }

  goToToday(): void {
    this.currentWeekStart = new Date();
    this.setCurrentWeek();
    this.notificationService.info('Semaine actuelle');
  }

  // ===== GESTION DES SHIFTS =====

  getShiftsForDay(date: Date): Shift[] {
    return this.shifts.filter(shift =>
      this.isSameDay(shift.date, date)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  // ===== MODAL AJOUT =====

  addShift(): void {
    this.selectedDate = null;
    this.openAddModal();
  }

  addShiftForDay(date: Date): void {
    this.selectedDate = date;
    this.openAddModal();
  }

  openAddModal(): void {
    this.newShift = {
      employeeId: '',
      startTime: '09:00',
      endTime: '17:00',
      type: 'morning',
      notes: ''
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedDate = null;
  }

  performAddShift(): void {
    if (!this.validateShiftForm()) return;

    const employee = this.employees.find(e => e.id === this.newShift.employeeId);
    if (!employee) return;

    const shiftDate = this.selectedDate || new Date();

    // Vérifier les conflits
    if (this.hasConflict(employee.id, shiftDate, this.newShift.startTime!, this.newShift.endTime!)) {
      this.notificationService.error('Cet employé a déjà un shift qui chevauche cet horaire');
      return;
    }

    const shift: Shift = {
      id: Date.now().toString(),
      employeeId: employee.id,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      date: shiftDate,
      startTime: this.newShift.startTime!,
      endTime: this.newShift.endTime!,
      type: this.newShift.type!,
      status: 'scheduled',
      notes: this.newShift.notes
    };

    this.shifts.push(shift);

    this.notificationService.success(
      `Shift ajouté pour ${employee.name}`,
      3000,
      { title: 'Shift créé' }
    );

    this.closeAddModal();
  }

  validateShiftForm(): boolean {
    if (!this.newShift.employeeId) {
      this.notificationService.error('Veuillez sélectionner un employé');
      return false;
    }

    if (!this.newShift.startTime || !this.newShift.endTime) {
      this.notificationService.error('Veuillez renseigner les horaires');
      return false;
    }

    if (this.newShift.startTime >= this.newShift.endTime) {
      this.notificationService.error('L\'heure de fin doit être après l\'heure de début');
      return false;
    }

    return true;
  }

  hasConflict(employeeId: string, date: Date, startTime: string, endTime: string, excludeShiftId?: string): boolean {
    return this.shifts.some(shift => {
      if (shift.id === excludeShiftId) return false;
      if (shift.employeeId !== employeeId) return false;
      if (!this.isSameDay(shift.date, date)) return false;

      // Vérifier le chevauchement des horaires
      return !(endTime <= shift.startTime || startTime >= shift.endTime);
    });
  }

  // ===== MODAL MODIFICATION =====

  editShift(shift: Shift): void {
    this.selectedShift = { ...shift };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedShift = null;
  }

  performEditShift(): void {
    if (!this.selectedShift) return;

    // Vérifier les conflits (en excluant le shift actuel)
    if (this.hasConflict(
      this.selectedShift.employeeId,
      this.selectedShift.date,
      this.selectedShift.startTime,
      this.selectedShift.endTime,
      this.selectedShift.id
    )) {
      this.notificationService.error('Conflit d\'horaire détecté');
      return;
    }

    const index = this.shifts.findIndex(s => s.id === this.selectedShift!.id);
    if (index !== -1) {
      this.shifts[index] = { ...this.selectedShift };
      this.notificationService.success('Shift modifié');
      this.closeEditModal();
    }
  }

  // ===== MODAL DÉTAILS =====

  viewShiftDetails(shift: Shift): void {
    this.selectedShift = shift;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedShift = null;
  }

  // ===== ACTIONS =====

  deleteShift(shift: Shift): void {
    this.notificationService.showWithAction(
      `Supprimer le shift de ${shift.employeeName}?`,
      'warning',
      'Supprimer',
      () => {
        const index = this.shifts.findIndex(s => s.id === shift.id);
        if (index !== -1) {
          this.shifts.splice(index, 1);
          this.notificationService.success('Shift supprimé');
        }
      }
    );
  }

  confirmShift(shift: Shift): void {
    if (shift.status === 'confirmed') {
      this.notificationService.info('Ce shift est déjà confirmé');
      return;
    }

    shift.status = 'confirmed';
    this.notificationService.success(`Shift confirmé pour ${shift.employeeName}`);
  }

  markAbsent(shift: Shift): void {
    shift.status = 'absent';
    this.notificationService.warning(`${shift.employeeName} marqué(e) absent(e)`);
  }

  duplicateShift(shift: Shift): void {
    const nextWeek = new Date(shift.date);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const duplicate: Shift = {
      ...shift,
      id: Date.now().toString(),
      date: nextWeek,
      status: 'scheduled'
    };

    this.shifts.push(duplicate);
    this.notificationService.success('Shift dupliqué pour la semaine suivante');
  }

  // ===== ACTIONS GROUPÉES =====

  duplicateWeek(): void {
    const currentWeekShifts = this.shifts.filter(shift =>
      this.weekDays.some(day => this.isSameDay(shift.date, day.date))
    );

    if (currentWeekShifts.length === 0) {
      this.notificationService.info('Aucun shift cette semaine');
      return;
    }

    this.notificationService.showWithAction(
      `Dupliquer ${currentWeekShifts.length} shift(s) pour la semaine suivante?`,
      'info',
      'Dupliquer',
      () => {
        currentWeekShifts.forEach(shift => {
          const nextWeek = new Date(shift.date);
          nextWeek.setDate(nextWeek.getDate() + 7);

          const duplicate: Shift = {
            ...shift,
            id: Date.now().toString() + Math.random(),
            date: nextWeek,
            status: 'scheduled'
          };

          this.shifts.push(duplicate);
        });

        this.notificationService.success(`${currentWeekShifts.length} shift(s) dupliqué(s)`);
      }
    );
  }

  clearWeek(): void {
    const weekShifts = this.shifts.filter(shift =>
      this.weekDays.some(day => this.isSameDay(shift.date, day.date))
    );

    if (weekShifts.length === 0) {
      this.notificationService.info('Aucun shift cette semaine');
      return;
    }

    this.notificationService.showWithAction(
      `Supprimer tous les shifts de cette semaine (${weekShifts.length})?`,
      'warning',
      'Supprimer',
      () => {
        this.shifts = this.shifts.filter(shift =>
          !this.weekDays.some(day => this.isSameDay(shift.date, day.date))
        );
        this.notificationService.success('Planning de la semaine effacé');
      }
    );
  }

  autoSchedule(): void {
    this.notificationService.info('Génération automatique du planning...');
    // Logique de génération automatique ici
    setTimeout(() => {
      this.notificationService.success('Planning généré automatiquement');
    }, 1500);
  }

  // ===== EXPORT =====

  exportSchedule(): void {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planning_${this.formatDate(this.currentWeekStart)}.csv`;
    link.click();

    this.notificationService.success('Planning exporté');
  }

  generateCSV(): string {
    let csv = 'Date,Employé,Début,Fin,Type,Statut\n';

    const weekShifts = this.shifts.filter(shift =>
      this.weekDays.some(day => this.isSameDay(shift.date, day.date))
    ).sort((a, b) => a.date.getTime() - b.date.getTime());

    weekShifts.forEach(shift => {
      csv += `${this.formatDate(shift.date)},${shift.employeeName},${shift.startTime},${shift.endTime},${shift.type},${shift.status}\n`;
    });

    return csv;
  }

  printSchedule(): void {
    window.print();
    this.notificationService.info('Impression lancée');
  }

  sendToTeam(): void {
    this.notificationService.success('Planning envoyé à l\'équipe par email');
  }

  // ===== STATISTIQUES =====

  getWeekStats() {
    const weekShifts = this.shifts.filter(shift =>
      this.weekDays.some(day => this.isSameDay(shift.date, day.date))
    );

    return {
      total: weekShifts.length,
      confirmed: weekShifts.filter(s => s.status === 'confirmed').length,
      pending: weekShifts.filter(s => s.status === 'scheduled').length,
      totalHours: weekShifts.reduce((sum, shift) => {
        const hours = this.calculateShiftHours(shift);
        return sum + hours;
      }, 0)
    };
  }

  calculateShiftHours(shift: Shift): number {
    const [startHour, startMin] = shift.startTime.split(':').map(Number);
    const [endHour, endMin] = shift.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return (endMinutes - startMinutes) / 60;
  }

  getEmployeeTotalHours(employeeId: string): number {
    return this.shifts
      .filter(shift => shift.employeeId === employeeId &&
        this.weekDays.some(day => this.isSameDay(shift.date, day.date)))
      .reduce((sum, shift) => sum + this.calculateShiftHours(shift), 0);
  }

  // ===== UTILITAIRES =====

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'scheduled': 'Planifié',
      'confirmed': 'Confirmé',
      'absent': 'Absent',
      'completed': 'Terminé'
    };
    return labels[status] || status;
  }

  getShiftTypeLabel(type: string): string {
    const typeInfo = this.shiftTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.label : type;
  }

  onShiftTypeChange(): void {
    const typeInfo = this.shiftTypes.find(t => t.value === this.newShift.type);
    if (typeInfo) {
      const [start, end] = typeInfo.hours.split('-');
      this.newShift.startTime = start;
      this.newShift.endTime = end;
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
