// ===== team.component.ts =====
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  email: string;
  status: 'present' | 'absent' | 'leave' | 'off';
  todaySales: number;
  ordersCompleted: number;
  rating: number;
  joinDate: string;
}

@Component({
  selector: 'app-team',
    standalone: true,
    // Import des modules nécessaires
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: `./team.component.html`,
  styleUrls: [`./team.component.scss`]
})
export class TeamComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'grid';

  teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Marie Martin',
      avatar: '👩',
      role: 'Serveuse Senior',
      phone: '+33 6 12 34 56 78',
      email: 'marie.m@caveviking.com',
      status: 'present',
      todaySales: 890,
      ordersCompleted: 12,
      rating: 4.8,
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Pierre Dubois',
      avatar: '👨',
      role: 'Serveur',
      phone: '+33 6 23 45 67 89',
      email: 'pierre.d@caveviking.com',
      status: 'present',
      todaySales: 1240,
      ordersCompleted: 18,
      rating: 4.6,
      joinDate: '2023-03-20'
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      avatar: '👩',
      role: 'Serveuse',
      phone: '+33 6 34 56 78 90',
      email: 'sophie.l@caveviking.com',
      status: 'leave',
      todaySales: 0,
      ordersCompleted: 0,
      rating: 4.7,
      joinDate: '2023-05-10'
    },
    {
      id: '4',
      name: 'Thomas Bernard',
      avatar: '👨',
      role: 'Serveur',
      phone: '+33 6 45 67 89 01',
      email: 'thomas.b@caveviking.com',
      status: 'present',
      todaySales: 440,
      ordersCompleted: 6,
      rating: 4.5,
      joinDate: '2023-07-01'
    },
    {
      id: '5',
      name: 'Julie Moreau',
      avatar: '👩',
      role: 'Serveuse',
      phone: '+33 6 56 78 90 12',
      email: 'julie.m@caveviking.com',
      status: 'off',
      todaySales: 0,
      ordersCompleted: 0,
      rating: 4.9,
      joinDate: '2022-11-15'
    },
    {
      id: '6',
      name: 'Lucas Petit',
      avatar: '👨',
      role: 'Serveur',
      phone: '+33 6 67 89 01 23',
      email: 'lucas.p@caveviking.com',
      status: 'present',
      todaySales: 750,
      ordersCompleted: 10,
      rating: 4.4,
      joinDate: '2023-09-01'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    return '⭐'.repeat(fullStars);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'present': 'Présent',
      'absent': 'Absent',
      'leave': 'Congé',
      'off': 'Repos'
    };
    return labels[status] || status;
  }

  addMember(): void {
    console.log('Ajouter un membre');
  }

  viewMember(member: TeamMember): void {
    console.log('Voir membre:', member);
  }

  editMember(member: TeamMember): void {
    console.log('Modifier membre:', member);
  }

  contactMember(member: TeamMember): void {
    console.log('Contacter membre:', member);
  }
}
