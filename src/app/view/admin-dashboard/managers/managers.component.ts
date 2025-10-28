import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Interface pour l'historique de disponibilité
 */
interface AvailabilityHistory {
  date: string;
  status: 'présent' | 'absent' | 'congé';
  heureArrivee?: string;
  heureDepart?: string;
  duree?: string;
}

/**
 * Interface pour la disponibilité actuelle
 */
interface Availability {
  status: 'présent' | 'absent' | 'congé';
  heureArrivee?: string;
  heureDepart?: string;
  lastUpdate: string;
}

/**
 * Interface pour un employé rattaché à un manager
 */
interface Employee {
  id: string;
  avatar: string;
  name: string;
  position: string;
  ventes: string;
  heures: string;
}

/**
 * Interface pour définir la structure d'un manager
 */
interface Manager {
  id: string;
  avatar: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  performance: {
    ventes: string;
    equipe: string;
    satisfaction: string;
  };
  employees: Employee[];
  showEmployees?: boolean;
  caveId?: string;
  availability: Availability;
  availabilityHistory: AvailabilityHistory[];
}

/**
 * Interface pour le formulaire d'ajout de manager
 */
interface NewManagerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  caveId: string;
  role: string;
}

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss']
})
export class ManagersComponent implements OnInit {

  // Liste de tous les managers avec disponibilité
  managers: Manager[] = [
    {
      id: '1',
      avatar: '👨‍💼',
      firstName: 'Jean',
      lastName: 'Dupont',
      name: 'Jean Dupont',
      email: 'jean.dupont@drinkstore.com',
      phone: '+234 801 111 2222',
      role: 'Manager Principal',
      performance: {
        ventes: '1.2M FCFA',
        equipe: '8 personnes',
        satisfaction: '4.8/5'
      },
      employees: [
        {
          id: 'emp1',
          avatar: '👨',
          name: 'Marc Kouassi',
          position: 'Vendeur',
          ventes: '250K',
          heures: '160h'
        },
        {
          id: 'emp2',
          avatar: '👩',
          name: 'Sophie Diallo',
          position: 'Caissière',
          ventes: '180K',
          heures: '155h'
        }
      ],
      showEmployees: false,
      availability: {
        status: 'présent',
        heureArrivee: '07:45',
        heureDepart: '18:30',
        lastUpdate: '2025-01-27T07:45:00'
      },
      availabilityHistory: [
        { date: '2025-01-27', status: 'présent', heureArrivee: '07:45', heureDepart: '18:30', duree: '10h45' },
        { date: '2025-01-26', status: 'présent', heureArrivee: '07:50', heureDepart: '18:00', duree: '10h10' },
        { date: '2025-01-25', status: 'présent', heureArrivee: '07:40', heureDepart: '18:15', duree: '10h35' },
        { date: '2025-01-24', status: 'absent', heureArrivee: '-', heureDepart: '-', duree: '-' }
      ]
    },
    {
      id: '2',
      avatar: '👩‍💼',
      firstName: 'Marie',
      lastName: 'Martin',
      name: 'Marie Martin',
      email: 'marie.martin@drinkstore.com',
      phone: '+234 802 333 4444',
      role: 'Manager',
      performance: {
        ventes: '980K FCFA',
        equipe: '6 personnes',
        satisfaction: '4.6/5'
      },
      employees: [
        {
          id: 'emp3',
          avatar: '👨',
          name: 'Paul Mensah',
          position: 'Magasinier',
          ventes: '150K',
          heures: '165h'
        }
      ],
      showEmployees: false,
      availability: {
        status: 'congé',
        lastUpdate: '2025-01-25T00:00:00'
      },
      availabilityHistory: [
        { date: '2025-01-27', status: 'congé', heureArrivee: '-', heureDepart: '-', duree: '-' },
        { date: '2025-01-26', status: 'congé', heureArrivee: '-', heureDepart: '-', duree: '-' },
        { date: '2025-01-25', status: 'présent', heureArrivee: '08:00', heureDepart: '17:30', duree: '9h30' },
        { date: '2025-01-24', status: 'présent', heureArrivee: '08:10', heureDepart: '17:45', duree: '9h35' }
      ]
    }
  ];

