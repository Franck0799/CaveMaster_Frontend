// ===== presence.component.ts =====
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
}

interface PresenceStats {
  totalTeam: number;
  present: number;
  absent: number;
  leave: number;
  late: number;
}

@Component({
  selector: 'app-presence',
  standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./presence.component.html`,
  styleUrls: [`./presence.component.scss`]
})
export class PresenceComponent implements OnInit {
  currentDate = new Date();
  selectedFilter = 'all';
  searchTerm = '';

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
      notes: 'Service du midi'
    },
    {
      id: '2',
      name: 'Pierre Dubois',
      avatar: '👨',
      role: 'Serveur',
      status: 'present',
      checkInTime: '09:15',
      expectedTime: '09:00',
      notes: 'Légèrement en retard'
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      avatar: '👩',
      role: 'Serveuse',
      status: 'leave',
      expectedTime: '14:00',
      notes: 'Congé maladie'
    },
    {
      id: '4',
      name: 'Thomas Bernard',
      avatar: '👨',
      role: 'Serveur',
      status: 'present',
      checkInTime: '08:55',
      expectedTime: '09:00'
    },
    {
      id: '5',
      name: 'Julie Moreau',
      avatar: '👩',
      role: 'Serveuse',
      status: 'absent',
      expectedTime: '14:00',
      notes: 'Non pointé'
    },
    {
      id: '6',
      name: 'Lucas Petit',
      avatar: '👨',
      role: 'Serveur',
      status: 'present',
      checkInTime: '14:00',
      expectedTime: '14:00',
      notes: 'Service du soir'
    }
  ];

  filteredMembers: TeamPresence[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filterMembers();
  }

  filterBy(status: string): void {
    this.selectedFilter = status;
    this.filterMembers();
  }

  filterMembers(): void {
    let filtered = this.teamPresence;

    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(m => m.status === this.selectedFilter);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredMembers = filtered;
  }

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

  markPresence(): void {
    console.log('Marquer une présence');
  }

  viewHistory(): void {
    console.log('Voir l\'historique');
  }

  editPresence(member: TeamPresence): void {
    console.log('Modifier présence:', member);
  }

  viewDetails(member: TeamPresence): void {
    console.log('Voir détails:', member);
  }
}
