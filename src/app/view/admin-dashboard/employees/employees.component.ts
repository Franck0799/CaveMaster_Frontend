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
 * Interface pour définir la structure d'un employé
 */
interface Employee {
  id: string;
  avatar: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  ventes: string;
  heures: string;
  managerId?: string;
  caveId?: string;
  availability: Availability;
  availabilityHistory: AvailabilityHistory[];
}

/**
 * Interface pour le formulaire d'ajout d'employé
 */
interface NewEmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  caveId: string;
  managerId: string;
  position: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  // Liste de tous les employés avec disponibilité
  employees: Employee[] = [
    {
      id: '1',
      avatar: '👨',
      firstName: 'Jean',
      lastName: 'Kouassi',
      name: 'Jean Kouassi',
      email: 'jean.kouassi@drinkstore.com',
      phone: '+234 801 234 5678',
      position: 'Caissier',
      ventes: '250K',
      heures: '160h',
      availability: {
        status: 'présent',
        heureArrivee: '08:15',
        heureDepart: '17:30',
        lastUpdate: '2025-01-27T08:15:00'
      },
      availabilityHistory: [
        { date: '2025-01-27', status: 'présent', heureArrivee: '08:15', heureDepart: '17:30', duree: '9h15' },
        { date: '2025-01-26', status: 'présent', heureArrivee: '08:05', heureDepart: '17:00', duree: '8h55' },
        { date: '2025-01-25', status: 'absent', heureArrivee: '-', heureDepart: '-', duree: '-' },
        { date: '2025-01-24', status: 'présent', heureArrivee: '08:20', heureDepart: '17:15', duree: '8h55' }
      ]
    },
    {
      id: '2',
      avatar: '👩',
      firstName: 'Marie',
      lastName: 'Diallo',
      name: 'Marie Diallo',
      email: 'marie.diallo@drinkstore.com',
      phone: '+234 802 345 6789',
      position: 'Vendeuse',
      ventes: '320K',
      heures: '155h',
      availability: {
        status: 'congé',
        lastUpdate: '2025-01-25T00:00:00'
      },
      availabilityHistory: [
        { date: '2025-01-27', status: 'congé', heureArrivee: '-', heureDepart: '-', duree: '-' },
        { date: '2025-01-26', status: 'congé', heureArrivee: '-', heureDepart: '-', duree: '-' },
        { date: '2025-01-25', status: 'présent', heureArrivee: '08:00', heureDepart: '17:00', duree: '9h00' },
        { date: '2025-01-24', status: 'présent', heureArrivee: '08:10', heureDepart: '17:20', duree: '9h10' }
      ]
    },
    {
      id: '3',
      avatar: '👨',
      firstName: 'Paul',
      lastName: 'Mensah',
      name: 'Paul Mensah',
      email: 'paul.mensah@drinkstore.com',
      phone: '+234 803 456 7890',
      position: 'Magasinier',
      ventes: '180K',
      heures: '165h',
      availability: {
        status: 'absent',
        lastUpdate: '2025-01-27T08:00:00'
      },
      availabilityHistory: [
        { date: '2025-01-27', status: 'absent', heureArrivee: '-', heureDepart: '-', duree: '-' },
        { date: '2025-01-26', status: 'présent', heureArrivee: '07:55', heureDepart: '17:10', duree: '9h15' },
        { date: '2025-01-25', status: 'présent', heureArrivee: '08:00', heureDepart: '17:00', duree: '9h00' },
        { date: '2025-01-24', status: 'présent', heureArrivee: '08:05', heureDepart: '17:05', duree: '9h00' }
      ]
    }
  ];

  // Modals
  isAddEmployeeModalOpen: boolean = false;
  isEditEmployeeModalOpen: boolean = false;
  isViewDetailsModalOpen: boolean = false;
  isViewHistoryModalOpen: boolean = false;

  // Employé sélectionné pour les modals
  selectedEmployee: Employee | null = null;

  // Formulaire pour nouvel employé
  newEmployeeForm: NewEmployeeForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caveId: '',
    managerId: '',
    position: ''
  };

  // Formulaire d'édition
  editEmployeeForm: Employee | null = null;

  // Liste des caves
  caves: any[] = [
    { id: 'cave1', name: 'Cave Abidjan Centre' },
    { id: 'cave2', name: 'Cave Cocody' },
    { id: 'cave3', name: 'Cave Yopougon' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadCaves();
  }

  /**
   * Charge la liste des employés depuis le backend
   */
  loadEmployees(): void {
    console.log('Chargement des employés...');
  }

  /**
   * Charge la liste des caves
   */
  loadCaves(): void {
    console.log('Chargement des caves...');
  }

  /**
   * Retourne tous les employés
   */
  getAllEmployees(): Employee[] {
    return this.employees;
  }

  /**
   * Calcule le nombre total d'employés
   */
  getTotalEmployeesCount(): number {
    return this.employees.length;
  }

  /**
   * Compte les employés présents
   */
  getPresentEmployeesCount(): number {
    return this.employees.filter(e => e.availability.status === 'présent').length;
  }

  /**
   * Compte les employés absents
   */
  getAbsentEmployeesCount(): number {
    return this.employees.filter(e => e.availability.status === 'absent').length;
  }

  /**
   * Compte les employés en congé
   */
  getOnLeaveEmployeesCount(): number {
    return this.employees.filter(e => e.availability.status === 'congé').length;
  }

  /**
   * Calcule la moyenne des ventes
   */
  getAverageSales(): string {
    return '420K';
  }

  /**
   * Calcule la moyenne des heures travaillées
   */
  getAverageHours(): string {
    return '158h';
  }

  /**
   * Ouvre le modal d'ajout d'employé
   */
  openAddEmployeeModal(): void {
    this.isAddEmployeeModalOpen = true;
    this.resetEmployeeForm();
  }

  /**
   * Ferme le modal d'ajout d'employé
   */
  closeAddEmployeeModal(): void {
    this.isAddEmployeeModalOpen = false;
  }

  /**
   * Réinitialise le formulaire d'ajout d'employé
   */
  resetEmployeeForm(): void {
    this.newEmployeeForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      caveId: '',
      managerId: '',
      position: ''
    };
  }

  /**
   * Ajoute un nouvel employé
   */
  addNewEmployee(): void {
    if (!this.validateEmployeeForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newEmployee: Employee = {
      id: this.generateId(),
      avatar: this.getRandomAvatar(),
      firstName: this.newEmployeeForm.firstName,
      lastName: this.newEmployeeForm.lastName,
      name: `${this.newEmployeeForm.firstName} ${this.newEmployeeForm.lastName}`,
      email: this.newEmployeeForm.email,
      phone: this.newEmployeeForm.phone,
      position: this.newEmployeeForm.position,
      ventes: '0K',
      heures: '0h',
      managerId: this.newEmployeeForm.managerId,
      caveId: this.newEmployeeForm.caveId,
      availability: {
        status: 'absent',
        lastUpdate: new Date().toISOString()
      },
      availabilityHistory: []
    };

    this.employees.push(newEmployee);
    console.log('Nouvel employé ajouté:', newEmployee);
    this.closeAddEmployeeModal();
    alert('Employé ajouté avec succès !');
  }

  /**
   * Valide le formulaire d'ajout d'employé
   */
  validateEmployeeForm(): boolean {
    return !!(
      this.newEmployeeForm.firstName &&
      this.newEmployeeForm.lastName &&
      this.newEmployeeForm.email &&
      this.newEmployeeForm.caveId &&
      this.newEmployeeForm.managerId &&
      this.newEmployeeForm.position
    );
  }

  /**
   * Génère un ID unique pour un nouvel employé
   */
  generateId(): string {
    return `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Retourne un avatar aléatoire
   */
  getRandomAvatar(): string {
    const avatars = ['👨', '👩', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  /**
   * Récupère les managers d'une cave spécifique
   */
  getManagersByCave(caveId: string): any[] {
    // TODO: Filtrer les managers par cave
    return [
      { name: 'Jean Dupont', role: 'Manager Principal' },
      { name: 'Marie Martin', role: 'Manager' }
    ];
  }

  /**
   * Ouvre le modal d'édition avec les informations de l'employé
   */
  editEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.editEmployeeForm = { ...employee };
    this.isEditEmployeeModalOpen = true;
  }

  /**
   * Ferme le modal d'édition
   */
  closeEditEmployeeModal(): void {
    this.isEditEmployeeModalOpen = false;
    this.selectedEmployee = null;
    this.editEmployeeForm = null;
  }

  /**
   * Sauvegarde les modifications de l'employé
   */
  saveEmployeeChanges(): void {
    if (!this.editEmployeeForm) return;

    const index = this.employees.findIndex(e => e.id === this.editEmployeeForm!.id);
    if (index !== -1) {
      this.employees[index] = { ...this.editEmployeeForm };
      console.log('Employé modifié:', this.employees[index]);
      alert('Informations mises à jour avec succès !');
      this.closeEditEmployeeModal();
    }
  }

  /**
   * Supprime un employé
   */
  deleteEmployee(employee: Employee): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${employee.name} ?`)) {
      this.employees = this.employees.filter(e => e.id !== employee.id);
      console.log('Employé supprimé:', employee);
      alert('Employé supprimé avec succès');
    }
  }

  /**
   * Affiche les détails complets d'un employé
   */
  viewEmployeeDetails(employee: Employee): void {
    this.selectedEmployee = employee;
    this.isViewDetailsModalOpen = true;
  }

  /**
   * Ferme le modal de détails
   */
  closeDetailsModal(): void {
    this.isViewDetailsModalOpen = false;
    this.selectedEmployee = null;
  }

  /**
   * Affiche l'historique de disponibilité
   */
  viewAvailabilityHistory(employee: Employee): void {
    this.selectedEmployee = employee;
    this.isViewHistoryModalOpen = true;
  }

  /**
   * Ferme le modal d'historique
   */
  closeHistoryModal(): void {
    this.isViewHistoryModalOpen = false;
    this.selectedEmployee = null;
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
   * Met à jour le statut de disponibilité d'un employé
   */
  updateAvailabilityStatus(employee: Employee, newStatus: 'présent' | 'absent' | 'congé'): void {
    employee.availability.status = newStatus;
    employee.availability.lastUpdate = new Date().toISOString();

    if (newStatus === 'présent' && !employee.availability.heureArrivee) {
      employee.availability.heureArrivee = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    console.log('Statut mis à jour:', employee);
    // TODO: Appel API pour sauvegarder
  }

  /**
   * Compte les jours présents dans l'historique
   */
  getHistoryPresentDays(employee: Employee): number {
    return employee.availabilityHistory.filter(h => h.status === 'présent').length;
  }

  /**
   * Compte les jours absents dans l'historique
   */
  getHistoryAbsentDays(employee: Employee): number {
    return employee.availabilityHistory.filter(h => h.status === 'absent').length;
  }

  /**
   * Compte les jours de congé dans l'historique
   */
  getHistoryLeaveDays(employee: Employee): number {
    return employee.availabilityHistory.filter(h => h.status === 'congé').length;
  }
}
