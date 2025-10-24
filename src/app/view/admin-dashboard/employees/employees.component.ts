import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Interface pour définir la structure d'un employé
 */
interface Employee {
  id: string;
  avatar: string;
  name: string;
  position: string;
  ventes: string;
  heures: string;
  managerId?: string;
  caveId?: string;
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

/**
 * Composant Employees - Gestion des employés
 * Affiche la liste complète des employés avec statistiques
 */
@Component({
  selector: 'app-employees',
  standalone: true,
  // Import des modules nécessaires
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  // Liste de tous les employés (exemple de données)
  employees: Employee[] = [
    {
      id: '1',
      avatar: '👨',
      name: 'Jean Kouassi',
      position: 'Caissier',
      ventes: '250K',
      heures: '160h'
    },
    {
      id: '2',
      avatar: '👩',
      name: 'Marie Diallo',
      position: 'Vendeuse',
      ventes: '320K',
      heures: '155h'
    },
    {
      id: '3',
      avatar: '👨',
      name: 'Paul Mensah',
      position: 'Magasinier',
      ventes: '180K',
      heures: '165h'
    }
  ];

  // Modal d'ajout d'employé
  isAddEmployeeModalOpen: boolean = false;

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

  // Liste des caves (à récupérer depuis un service)
  caves: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Chargement initial des données
    this.loadEmployees();
    this.loadCaves();
  }

  /**
   * Charge la liste des employés depuis le backend
   */
  loadEmployees(): void {
    // TODO: Appel API pour charger les employés
    console.log('Chargement des employés...');
  }

  /**
   * Charge la liste des caves
   */
  loadCaves(): void {
    // TODO: Appel API pour charger les caves
    console.log('Chargement des caves...');
  }

  /**
   * Retourne tous les employés
   * @returns Tableau de tous les employés
   */
  getAllEmployees(): Employee[] {
    return this.employees;
  }

  /**
   * Calcule le nombre total d'employés
   * @returns Nombre total d'employés
   */
  getTotalEmployeesCount(): number {
    return this.employees.length;
  }

  /**
   * Calcule la moyenne des ventes
   * @returns Moyenne des ventes formatée
   */
  getAverageSales(): string {
    // Logique de calcul de moyenne
    return '420K';
  }

  /**
   * Calcule la moyenne des heures travaillées
   * @returns Moyenne des heures
   */
  getAverageHours(): string {
    return '158h';
  }

  /**
   * Ouvre le modal d'ajout d'employé
   */
  openAddEmployeeModal(): void {
    this.isAddEmployeeModalOpen = true;
    // Réinitialiser le formulaire
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
    // Validation du formulaire
    if (!this.validateEmployeeForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Construction de l'objet employé
    const newEmployee: Employee = {
      id: this.generateId(),
      avatar: this.getRandomAvatar(),
      name: `${this.newEmployeeForm.firstName} ${this.newEmployeeForm.lastName}`,
      position: this.newEmployeeForm.position,
      ventes: '0K',
      heures: '0h',
      managerId: this.newEmployeeForm.managerId,
      caveId: this.newEmployeeForm.caveId
    };

    // Ajout à la liste
    this.employees.push(newEmployee);

    // TODO: Appel API pour sauvegarder
    console.log('Nouvel employé ajouté:', newEmployee);

    // Fermeture du modal
    this.closeAddEmployeeModal();

    // Message de succès
    alert('Employé ajouté avec succès !');
  }

  /**
   * Valide le formulaire d'ajout d'employé
   * @returns true si le formulaire est valide
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
   * @returns ID unique
   */
  generateId(): string {
    return `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Retourne un avatar aléatoire
   * @returns Emoji d'avatar
   */
  getRandomAvatar(): string {
    const avatars = ['👨', '👩', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  /**
   * Récupère les managers d'une cave spécifique
   * @param caveId - ID de la cave
   * @returns Liste des managers de cette cave
   */
  getManagersByCave(caveId: string): any[] {
    // TODO: Filtrer les managers par cave
    return [];
  }

  /**
   * Modifie un employé existant
   * @param employee - Employé à modifier
   */
  editEmployee(employee: Employee): void {
    console.log('Modification de l\'employé:', employee);
    // TODO: Ouvrir modal de modification
  }

  /**
   * Supprime un employé
   * @param employee - Employé à supprimer
   */
  deleteEmployee(employee: Employee): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${employee.name} ?`)) {
      // Suppression de la liste
      this.employees = this.employees.filter(e => e.id !== employee.id);

      // TODO: Appel API pour supprimer
      console.log('Employé supprimé:', employee);

      alert('Employé supprimé avec succès');
    }
  }

  /**
   * Affiche les détails d'un employé
   * @param employee - Employé dont afficher les détails
   */
  viewEmployeeDetails(employee: Employee): void {
    console.log('Détails de l\'employé:', employee);
    // TODO: Ouvrir modal de détails ou navigation
  }
}
