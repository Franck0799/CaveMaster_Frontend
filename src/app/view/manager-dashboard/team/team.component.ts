// ===== team.component.ts =====
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  position: string;
  avatar: string;
  status: 'en-service' | 'pause' | 'pas-service' | 'conge';
  statusText: string;
  heureDebut: string;
  tempsTravail: string;
  pauseRestante: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  teamData: TeamMember[] = [
    {
      name: 'Alice Martin',
      position: 'Caissière',
      avatar: '👩',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '08:00',
      tempsTravail: '5h 30min',
      pauseRestante: '30min'
    },
    {
      name: 'Bob Traore',
      position: 'Magasinier',
      avatar: '👨',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '08:00',
      tempsTravail: '5h 45min',
      pauseRestante: '15min'
    },
    {
      name: 'Claire Diop',
      position: 'Vendeuse',
      avatar: '👩',
      status: 'pause',
      statusText: 'En pause',
      heureDebut: '09:00',
      tempsTravail: '4h 30min',
      pauseRestante: '0min (pause)'
    },
    {
      name: 'David Kone',
      position: 'Livreur',
      avatar: '👨',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '07:00',
      tempsTravail: '6h 45min',
      pauseRestante: '45min'
    },
    {
      name: 'Emma Sow',
      position: 'Assistante',
      avatar: '👩',
      status: 'pause',
      statusText: 'En pause',
      heureDebut: '08:30',
      tempsTravail: '5h 00min',
      pauseRestante: '0min (pause)'
    },
    {
      name: 'Frank Bamba',
      position: 'Vendeur',
      avatar: '👨',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '10:00',
      tempsTravail: '3h 45min',
      pauseRestante: '1h 00min'
    },
    {
      name: 'Grace Toure',
      position: 'Caissière',
      avatar: '👩',
      status: 'pause',
      statusText: 'En pause',
      heureDebut: '09:00',
      tempsTravail: '4h 30min',
      pauseRestante: '0min (pause)'
    },
    {
      name: 'Henri Camara',
      position: 'Magasinier',
      avatar: '👨',
      status: 'en-service',
      statusText: 'En service',
      heureDebut: '08:00',
      tempsTravail: '5h 45min',
      pauseRestante: '15min'
    },
    {
      name: 'Iris Sylla',
      position: 'Vendeuse',
      avatar: '👩',
      status: 'pas-service',
      statusText: 'Pas en service',
      heureDebut: '16:00',
      tempsTravail: '0h 00min',
      pauseRestante: 'N/A'
    },
    {
      name: 'Julie Sanogo',
      position: 'Caissière',
      avatar: '👩',
      status: 'pas-service',
      statusText: 'Pas en service',
      heureDebut: '18:00',
      tempsTravail: '0h 00min',
      pauseRestante: 'N/A'
    },
    {
      name: 'Kevin Ouattara',
      position: 'Vendeur',
      avatar: '👨',
      status: 'conge',
      statusText: 'En congé',
      heureDebut: '-',
      tempsTravail: '-',
      pauseRestante: 'Retour: 15/10'
    },
    {
      name: 'Laura Koffi',
      position: 'Assistante',
      avatar: '👩',
      status: 'conge',
      statusText: 'En congé',
      heureDebut: '-',
      tempsTravail: '-',
      pauseRestante: 'Retour: 12/10'
    }
  ];

  ngOnInit(): void {
    console.log('Team page loaded');
  }

  getMembersEnService(): number {
    return this.teamData.filter(m => m.status === 'en-service').length;
  }

  getTotalMembers(): number {
    return this.teamData.length;
  }
}
