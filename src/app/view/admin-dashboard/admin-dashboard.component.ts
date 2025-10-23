// ===== FICHIER: admin-dashboard.component.ts =====
// Ce fichier contient toute la logique du dashboard admin

import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
// ===== INTERFACES (MODELS) =====

// Interface pour une boisson vedette du carousel
interface FeaturedDrink {
  icon: string;      // Emoji de la boisson
  name: string;      // Nom de la boisson
  category: string;  // Catégorie (VIN ROUGE, BIÈRE, etc.)
  price: string;     // Prix formaté
  stock: string;     // Stock disponible
}

// Interface pour un produit
interface Product {
  id: number;
  name: string;
  category: string;
  icon: string;
  sales: number;     // Nombre de ventes
  price: number;     // Prix en FCFA
  badge?: 'hot' | 'new';  // Badge optionnel
}

// Interface pour une action récente
interface RecentAction {
  icon: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  details: string;
  time: string;
}

// Interface pour un employé
interface Employee {
  name: string;
  position: string;
  avatar: string;
  ventes: string;
  heures: string;
}

// Interface pour un manager
interface Manager {
  name: string;
  role: string;
  avatar: string;
  performance: {
    ventes: string;
    equipe: string;
    satisfaction: string;
  };
  employees: Employee[];
  showEmployees?: boolean;  // Pour gérer l'affichage de la liste
}

// Interface pour les stats de productivité
interface ProductivityStat {
  month: string;
  value: string;
  label: string;
}

// Interface pour une cave
interface Cave {
  id: string;f
  name: string;
  location: string;
  bottles: number;
  managersCount: number;
  employeesCount: number;
  productivity: number;
  managers: Manager[];
  productivityStats: ProductivityStat[];
  globalStats: Array<{ label: string; value: string }>;
}

// Interface pour un accord mets & vins
interface WinePairing {
  id: number;
  dish: string;
  dishIcon: string;
  wine: string;
  wineIcon: string;
  description: string;
  category: string;
}

// Interface pour le profil utilisateur
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  joinDate: string;
}