  // Modals
  isAddManagerModalOpen: boolean = false;
  isEditManagerModalOpen: boolean = false;
  isViewDetailsModalOpen: boolean = false;
  isViewHistoryModalOpen: boolean = false;

  // Manager sélectionné pour les modals
  selectedManager: Manager | null = null;

  // Formulaire pour nouveau manager
  newManagerForm: NewManagerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caveId: '',
    role: 'Manager'
  };

  // Formulaire d'édition
  editManagerForm: Manager | null = null;

  // Liste des caves
  caves: any[] = [
    { id: 'cave1', name: 'Cave Abidjan Centre' },
    { id: 'cave2', name: 'Cave Cocody' },
    { id: 'cave3', name: 'Cave Yopougon' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadManagers();
    this.loadCaves();
  }

  /**
   * Charge la liste des managers depuis le backend
   */
  loadManagers(): void {
    console.log('Chargement des managers...');
  }

  /**
   * Charge la liste des caves
   */
  loadCaves(): void {
    console.log('Chargement des caves...');
  }

  /**
   * Retourne tous les managers
   */
  getAllManagers(): Manager[] {
    return this.managers;
  }

  /**
   * Toggle l'affichage des employés d'un manager
   */
  toggleEmployees(manager: Manager): void {
    manager.showEmployees = !manager.showEmployees;
  }

  /**
   * Calcule le nombre total de managers
   */
  getTotalManagersCount(): number {
    return this.managers.length;
  }

  /**
   * Compte les managers présents
   */
  getPresentManagersCount(): number {
    return this.managers.filter(m => m.availability.status === 'présent').length;
  }

  /**
   * Compte les managers absents
   */
  getAbsentManagersCount(): number {
    return this.managers.filter(m => m.availability.status === 'absent').length;
  }

  /**
   * Compte les managers en congé
   */
  getOnLeaveManagersCount(): number {
    return this.managers.filter(m => m.availability.status === 'congé').length;
  }

  /**
   * Calcule le nombre total d'employés supervisés
   */
  getTotalEmployeesSupervised(): number {
    return this.managers.reduce((total, manager) => {
      return total + manager.employees.length;
    }, 0);
  }

  /**
   * Calcule les ventes totales de tous les managers
   */
  getTotalSales(): string {
    return '2.18M';
  }

  /**
   * Ouvre le modal d'ajout de manager
   */
  openAddManagerModal(): void {
    this.isAddManagerModalOpen = true;
    this.resetManagerForm();
  }

  /**
   * Ferme le modal d'ajout de manager
   */
  closeAddManagerModal(): void {
    this.isAddManagerModalOpen = false;
  }

  /**
   * Réinitialise le formulaire de manager
   */
  resetManagerForm(): void {
    this.newManagerForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      caveId: '',
      role: 'Manager'
    };
  }

  /**
   * Ajoute un nouveau manager
   */
  addNewManager(): void {
    if (!this.validateManagerForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newManager: Manager = {
      id: this.generateId(),
      avatar: this.getRandomAvatar(),
      firstName: this.newManagerForm.firstName,
      lastName: this.newManagerForm.lastName,
      name: `${this.newManagerForm.firstName} ${this.newManagerForm.lastName}`,
      email: this.newManagerForm.email,
      phone: this.newManagerForm.phone,
      role: this.newManagerForm.role,
      performance: {
        ventes: '0 FCFA',
        equipe: '0 personnes',
        satisfaction: '0/5'
      },
      employees: [],
      showEmployees: false,
      caveId: this.newManagerForm.caveId,
      availability: {
        status: 'absent',
        lastUpdate: new Date().toISOString()
      },
      availabilityHistory: []
    };

    this.managers.push(newManager);
    console.log('Nouveau manager ajouté:', newManager);
    this.closeAddManagerModal();
    alert('Manager ajouté avec succès !');
  }

  /**
   * Valide le formulaire de manager
   */
  validateManagerForm(): boolean {
    return !!(
      this.newManagerForm.firstName &&
      this.newManagerForm.lastName &&
      this.newManagerForm.email &&
      this.newManagerForm.caveId &&
      this.newManagerForm.role
    );
  }

  /**
   * Génère un ID unique
   */
  generateId(): string {
    return `mgr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Retourne un avatar aléatoire
   */
  getRandomAvatar(): string {
    const avatars = ['👨‍💼', '👩‍💼', '👨‍🏫', '👩‍🏫', '👨‍💻', '👩‍💻'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  /**
   * Ouvre le modal d'édition avec les informations du manager
   */
  editManager(manager: Manager): void {
    this.selectedManager = manager;
    this.editManagerForm = { ...manager };
    this.isEditManagerModalOpen = true;
  }

  /**
   * Ferme le modal d'édition
   */
  closeEditManagerModal(): void {
    this.isEditManagerModalOpen = false;
    this.selectedManager = null;
    this.editManagerForm = null;
  }

  /**
   * Sauvegarde les modifications du manager
   */
  saveManagerChanges(): void {
    if (!this.editManagerForm) return;

    const index = this.managers.findIndex(m => m.id === this.editManagerForm!.id);
    if (index !== -1) {
      this.managers[index] = { ...this.editManagerForm };
      console.log('Manager modifié:', this.managers[index]);
      alert('Informations mises à jour avec succès !');
      this.closeEditManagerModal();
    }
  }

  /**
   * Supprime un manager
   */
  deleteManager(manager: Manager): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${manager.name} ?`)) {
      this.managers = this.managers.filter(m => m.id !== manager.id);
      console.log('Manager supprimé:', manager);
      alert('Manager supprimé avec succès');
    }
  }

  /**
   * Affiche les statistiques détaillées d'un manager
   */
  viewManagerStats(manager: Manager): void {
    this.selectedManager = manager;
    this.isViewDetailsModalOpen = true;
  }

  /**
   * Ferme le modal de détails
   */
  closeDetailsModal(): void {
    this.isViewDetailsModalOpen = false;
    this.selectedManager = null;
  }

  /**
   * Affiche l'historique de disponibilité
   */
  viewAvailabilityHistory(manager: Manager): void {
    this.selectedManager = manager;
    this.isViewHistoryModalOpen = true;
  }

  /**
   * Ferme le modal d'historique
   */
  closeHistoryModal(): void {
    this.isViewHistoryModalOpen = false;
    this.selectedManager = null;
  }

  /**
   * Retourne la classe CSS selon le statut
   */
  getStatusClass(status: string): string {
    switch(status) {
      case 'présent': return 'status-present';
      case 'absent': return 'status-absent';
      case 'congé': return 'status-leave';
      default: return '';
    }
  }

  /**
   * Retourne l'icône selon le statut
   */
  getStatusIcon(status: string): string {
    switch(status) {
      case 'présent': return '✅';
      case 'absent': return '❌';
      case 'congé': return '🏖️';
      default: return '❓';
    }
  }

  /**
   * Compte les jours présents dans l'historique
   */
  getHistoryPresentDays(manager: Manager): number {
    return manager.availabilityHistory.filter(h => h.status === 'présent').length;
  }

  /**
   * Compte les jours absents dans l'historique
   */
  getHistoryAbsentDays(manager: Manager): number {
    return manager.availabilityHistory.filter(h => h.status === 'absent').length;
  }

  /**
   * Compte les jours de congé dans l'historique
   */
  getHistoryLeaveDays(manager: Manager): number {
    return manager.availabilityHistory.filter(h => h.status === 'congé').length;
  }
}
