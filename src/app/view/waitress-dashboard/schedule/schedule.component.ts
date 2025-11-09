// ==========================================
// FICHIER: src/app/server/schedule/schedule.component.ts
// DESCRIPTION: Planning de travail et demandes de congés
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';



interface Shift {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'morning' | 'evening' | 'full-day';
  status: 'scheduled' | 'completed' | 'cancelled';
  duration: number; // en heures
}

interface LeaveRequest {
  id: number;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'personal';
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: Date;
}

interface MonthView {
  year: number;
  month: number;
  days: DayCell[];
}

interface DayCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  shift?: Shift;
  leaveRequest?: LeaveRequest;
}

@Component({
  selector: 'app-schedule',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  currentDate = new Date();
  currentMonth: MonthView = { year: 0, month: 0, days: [] };

  viewMode: 'calendar' | 'list' = 'calendar';

  shifts: Shift[] = [
    {
      id: 1,
      date: new Date(2025, 10, 5),
      startTime: '12:00',
      endTime: '15:00',
      type: 'morning',
      status: 'completed',
      duration: 3
    },
    {
      id: 2,
      date: new Date(2025, 10, 5),
      startTime: '19:00',
      endTime: '23:00',
      type: 'evening',
      status: 'completed',
      duration: 4
    },
    {
      id: 3,
      date: new Date(2025, 10, 6),
      startTime: '12:00',
      endTime: '23:00',
      type: 'full-day',
      status: 'scheduled',
      duration: 11
    },
    {
      id: 4,
      date: new Date(2025, 10, 8),
      startTime: '12:00',
      endTime: '15:00',
      type: 'morning',
      status: 'scheduled',
      duration: 3
    },
    {
      id: 5,
      date: new Date(2025, 10, 8),
      startTime: '19:00',
      endTime: '23:00',
      type: 'evening',
      status: 'scheduled',
      duration: 4
    }
  ];

  leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      startDate: new Date(2025, 10, 15),
      endDate: new Date(2025, 10, 17),
      type: 'vacation',
      reason: 'Vacances familiales',
      status: 'pending',
      submittedDate: new Date(2025, 10, 1)
    },
    {
      id: 2,
      startDate: new Date(2025, 9, 20),
      endDate: new Date(2025, 9, 22),
      type: 'vacation',
      status: 'approved',
      submittedDate: new Date(2025, 9, 5)
    }
  ];

  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  showLeaveModal = false;
  newLeaveRequest: Partial<LeaveRequest> = {};

  constructor() {}

  ngOnInit(): void {
    this.generateMonthView();
  }

  generateMonthView(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();

    const days: DayCell[] = [];

    // Jours du mois précédent
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date,
        dayNumber: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const shift = this.getShiftForDate(date);
      const leaveRequest = this.getLeaveRequestForDate(date);

      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        shift,
        leaveRequest
      });
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines complètes
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false
      });
    }

    this.currentMonth = { year, month, days };
  }

  getShiftForDate(date: Date): Shift | undefined {
    return this.shifts.find(shift =>
      shift.date.toDateString() === date.toDateString()
    );
  }

  getLeaveRequestForDate(date: Date): LeaveRequest | undefined {
    return this.leaveRequests.find(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      const checkDate = new Date(date);
      checkDate.setHours(12, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateMonthView();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateMonthView();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateMonthView();
  }

  getMonthName(): string {
    return this.currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  getShiftTypeLabel(type: string): string {
    const labels: any = {
      'morning': 'Matin',
      'evening': 'Soir',
      'full-day': 'Journée'
    };
    return labels[type] || type;
  }

  getShiftTypeColor(type: string): string {
    const colors: any = {
      'morning': 'info',
      'evening': 'warning',
      'full-day': 'primary'
    };
    return colors[type] || 'default';
  }

  getLeaveTypeLabel(type: string): string {
    const labels: any = {
      'vacation': 'Congés',
      'sick': 'Maladie',
      'personal': 'Personnel'
    };
    return labels[type] || type;
  }

  getLeaveStatusLabel(status: string): string {
    const labels: any = {
      'pending': 'En attente',
      'approved': 'Approuvé',
      'rejected': 'Refusé'
    };
    return labels[status] || status;
  }

  getLeaveStatusColor(status: string): string {
    const colors: any = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger'
    };
    return colors[status] || 'default';
  }

  getTotalHoursThisMonth(): number {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();

    return this.shifts
      .filter(shift => {
        const shiftDate = shift.date;
        return shiftDate.getMonth() === month && shiftDate.getFullYear() === year;
      })
      .reduce((total, shift) => total + shift.duration, 0);
  }

  getScheduledDaysThisMonth(): number {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();

    const uniqueDates = new Set(
      this.shifts
        .filter(shift => {
          const shiftDate = shift.date;
          return shiftDate.getMonth() === month && shiftDate.getFullYear() === year;
        })
        .map(shift => shift.date.toDateString())
    );

    return uniqueDates.size;
  }

  openLeaveModal(): void {
    this.newLeaveRequest = {
      type: 'vacation',
      status: 'pending',
      submittedDate: new Date()
    };
    this.showLeaveModal = true;
  }

  closeLeaveModal(): void {
    this.showLeaveModal = false;
    this.newLeaveRequest = {};
  }

  submitLeaveRequest(): void {
    if (!this.newLeaveRequest.startDate || !this.newLeaveRequest.endDate) {
      alert('Veuillez remplir les dates');
      return;
    }

    const request: LeaveRequest = {
      id: Date.now(),
      startDate: new Date(this.newLeaveRequest.startDate),
      endDate: new Date(this.newLeaveRequest.endDate),
      type: this.newLeaveRequest.type as any,
      reason: this.newLeaveRequest.reason,
      status: 'pending',
      submittedDate: new Date()
    };

    this.leaveRequests.push(request);

    // TODO: Envoyer au backend
    console.log('Leave request submitted:', request);

    alert('Demande de congés envoyée !');
    this.closeLeaveModal();
    this.generateMonthView();
  }

  cancelLeaveRequest(request: LeaveRequest): void {
    if (confirm('Annuler cette demande de congés ?')) {
      this.leaveRequests = this.leaveRequests.filter(r => r.id !== request.id);
      this.generateMonthView();
    }
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'calendar' ? 'list' : 'calendar';
  }
}
