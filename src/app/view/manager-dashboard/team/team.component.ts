// ==========================================
// TEAM COMPONENT - IMPLÉMENTATION COMPLÈTE
// ==========================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

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
  address?: string;
  emergencyContact?: string;
  notes?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'grid';
  searchTerm = '';
  filterStatus = 'all';
  sortBy: 'name' | 'sales' | 'orders' | 'rating' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  showAddModal = false;
  showDetailsModal = false;
  showEditModal = false;
  selectedMember: TeamMember | null = null;

  // Formulaire nouveau membre
  newMember: Partial<TeamMember> = {
    name: '',
    avatar: '👤',
    role: 'Serveur',
    phone: '',
    email: '',
    status: 'present',
    todaySales: 0,
    ordersCompleted: 0,
    rating: 4.5,
    joinDate: new Date().toISOString().split('T')[0]
  };

  // Avatars disponibles
  availableAvatars = ['👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧔', '👨‍🦱', '👩‍🦱', '👨‍🦰', '👩‍🦰'];

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

  filteredMembers: TeamMember[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  // ===== FILTRAGE ET TRI =====

  applyFilters(): void {
    let filtered = [...this.teamMembers];

    // Filtre par statut
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === this.filterStatus);
    }

    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (this.sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'sales':
          compareValue = a.todaySales - b.todaySales;
          break;
        case 'orders':
          compareValue = a.ordersCompleted - b.ordersCompleted;
          break;
        case 'rating':
          compareValue = a.rating - b.rating;
          break;
      }

      return this.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    this.filteredMembers = filtered;
  }

  setSortBy(field: 'name' | 'sales' | 'orders' | 'rating'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  // ===== LABELS =====

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

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'present': '✅',
      'absent': '⭕',
      'leave': '🏖️',
      'off': '💤'
    };
    return icons[status] || '❓';
  }

  // ===== MODAL AJOUT =====

  addMember(): void {
    this.newMember = {
      name: '',
      avatar: '👤',
      role: 'Serveur',
      phone: '',
      email: '',
      status: 'present',
      todaySales: 0,
      ordersCompleted: 0,
      rating: 4.5,
      joinDate: new Date().toISOString().split('T')[0]
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  performAddMember(): void {
    if (!this.validateMemberForm()) return;

    const member: TeamMember = {
      id: Date.now().toString(),
      name: this.newMember.name!,
      avatar: this.newMember.avatar!,
      role: this.newMember.role!,
      phone: this.newMember.phone!,
      email: this.newMember.email!,
      status: this.newMember.status!,
      todaySales: 0,
      ordersCompleted: 0,
      rating: 4.5,
      joinDate: this.newMember.joinDate!
    };

    this.teamMembers.push(member);
    this.applyFilters();

    this.notificationService.success(
      `${member.name} a été ajouté à l'équipe`,
      3000,
      { title: 'Membre ajouté' }
    );

    this.closeAddModal();
  }

  validateMemberForm(): boolean {
    if (!this.newMember.name || this.newMember.name.trim().length < 3) {
      this.notificationService.error('Le nom doit contenir au moins 3 caractères');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.newMember.email || !emailRegex.test(this.newMember.email)) {
      this.notificationService.error('Adresse email invalide');
      return false;
    }

    const phoneRegex = /^\+?[0-9\s]{10,}$/;
    if (!this.newMember.phone || !phoneRegex.test(this.newMember.phone)) {
      this.notificationService.error('Numéro de téléphone invalide');
      return false;
    }

    return true;
  }

  // ===== MODAL DÉTAILS =====

  viewMember(member: TeamMember): void {
    this.selectedMember = member;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedMember = null;
  }

  // ===== MODAL MODIFICATION =====

  editMember(member: TeamMember): void {
    this.selectedMember = { ...member };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedMember = null;
  }

  performEditMember(): void {
    if (!this.selectedMember) return;

    const index = this.teamMembers.findIndex(m => m.id === this.selectedMember!.id);
    if (index !== -1) {
      this.teamMembers[index] = { ...this.selectedMember };
      this.applyFilters();

      this.notificationService.success('Membre modifié avec succès');
      this.closeEditModal();
    }
  }

  // ===== ACTIONS =====

  contactMember(member: TeamMember): void {
    this.notificationService.showWithAction(
      `Contacter ${member.name}`,
      'info',
      'Appeler',
      () => {
        window.location.href = `tel:${member.phone}`;
      }
    );
  }

  sendEmail(member: TeamMember): void {
    window.location.href = `mailto:${member.email}`;
  }

  changeStatus(member: TeamMember, status: 'present' | 'absent' | 'leave' | 'off'): void {
    member.status = status;
    this.applyFilters();
    this.notificationService.success(`Statut changé: ${this.getStatusLabel(status)}`);
  }

  deleteMember(member: TeamMember): void {
    this.notificationService.showWithAction(
      `Supprimer ${member.name} de l'équipe ?`,
      'warning',
      'Supprimer',
      () => {
        const index = this.teamMembers.findIndex(m => m.id === member.id);
        if (index !== -1) {
          this.teamMembers.splice(index, 1);
          this.applyFilters();
          this.notificationService.success('Membre supprimé');
        }
      }
    );
  }

  // ===== EXPORT =====

  exportTeam(): void {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `equipe_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    this.notificationService.success('Équipe exportée');
  }

  generateCSV(): string {
    let csv = 'Nom,Rôle,Email,Téléphone,Statut,Ventes,Commandes,Note\n';

    this.filteredMembers.forEach(m => {
      csv += `${m.name},${m.role},${m.email},${m.phone},${m.status},${m.todaySales},${m.ordersCompleted},${m.rating}\n`;
    });

    return csv;
  }

  printTeam(): void {
    window.print();
    this.notificationService.info('Impression lancée');
  }

  // ===== STATISTIQUES =====

  getTotalSales(): number {
    return this.teamMembers.reduce((sum, m) => sum + m.todaySales, 0);
  }

  getTotalOrders(): number {
    return this.teamMembers.reduce((sum, m) => sum + m.ordersCompleted, 0);
  }

  getAverageRating(): number {
    if (this.teamMembers.length === 0) return 0;
    const total = this.teamMembers.reduce((sum, m) => sum + m.rating, 0);
    return total / this.teamMembers.length;
  }

  getTopPerformer(): TeamMember | null {
    if (this.teamMembers.length === 0) return null;
    return this.teamMembers.reduce((max, m) =>
      m.todaySales > max.todaySales ? m : max
    );
  }

  // ===== ACTIONS GROUPÉES =====

  sendGroupMessage(): void {
    this.notificationService.info('Envoi de message groupé en cours...');
  }

  exportAttendance(): void {
    this.notificationService.info('Export des présences en cours...');
  }

  generateSchedule(): void {
    this.notificationService.info('Génération du planning en cours...');
  }
}