// ===== DÉCORATEUR DU COMPOSANT =====
@Component({
  selector: 'app-admin-dashboard',
    standalone: true,
  // CommonModule donne accès à *ngIf, *ngFor, etc.
  // ReactiveFormsModule est nécessaire pour les formulaires réactifs
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  // ===== PROPRIÉTÉS DU COMPOSANT =====

  // Navigation
  activePage: string = 'home';  // Page actuellement affichée
  isUserDropdownOpen: boolean = false;  // État du dropdown utilisateur

  // Carousel
  featuredDrinks: FeaturedDrink[] = [
    { icon: '🍷', name: 'Château Margaux', category: 'VIN ROUGE', price: '25 000 FCFA', stock: 'Stock: 45 unités' },
    { icon: '🍺', name: 'Heineken Premium', category: 'BIÈRE', price: '1 500 FCFA', stock: 'Stock: 200 unités' },
    { icon: '🥃', name: 'Hennessy VSOP', category: 'LIQUEUR', price: '35 000 FCFA', stock: 'Stock: 30 unités' },
    { icon: '🥂', name: 'Dom Pérignon', category: 'CHAMPAGNE', price: '45 000 FCFA', stock: 'Stock: 12 unités' },
    { icon: '🥂', name: 'Moët & Chandon', category: 'CHAMPAGNE', price: '15 000 FCFA', stock: 'Stock: 15 unités' }
  ];

  currentDrinkIndex: number = 4;  // Index de la boisson affichée
  private carouselSubscription?: Subscription;  // Subscription pour le carousel automatique

  // Données des produits
  products: Product[] = [
    { id: 1, name: 'Château Margaux', category: 'Vin Rouge', icon: '🍷', sales: 156, price: 25000, badge: 'hot' },
    { id: 2, name: 'Heineken Premium', category: 'Bière', icon: '🍺', sales: 89, price: 1500, badge: 'new' },
    { id: 3, name: 'Hennessy VSOP', category: 'Liqueur', icon: '🥃', sales: 134, price: 35000 },
    { id: 4, name: 'Dom Pérignon', category: 'Champagne', icon: '🥂', sales: 201, price: 45000, badge: 'hot' },
    { id: 5, name: 'Red Bull Energy', category: 'Boisson Énergisante', icon: '⚡', sales: 312, price: 800 },
    { id: 6, name: 'Bissap Délice', category: 'Boisson Locale', icon: '🍹', sales: 67, price: 500, badge: 'new' }
  ];

  // Actions récentes
  recentActions: RecentAction[] = [
    {
      icon: '📥',
      type: 'success',
      title: 'Nouvelle entrée de stock',
      details: '50 bouteilles de Château Margaux • Cave Principale • +1 250 000 FCFA',
      time: 'Il y a 2h'
    },
    {
      icon: '📤',
      type: 'warning',
      title: 'Sortie de stock importante',
      details: '30 bouteilles de Dom Pérignon • Cave Premium • -1 350 000 FCFA',
      time: 'Il y a 5h'
    },
    {
      icon: '👤',
      type: 'info',
      title: 'Nouvel employé ajouté',
      details: 'Marie Dubois • Caissière • Cave Secondaire',
      time: 'Hier'
    },
    {
      icon: '💰',
      type: 'success',
      title: 'Vente exceptionnelle',
      details: 'Commande de 100 bouteilles • Client VIP • +2 500 000 FCFA',
      time: 'Hier'
    },
    {
      icon: '🔧',
      type: 'info',
      title: 'Maintenance effectuée',
      details: 'Système de refroidissement • Cave Premium • Opération réussie',
      time: 'Il y a 2 jours'
    }
  ];

  // Données des caves
  caves: Cave[] = [
    {
      id: 'principale',
      name: '🍷 Cave Principale',
      location: 'Lekki Phase 1, Lagos',
      bottles: 450,
      managersCount: 3,
      employeesCount: 12,
      productivity: 87,
      managers: [
        {
          name: 'Jean Kouassi',
          role: 'Manager Principal',
          avatar: '👨‍💼',
          performance: { ventes: '2.5M', equipe: '12', satisfaction: '96%' },
          showEmployees: false,
          employees: [
            { name: 'Alice Martin', position: 'Caissière', avatar: '👩', ventes: '450K', heures: '160h' },
            { name: 'Bob Traore', position: 'Magasinier', avatar: '👨', ventes: '380K', heures: '158h' },
            { name: 'Claire Diop', position: 'Vendeuse', avatar: '👩', ventes: '520K', heures: '162h' },
            { name: 'David Kone', position: 'Livreur', avatar: '👨', ventes: '290K', heures: '155h' },
            { name: 'Emma Sow', position: 'Assistante', avatar: '👩', ventes: '340K', heures: '160h' }
          ]
        },
        {
          name: 'Marie Diabate',
          role: 'Manager Adjoint',
          avatar: '👩‍💼',
          performance: { ventes: '1.8M', equipe: '8', satisfaction: '94%' },
          showEmployees: false,
          employees: [
            { name: 'Frank Bamba', position: 'Vendeur', avatar: '👨', ventes: '410K', heures: '159h' },
            { name: 'Grace Toure', position: 'Caissière', avatar: '👩', ventes: '390K', heures: '161h' },
            { name: 'Henri Camara', position: 'Magasinier', avatar: '👨', ventes: '310K', heures: '157h' },
            { name: 'Iris Sylla', position: 'Vendeuse', avatar: '👩', ventes: '470K', heures: '163h' }
          ]
        },
        {
          name: 'Pierre Mensah',
          role: 'Manager Nuit',
          avatar: '👨‍💼',
          performance: { ventes: '1.2M', equipe: '6', satisfaction: '91%' },
          showEmployees: false,
          employees: [
            { name: 'Julie Sanogo', position: 'Caissière', avatar: '👩', ventes: '280K', heures: '140h' },
            { name: 'Kevin Ouattara', position: 'Vendeur', avatar: '👨', ventes: '350K', heures: '145h' },
            { name: 'Laura Koffi', position: 'Assistante', avatar: '👩', ventes: '260K', heures: '138h' }
          ]
        }
      ],
      productivityStats: [
        { month: 'Avril 2025', value: '3.2M', label: 'Ventes' },
        { month: 'Mai 2025', value: '3.8M', label: 'Ventes' },
        { month: 'Juin 2025', value: '4.1M', label: 'Ventes' },
        { month: 'Juillet 2025', value: '3.9M', label: 'Ventes' },
        { month: 'Août 2025', value: '4.5M', label: 'Ventes' },
        { month: 'Sept 2025', value: '4.8M', label: 'Ventes' }
      ],
      globalStats: [
        { label: 'Ventes moyennes/mois', value: '4.05M FCFA' },
        { label: 'Taux de croissance', value: '+12.5%' }
      ]
    },
    {
      id: 'secondaire',
      name: '🥂 Cave Secondaire',
      location: 'Victoria Island, Lagos',
      bottles: 320,
      managersCount: 2,
      employeesCount: 8,
      productivity: 92,
      managers: [
        {
          name: 'Sophie Bakayoko',
          role: 'Manager Principal',
          avatar: '👩‍💼',
          performance: { ventes: '1.9M', equipe: '8', satisfaction: '93%' },
          showEmployees: false,
          employees: [
            { name: 'Marc Fofana', position: 'Vendeur', avatar: '👨', ventes: '380K', heures: '158h' },
            { name: 'Nina Coulibaly', position: 'Caissière', avatar: '👩', ventes: '420K', heures: '160h' },
            { name: 'Oscar Berete', position: 'Magasinier', avatar: '👨', ventes: '310K', heures: '156h' },
            { name: 'Paula Keita', position: 'Vendeuse', avatar: '👩', ventes: '460K', heures: '162h' }
          ]
        },
        {
          name: 'Thomas Diarra',
          role: 'Manager Adjoint',
          avatar: '👨‍💼',
          performance: { ventes: '1.5M', equipe: '6', satisfaction: '90%' },
          showEmployees: false,
          employees: [
            { name: 'Quincy Dembele', position: 'Vendeur', avatar: '👨', ventes: '340K', heures: '157h' },
            { name: 'Rita Niang', position: 'Caissière', avatar: '👩', ventes: '390K', heures: '159h' },
            { name: 'Sam Cisse', position: 'Livreur', avatar: '👨', ventes: '280K', heures: '154h' },
            { name: 'Tina Barry', position: 'Assistante', avatar: '👩', ventes: '320K', heures: '158h' }
          ]
        }
      ],
      productivityStats: [
        { month: 'Avril 2025', value: '2.5M', label: 'Ventes' },
        { month: 'Mai 2025', value: '2.8M', label: 'Ventes' },
        { month: 'Juin 2025', value: '3.1M', label: 'Ventes' },
        { month: 'Juillet 2025', value: '2.9M', label: 'Ventes' },
        { month: 'Août 2025', value: '3.3M', label: 'Ventes' },
        { month: 'Sept 2025', value: '3.6M', label: 'Ventes' }
      ],
      globalStats: [
        { label: 'Ventes moyennes/mois', value: '3.03M FCFA' },
        { label: 'Taux de croissance', value: '+9.8%' }
      ]
    },
    {
      id: 'premium',
      name: '✨ Cave Premium',
      location: 'Ikoyi, Lagos',
      bottles: 180,
      managersCount: 1,
      employeesCount: 5,
      productivity: 95,
      managers: [
        {
          name: 'Victoria Sene',
          role: 'Manager Premium',
          avatar: '👩‍💼',
          performance: { ventes: '2.8M', equipe: '5', satisfaction: '98%' },
          showEmployees: false,
          employees: [
            { name: 'William Gueye', position: 'Sommelier', avatar: '👨', ventes: '580K', heures: '160h' },
            { name: 'Xena Ndao', position: 'Caissière VIP', avatar: '👩', ventes: '620K', heures: '162h' },
            { name: 'Yves Fall', position: 'Vendeur Premium', avatar: '👨', ventes: '710K', heures: '165h' },
            { name: 'Zara Diagne', position: 'Conseillère', avatar: '👩', ventes: '590K', heures: '161h' },
            { name: 'Alex Sarr', position: 'Concierge', avatar: '👨', ventes: '480K', heures: '158h' }
          ]
        }
      ],
      productivityStats: [
        { month: 'Avril 2025', value: '2.1M', label: 'Ventes' },
        { month: 'Mai 2025', value: '2.4M', label: 'Ventes' },
        { month: 'Juin 2025', value: '2.7M', label: 'Ventes' },
        { month: 'Juillet 2025', value: '2.9M', label: 'Ventes' },
        { month: 'Août 2025', value: '3.1M', label: 'Ventes' },
        { month: 'Sept 2025', value: '3.4M', label: 'Ventes' }
      ],
      globalStats: [
        { label: 'Ventes moyennes/mois', value: '2.77M FCFA' },
        { label: 'Taux de croissance', value: '+15.2%' }
      ]
    }
  ];

  // Modals
  isCaveModalOpen: boolean = false;
  isAddCaveModalOpen: boolean = false;
  isAddManagerModalOpen: boolean = false;
  isAddEmployeeModalOpen: boolean = false;
  isProfileModalOpen: boolean = false;

  selectedCave?: Cave;  // Cave sélectionnée pour le modal
  activeModalTab: string = 'managers';  // Onglet actif dans le modal cave

  // Sous-menus
  isDrinksSubmenuOpen: boolean = false;

  // Accords mets & vins
  winePairings: WinePairing[] = [
    {
      id: 1,
      dish: 'Steak grillé',
      dishIcon: '🥩',
      wine: 'Château Margaux',
      wineIcon: '🍷',
      description: 'Un vin rouge corsé qui sublime la viande rouge',
      category: 'Viandes rouges'
    },
    {
      id: 2,
      dish: 'Poisson grillé',
      dishIcon: '🐟',
      wine: 'Chablis Blanc',
      wineIcon: '🍾',
      description: 'Un vin blanc sec parfait pour le poisson',
      category: 'Poissons'
    },
    {
      id: 3,
      dish: 'Fromages affinés',
      dishIcon: '🧀',
      wine: 'Sauternes',
      wineIcon: '🍷',
      description: 'Un vin doux qui accompagne merveilleusement les fromages',
      category: 'Fromages'
    },
    {
      id: 4,
      dish: 'Dessert au chocolat',
      dishIcon: '🍫',
      wine: 'Porto Rouge',
      wineIcon: '🥃',
      description: 'Un vin doux et puissant pour les desserts chocolatés',
      category: 'Desserts'
    },
    {
      id: 5,
      dish: 'Poulet rôti',
      dishIcon: '🍗',
      wine: 'Chardonnay',
      wineIcon: '🍾',
      description: 'Un vin blanc rond qui accompagne la volaille',
      category: 'Volailles'
    },
    {
      id: 6,
      dish: 'Fruits de mer',
      dishIcon: '🦞',
      wine: 'Muscadet',
      wineIcon: '🍾',
      description: 'Un vin blanc vif et frais pour les fruits de mer',
      category: 'Fruits de mer'
    }
  ];

  // Profil utilisateur
  userProfile: UserProfile = {
    firstName: 'Franck',
    lastName: 'KONGO',
    email: 'franck.kongo@drinkstore.com',
    phone: '+234 801 234 5678',
    role: 'Administrateur',
    avatar: '👤',
    joinDate: '15 Janvier 2023'
  };

  // Formulaires
  newCaveForm = {
    name: '',
    location: '',
    capacity: 0,
    description: ''
  };

  newManagerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caveId: '',
    role: 'Manager'
  };

  newEmployeeForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    caveId: '',
    managerId: '',
    position: ''
  };

  // Scan (simulation)
  scanResult: string = '';
  isScanActive: boolean = false;

  // ===== CONSTRUCTEUR =====
  constructor() {}

  // ===== MÉTHODE D'INITIALISATION =====
  ngOnInit(): void {
    console.log('✓ Dashboard Admin initialisé avec succès !');

    // Démarre le carousel automatique
    this.startCarouselInterval();

    // Écoute les clics en dehors des dropdowns
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  // ===== MÉTHODE DE DESTRUCTION =====
  ngOnDestroy(): void {
    // Nettoie la subscription du carousel
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }

    // Retire l'écouteur d'événement
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  // ===== MÉTHODES DE NAVIGATION =====

  /**
   * Change la page affichée
   */
  navigateTo(page: string): void {
    this.activePage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Toggle le sous-menu des boissons
   */
  toggleDrinksSubmenu(): void {
    this.isDrinksSubmenuOpen = !this.isDrinksSubmenuOpen;
  }

  /**
   * Toggle le dropdown utilisateur
   */
  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  /**
   * Ferme les dropdowns si on clique ailleurs
   */
  private handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Ferme le dropdown utilisateur
    const userProfile = target.closest('.user-profile');
    if (!userProfile && this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }

  // ===== MÉTHODES DU CAROUSEL =====

  /**
   * Démarre le défilement automatique du carousel
   */
  private startCarouselInterval(): void {
    this.carouselSubscription = interval(5000).subscribe(() => {
      this.nextDrink();
    });
  }

  /**
   * Passe à la boisson suivante
   */
  nextDrink(): void {
    this.currentDrinkIndex = (this.currentDrinkIndex + 1) % this.featuredDrinks.length;
  }

  /**
   * Revient à la boisson précédente
   */
  previousDrink(): void {
    this.currentDrinkIndex = (this.currentDrinkIndex - 1 + this.featuredDrinks.length) % this.featuredDrinks.length;
  }

  /**
   * Va à une boisson spécifique
   */
  goToDrink(index: number): void {
    this.currentDrinkIndex = index;
  }

  // ===== MÉTHODES DES CAVES =====

  /**
   * Ouvre le modal de détails d'une cave
   */
  openCaveModal(cave: Cave): void {
    this.selectedCave = cave;
    this.isCaveModalOpen = true;
    this.activeModalTab = 'managers';
  }

  /**
   * Ferme le modal de cave
   */
  closeCaveModal(): void {
    this.isCaveModalOpen = false;
    this.selectedCave = undefined;
  }

  /**
   * Change l'onglet actif dans le modal cave
   */
  switchModalTab(tab: string): void {
    this.activeModalTab = tab;
  }

  /**
   * Toggle la liste des employés d'un manager
   */
  toggleEmployees(manager: Manager): void {
    manager.showEmployees = !manager.showEmployees;
  }

  /**
   * Ouvre le modal d'ajout de cave
   */
  openAddCaveModal(): void {
    this.isAddCaveModalOpen = true;
  }

  /**
   * Ferme le modal d'ajout de cave
   */
  closeAddCaveModal(): void {
    this.isAddCaveModalOpen = false;
    this.resetNewCaveForm();
  }

  /**
   * Ajoute une nouvelle cave
   */
  addNewCave(): void {
    if (!this.newCaveForm.name || !this.newCaveForm.location) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Ici on enverrait les données au serveur
    alert('✓ Nouvelle cave créée avec succès !');
    this.closeAddCaveModal();
  }

  /**
   * Réinitialise le formulaire de nouvelle cave
   */
  private resetNewCaveForm(): void {
    this.newCaveForm = {
      name: '',
      location: '',
      capacity: 0,
      description: ''
    };
  }

  // ===== MÉTHODES DES MANAGERS =====

  /**
   * Récupère tous les managers de toutes les caves
   */
  getAllManagers(): Manager[] {
    const allManagers: Manager[] = [];
    this.caves.forEach(cave => {
      cave.managers.forEach(manager => {
        allManagers.push({
          ...manager,
          role: `${manager.role} - ${cave.name}`
        });
      });
    });
    return allManagers;
  }

  /**
   * Ouvre le modal d'ajout de manager
   */
  openAddManagerModal(): void {
    this.isAddManagerModalOpen = true;
  }

  /**
   * Ferme le modal d'ajout de manager
   */
  closeAddManagerModal(): void {
    this.isAddManagerModalOpen = false;
    this.resetNewManagerForm();
  }

  /**
   * Ajoute un nouveau manager
   */
  addNewManager(): void {
    if (!this.newManagerForm.firstName || !this.newManagerForm.lastName || !this.newManagerForm.caveId) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    alert('✓ Nouveau manager ajouté avec succès !');
    this.closeAddManagerModal();
  }

  /**
   * Réinitialise le formulaire de nouveau manager
   */
  private resetNewManagerForm(): void {
    this.newManagerForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      caveId: '',
      role: 'Manager'
    };
  }

  // ===== MÉTHODES DES EMPLOYÉS =====

  /**
   * Récupère tous les employés de toutes les caves
   */
  getAllEmployees(): Employee[] {
    const allEmployees: Employee[] = [];
    this.caves.forEach(cave => {
      cave.managers.forEach(manager => {
        manager.employees.forEach(employee => {
          allEmployees.push(employee);
        });
      });
    });
    return allEmployees;
  }

  /**
   * Ouvre le modal d'ajout d'employé
   */
  openAddEmployeeModal(): void {
    this.isAddEmployeeModalOpen = true;
  }

  /**
   * Ferme le modal d'ajout d'employé
   */
  closeAddEmployeeModal(): void {
    this.isAddEmployeeModalOpen = false;
    this.resetNewEmployeeForm();
  }

  /**
   * Ajoute un nouvel employé
   */
  addNewEmployee(): void {
    if (!this.newEmployeeForm.firstName || !this.newEmployeeForm.lastName || !this.newEmployeeForm.caveId) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    alert('✓ Nouvel employé ajouté avec succès !');
    this.closeAddEmployeeModal();
  }

  /**
   * Réinitialise le formulaire de nouvel employé
   */
  private resetNewEmployeeForm(): void {
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
   * Récupère les managers d'une cave spécifique
   */
  getManagersByCave(caveId: string): Manager[] {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.managers : [];
  }

  // ===== MÉTHODES DU SCAN =====

  /**
   * Démarre le scan (simulation)
   */
  startScan(): void {
    this.isScanActive = true;
    this.scanResult = '';

    // Simulation d'un scan après 2 secondes
    setTimeout(() => {
      this.scanResult = JSON.stringify({
        name: 'Château Margaux 2015',
        category: 'Vin Rouge',
        price: 25000,
        stock: 45,
        barcode: '3245678901234'
      }, null, 2);
      this.isScanActive = false;
    }, 2000);
  }

  /**
   * Réinitialise le scan
   */
  resetScan(): void {
    this.scanResult = '';
    this.isScanActive = false;
  }

  // ===== MÉTHODES DU PROFIL =====

  /**
   * Ouvre le modal de profil
   */
  openProfileModal(): void {
    this.isProfileModalOpen = true;
  }

  /**
   * Ferme le modal de profil
   */
  closeProfileModal(): void {
    this.isProfileModalOpen = false;
  }

  /**
   * Sauvegarde les modifications du profil
   */
  saveProfile(): void {
    alert('✓ Profil mis à jour avec succès !');
    this.closeProfileModal();
  }

  /**
   * Déconnexion
   */
  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      alert('👋 À bientôt !');
      // Ici on redirigerait vers la page de connexion
      console.log('Déconnexion...');
    }
  }

  // ===== MÉTHODES UTILITAIRES =====

  /**
   * Formate un nombre en string avec séparateur de milliers
   */
  formatNumber(value: number): string {
    return value.toLocaleString('fr-FR');
  }

  /**
   * Récupère la classe CSS pour le type d'action
   */
  getActionTypeClass(type: string): string {
    return type;
  }

  /**
   * Récupère le badge de la boisson actuelle
   */
  getCurrentDrink(): FeaturedDrink {
    return this.featuredDrinks[this.currentDrinkIndex];
  }

  /**
   * Vérifie si un indicateur du carousel est actif
   */
  isIndicatorActive(index: number): boolean {
    return index === this.currentDrinkIndex;
  }
}
