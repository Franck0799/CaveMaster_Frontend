import { Component, OnInit } from '@angular/core';

/**
 * Interface pour définir la structure d'un manager
 */
interface Manager {
  id: string;
  avatar: string;
  name: string;
  role: string;
  performance: {
    ventes: string;
    equipe: string;
    satisfaction: string;
  };
  employees: Employee[];
  showEmployees?: boolean; // Pour toggle l'affichage des employés
  caveId?: string;
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

/**
 * Composant Managers - Gestion des managers
 * Affiche tous les managers avec leurs employés
 */
@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss']
})
export class ManagersComponent implements OnInit {
  
  // Liste de tous les managers (données exemple)
  managers: Manager[] = [
    {
      id: '1',
      avatar: '👨‍💼',
      name: 'Jean Dupont',
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
      showEmployees: false
    },
    {
      id: '2',
      avatar: '👩‍💼',
      name: 'Marie Martin',
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
      showEmployees: false
    }
  ];

  // Modal d'ajout de manager
  isAddManagerModalOpen: boolean = false;

  // Formulaire pour nouveau manager
  newManagerForm: NewManagerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caveId: '',
    role: 'Manager'
  };

  // Liste des caves
  caves: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Chargement initial
    this.loadManagers();
    this.loadCaves();
  }

  /**
   * Charge la liste des managers depuis le backend
   */
  loadManagers(): void {
    // TODO: Appel API
    console.log('Chargement des managers...');
  }

  /**
   * Charge la liste des caves
   */
  loadCaves(): void {
    // TODO: Appel API
    console.log('Chargement des caves...');
  }

  /**
   * Retourne tous les managers
   * @returns Liste complète des managers
   */
  getAllManagers(): Manager[] {
    return this.managers;
  }

  /**
   * Toggle l'affichage des employés d'un manager
   * @param manager - Manager dont afficher/masquer les employés
   */
  toggleEmployees(manager: Manager): void {
    manager.showEmployees = !manager.showEmployees;
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
    // Validation
    if (!this.validateManagerForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Construction de l'objet manager
    const newManager: Manager = {
      id: this.generateId(),
      avatar: this.getRandomAvatar(),
      name: `${this.newManagerForm.firstName} ${this.newManagerForm.lastName}`,
      role: this.newManagerForm.role,
      performance: {
        ventes: '0 FCFA',
        equipe: '0 personnes',
        satisfaction: '0/5'
      },
      employees: [],
      showEmployees: false,
      caveId: this.newManagerForm.caveId
    };

    // Ajout à la liste
    this.managers.push(newManager);

    // TODO: Appel API
    console.log('Nouveau manager ajouté:', newManager);

    // Fermeture du modal
    this.closeAddManagerModal();

    // Message de succès
    alert('Manager ajouté avec succès !');
  }

  /**
   * Valide le formulaire de manager
   * @returns true si le formulaire est valide
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
   * @returns ID unique généré
   */
  generateId(): string {
    return `mgr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Retourne un avatar aléatoire
   * @returns Emoji d'avatar
   */
  getRandomAvatar(): string {
    const avatars = ['👨‍💼', '👩‍💼', '👨‍🏫', '👩‍🏫', '👨‍💻', '👩‍💻'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  /**
   * Modifie un manager existant
   * @param manager - Manager à modifier
   */
  editManager(manager: Manager): void {
    console.log('Modification du manager:', manager);
    // TODO: Ouvrir modal de modification
  }

  /**
   * Supprime un manager
   * @param manager - Manager à supprimer
   */
  deleteManager(manager: Manager): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${manager.name} ?`)) {
      // Suppression de la liste
      this.managers = this.managers.filter(m => m.id !== manager.id);
      
      // TODO: Appel API pour supprimer
      console.log('Manager supprimé:', manager);
      
      alert('Manager supprimé avec succès');
    }
  }

  /**
   * Affiche les statistiques détaillées d'un manager
   * @param manager - Manager dont afficher les stats
   */
  viewManagerStats(manager: Manager): void {
    console.log('Statistiques du manager:', manager);
    // TODO: Navigation vers page de stats ou modal
  }

  /**
   * Calcule le nombre total de managers
   * @returns Nombre total de managers
   */
  getTotalManagersCount(): number {
    return this.managers.length;
  }

  /**
   * Calcule le nombre total d'employés supervisés
   * @returns Nombre total d'employés
   */
  getTotalEmployeesSupervised(): number {
    return this.managers.reduce((total, manager) => {
      return total + manager.employees.length;
    }, 0);
  }

  /**
   * Calcule les ventes totales de tous les managers
   * @returns Ventes totales formatées
   */
  getTotalSales(): string {
    // TODO: Calcul réel des ventes
    return '2.18M';
  }
}