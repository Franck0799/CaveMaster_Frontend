// ==========================================
// SCHEDULE COMPONENT (Planning)
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


interface Shift {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'evening' | 'night';
  status: 'scheduled' | 'confirmed' | 'absent';
}

@Component({
  selector: 'app-schedule',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./schedule.component.html`,
  styleUrls: [`./schedule.component.scss`]
})
export class ScheduleComponent implements OnInit {
  currentWeekStart: Date = new Date();
  weekDays: Array<{name: string, date: Date}> = [];

  shifts: Shift[] = [
    {
      id: '1',
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
      employeeName: 'Sophie L.',
      employeeAvatar: '👩',
      date: new Date(Date.now() + 86400000),
      startTime: '18:00',
      endTime: '23:00',
      type: 'evening',
      status: 'scheduled'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.setCurrentWeek();
  }

  setCurrentWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    this.currentWeekStart = new Date(today.setDate(diff));

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

  getShiftsForDay(date: Date): Shift[] {
    return this.shifts.filter(shift =>
      shift.date.toDateString() === date.toDateString()
    );
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.setCurrentWeek();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.setCurrentWeek();
  }

  addShift(): void {
    console.log('Ajouter un shift');
  }

  addShiftForDay(date: Date): void {
    console.log('Ajouter un shift pour', date);
  }

  editShift(shift: Shift): void {
    console.log('Modifier shift:', shift);
  }

  deleteShift(shift: Shift): void {
    if (confirm(`Supprimer le shift de ${shift.employeeName}?`)) {
      console.log('Supprimer shift:', shift);
    }
  }
}
