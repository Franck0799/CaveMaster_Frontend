// ===== FICHIER: admin-dashboard.component.ts =====
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

// ===== INTERFACES =====
interface FeaturedDrink {
  icon: string;
  name: string;
  category: string;
  price: string;
  stock: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  icon: string;
  sales: number;
  price: number;
  badge?: 'hot' | 'new';
}

interface RecentAction {
  icon: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  details: string;
  time: string;
}

interface Employee {
  name: string;
  position: string;
  avatar: string;
  ventes: string;
  heures: string;
}

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
  showEmployees?: boolean;
}

interface ProductivityStat {
  month: string;
  value: string;
  label: string;
}

interface Cave {
  id: string;
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

interface WinePairing {
  id: number;
  dish: string;
  dishIcon: string;
  wine: string;
  wineIcon: string;
  description: string;
  category: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  joinDate: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  growthRate: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ThemeToggleComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  // ===== ÉTAT DE NAVIGATION =====
  activePage: string = 'home';
  isUserDropdownOpen: boolean = false;
  isDrinksSubmenuOpen: boolean = false;
  isMobileSidebarOpen: boolean = false;
  private routerSubscription?: Subscription;

  // ===== CAROUSEL =====
  featuredDrinks: FeaturedDrink[] = [
    {
      icon: '🍷',
      name: 'Château Margaux',
      category: 'VIN ROUGE',
      price: '25 000 FCFA',
      stock: 'Stock: 45 unités'
    },
    {
      icon: '🍺',
      name: 'Heineken Premium',
      category: 'BIÈRE',
      price: '1 500 FCFA',
      stock: 'Stock: 200 unités'
    },
    {
      icon: '🥃',
      name: 'Hennessy VSOP',
      category: 'LIQUEUR',
      price: '35 000 FCFA',
      stock: 'Stock: 30 unités'
    },
    {
      icon: '🥂',
      name: 'Dom Pérignon',
      category: 'CHAMPAGNE',
      price: '45 000 FCFA',
      stock: 'Stock: 12 unités'
    },
    {
      icon: '🥂',
      name: 'Moët & Chandon',
      category: 'CHAMPAGNE',
      price: '15 000 FCFA',
      stock: 'Stock: 15 unités'
    }
  ];

  currentDrinkIndex: number = 0;
  private carouselSubscription?: Subscription;
  private carouselInterval: number = 5000; // 5 secondes

  // ===== DONNÉES PRODUITS =====
  products: Product[] = [
    {
      id: 1,
      name: 'Château Margaux',
      category: 'Vin Rouge',
      icon: '🍷',
      sales: 156,
      price: 25000,
      badge: 'hot'
    },
    {
      id: 2,
      name: 'Heineken Premium',
      category: 'Bière',
      icon: '🍺',
      sales: 89,
      price: 1500,
      badge: 'new'
    },
    {
      id: 3,
      name: 'Hennessy VSOP',
      category: 'Liqueur',
      icon: '🥃',
      sales: 134,
      price: 35000
    },
    {
      id: 4,
      name: 'Dom Pérignon',
      category: 'Champagne',
      icon: '🥂',
      sales: 201,
      price: 45000,
      badge: 'hot'
    },
    {
      id: 5,
      name: 'Red Bull Energy',
      category: 'Boisson Énergisante',
      icon: '⚡',
      sales: 312,
      price: 800
    },
    {
      id: 6,
      name: 'Bissap Délice',
      category: 'Boisson Locale',
      icon: '🍹',
      sales: 67,
      price: 500,
      badge: 'new'
    }
  ];

  // ===== ACTIONS RÉCENTES =====
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

  // ===== STATISTIQUES =====
  dashboardStats: DashboardStats = {
    totalRevenue: 4500000,
    totalOrders: 234,
    totalCustomers: 89,
    growthRate: 12.5
  };

  // ===== CAVES =====
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
          performance: {
            ventes: '2.5M',
            equipe: '12',
            satisfaction: '96%'
          },
          showEmployees: false,
          employees: [
            {
              name: 'Alice Martin',
              position: 'Caissière',
              avatar: '👩',
              ventes: '450K',
              heures: '160h'
            },
            {
              name: 'Bob Traore',
              position: 'Magasinier',
              avatar: '👨',
              ventes: '380K',
              heures: '158h'
            },
            {
              name: 'Claire Diop',
              position: 'Vendeuse',
              avatar: '👩',
              ventes: '520K',
              heures: '162h'
            }
          ]
        },
        {
          name: 'Sophie Diallo',
          role: 'Manager Adjoint',
          avatar: '👩‍💼',
          performance: {
            ventes: '1.8M',
            equipe: '8',
            satisfaction: '92%'
          },
          showEmployees: false,
          employees: [
            {
              name: 'David Kone',
              position: 'Vendeur',
              avatar: '👨',
              ventes: '380K',
              heures: '155h'
            },
            {
              name: 'Emma Toure',
              position: 'Caissière',
              avatar: '👩',
              ventes: '420K',
              heures: '160h'
            }
          ]
        }
      ],
      productivityStats: [
        { month: 'Avril 2025', value: '3.2M', label: 'Ventes' },
        { month: 'Mai 2025', value: '3.8M', label: 'Ventes' },
        { month: 'Juin 2025', value: '4.1M', label: 'Ventes' }
      ],
      globalStats: [
        { label: 'Ventes moyennes/mois', value: '4.05M FCFA' },
        { label: 'Taux de croissance', value: '+12.5%' },
        { label: 'Satisfaction client', value: '94%' }
      ]
    },
    {
      id: 'secondaire',
      name: '🥂 Cave Premium',
      location: 'Victoria Island, Lagos',
      bottles: 320,
      managersCount: 2,
      employeesCount: 8,
      productivity: 92,
      managers: [
        {
          name: 'Pierre Sow',
          role: 'Manager Premium',
          avatar: '👨‍💼',
          performance: {
            ventes: '3.2M',
            equipe: '8',
            satisfaction: '98%'
          },
          showEmployees: false,
          employees: [
            {
              name: 'Fatou Ndiaye',
              position: 'Sommelière',
              avatar: '👩',
              ventes: '650K',
              heures: '160h'
            },
            {
              name: 'Omar Ba',
              position: 'Caviste',
              avatar: '👨',
              ventes: '580K',
              heures: '158h'
            }
          ]
        }
      ],
      productivityStats: [
        { month: 'Avril 2025', value: '2.8M', label: 'Ventes' },
        { month: 'Mai 2025', value: '3.2M', label: 'Ventes' },
        { month: 'Juin 2025', value: '3.5M', label: 'Ventes' }
      ],
      globalStats: [
        { label: 'Ventes moyennes/mois', value: '3.17M FCFA' },
        { label: 'Taux de croissance', value: '+15.2%' },
        { label: 'Satisfaction client', value: '98%' }
      ]
    }
  ];

  // ===== MODALS =====
  isCaveModalOpen: boolean = false;
  isAddCaveModalOpen: boolean = false;
  isAddManagerModalOpen: boolean = false;
  isAddEmployeeModalOpen: boolean = false;
  isProfileModalOpen: boolean = false;
  selectedCave?: Cave;
  activeModalTab: string = 'managers';

  // ===== ACCORDS METS & VINS =====
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
      wine: 'Bordeaux Rouge',
      wineIcon: '🍷',
      description: 'Alliance parfaite avec les fromages à pâte dure',
      category: 'Fromages'
    },
    {
      id: 4,
      dish: 'Fruits de mer',
      dishIcon: '🦞',
      wine: 'Champagne Brut',
      wineIcon: '🥂',
      description: 'La fraîcheur du champagne rehausse les saveurs marines',
      category: 'Fruits de mer'
    }
  ];

  // ===== PROFIL UTILISATEUR =====
  userProfile: UserProfile = {
    firstName: 'Franck',
    lastName: 'KONGO',
    email: 'franck.kongo@caveviking.com',
    phone: '+234 801 234 5678',
    role: 'Administrateur',
    avatar: '👤',
    joinDate: '15 Janvier 2023'
  };

  // ===== FORMULAIRES =====
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

  // ===== SCAN =====
  scanResult: string = '';
  isScanActive: boolean = false;

  // ===== RECHERCHE =====
  searchTerm: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('✓ Dashboard Admin initialisé avec succès !');

    this.initializeRouterSubscription();
    this.updateActivePageFromRoute();
    this.startCarouselInterval();
    this.checkMobileView();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  // ===== GESTION DES ÉVÉNEMENTS =====
  @HostListener('window:resize')
  onResize(): void {
    this.checkMobileView();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.handleOutsideClick(event);
  }

  // ===== INITIALISATION =====
  private initializeRouterSubscription(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActivePageFromRoute();
        this.closeMobileSidebar();
      });
  }

  private checkMobileView(): void {
    if (window.innerWidth < 768) {
      this.isMobileSidebarOpen = false;
    }
  }

  private cleanupSubscriptions(): void {
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // ===== NAVIGATION =====
  private updateActivePageFromRoute(): void {
    const url = this.router.url;
    console.log('🔍 URL actuelle:', url);

    const validPages = [
      'caisse', 'profit', 'caves', 'managers', 'employees', 'drinks',
      'wine-pairing', 'scan', 'settings', 'home', 'client', 'fournisseur',
      'depenses', 'materiel', 'stock', 'entries', 'exits', 'faq',
      'improvements', 'contact', 'about', 'profile'
    ];

    let foundPage = 'home';
    for (const page of validPages) {
      if (url.includes(`/${page}`)) {
        foundPage = page;
        break;
      }
    }

    this.activePage = foundPage;
    console.log('📄 Page active:', this.activePage);
  }

  navigateTo(page: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('🚀 Navigation vers:', page);
    this.isUserDropdownOpen = false;

    const navigationPath = ['/admin', page];

    this.router.navigate(navigationPath)
      .then(success => {
        if (success) {
          console.log('✅ Navigation réussie vers:', page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          console.error('❌ Échec de la navigation vers:', page);
        }
      })
      .catch(error => {
        console.error('❌ Erreur de navigation:', error);
      });
  }

  isPageActive(page: string): boolean {
    return this.activePage === page;
  }

  // ===== GESTION DU SIDEBAR MOBILE =====
  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    if (window.innerWidth < 768) {
      this.isMobileSidebarOpen = false;
    }
  }

  // ===== GESTION DES DROPDOWNS =====
  toggleDrinksSubmenu(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isDrinksSubmenuOpen = !this.isDrinksSubmenuOpen;
  }

  toggleUserDropdown(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  private handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const userProfile = target.closest('.user-profile');
    if (!userProfile && this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }

    const drinksSubmenu = target.closest('.nav-item-with-submenu');
    if (!drinksSubmenu && this.isDrinksSubmenuOpen) {
      this.isDrinksSubmenuOpen = false;
    }
  }

  // ===== CAROUSEL =====
  private startCarouselInterval(): void {
    this.carouselSubscription = interval(this.carouselInterval).subscribe(() => {
      this.nextDrink();
    });
  }

  nextDrink(): void {
    this.currentDrinkIndex = (this.currentDrinkIndex + 1) % this.featuredDrinks.length;
  }

  previousDrink(): void {
    this.currentDrinkIndex =
      (this.currentDrinkIndex - 1 + this.featuredDrinks.length) % this.featuredDrinks.length;
  }

  goToDrink(index: number): void {
    this.currentDrinkIndex = index;
  }

  getCurrentDrink(): FeaturedDrink {
    return this.featuredDrinks[this.currentDrinkIndex];
  }

  isIndicatorActive(index: number): boolean {
    return index === this.currentDrinkIndex;
  }

  // ===== GESTION DES CAVES =====
  openCaveModal(cave: Cave, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.selectedCave = cave;
    this.isCaveModalOpen = true;
    this.activeModalTab = 'managers';
  }

  closeCaveModal(): void {
    this.isCaveModalOpen = false;
    this.selectedCave = undefined;
  }

  switchModalTab(tab: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.activeModalTab = tab;
  }

  toggleEmployees(manager: Manager, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    manager.showEmployees = !manager.showEmployees;
  }

  openAddCaveModal(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isAddCaveModalOpen = true;
  }

  closeAddCaveModal(): void {
    this.isAddCaveModalOpen = false;
    this.resetNewCaveForm();
  }

  addNewCave(): void {
    if (!this.newCaveForm.name || !this.newCaveForm.location) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newCave: Cave = {
      id: Date.now().toString(),
      name: `🍷 ${this.newCaveForm.name}`,
      location: this.newCaveForm.location,
      bottles: this.newCaveForm.capacity,
      managersCount: 0,
      employeesCount: 0,
      productivity: 0,
      managers: [],
      productivityStats: [],
      globalStats: []
    };

    this.caves.push(newCave);
    alert('✓ Nouvelle cave créée avec succès !');
    this.closeAddCaveModal();
  }

  private resetNewCaveForm(): void {
    this.newCaveForm = { name: '', location: '', capacity: 0, description: '' };
  }

  // ===== GESTION DES MANAGERS =====
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

  openAddManagerModal(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isAddManagerModalOpen = true;
  }

  closeAddManagerModal(): void {
    this.isAddManagerModalOpen = false;
    this.resetNewManagerForm();
  }

  addNewManager(): void {
    if (!this.newManagerForm.firstName ||
        !this.newManagerForm.lastName ||
        !this.newManagerForm.caveId) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    const cave = this.caves.find(c => c.id === this.newManagerForm.caveId);
    if (cave) {
      const newManager: Manager = {
        name: `${this.newManagerForm.firstName} ${this.newManagerForm.lastName}`,
        role: this.newManagerForm.role,
        avatar: '👨‍💼',
        performance: {
          ventes: '0',
          equipe: '0',
          satisfaction: '0%'
        },
        employees: [],
        showEmployees: false
      };

      cave.managers.push(newManager);
      cave.managersCount++;
      alert('✓ Nouveau manager ajouté avec succès !');
      this.closeAddManagerModal();
    }
  }

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

  // ===== GESTION DES EMPLOYÉS =====
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

  openAddEmployeeModal(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isAddEmployeeModalOpen = true;
  }

  closeAddEmployeeModal(): void {
    this.isAddEmployeeModalOpen = false;
    this.resetNewEmployeeForm();
  }

  addNewEmployee(): void {
    if (!this.newEmployeeForm.firstName ||
        !this.newEmployeeForm.lastName ||
        !this.newEmployeeForm.caveId ||
        !this.newEmployeeForm.managerId) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    const cave = this.caves.find(c => c.id === this.newEmployeeForm.caveId);
    if (cave) {
      const manager = cave.managers.find(m => m.name === this.newEmployeeForm.managerId);
      if (manager) {
        const newEmployee: Employee = {
          name: `${this.newEmployeeForm.firstName} ${this.newEmployeeForm.lastName}`,
          position: this.newEmployeeForm.position,
          avatar: '👨',
          ventes: '0',
          heures: '0h'
        };

        manager.employees.push(newEmployee);
        cave.employeesCount++;
        alert('✓ Nouvel employé ajouté avec succès !');
        this.closeAddEmployeeModal();
      }
    }
  }

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

  getManagersByCave(caveId: string): Manager[] {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.managers : [];
  }

  // ===== GESTION DU SCAN =====
  startScan(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.isScanActive = true;
    this.scanResult = '';

    setTimeout(() => {
      this.scanResult = JSON.stringify({
        name: 'Château Margaux 2015',
        category: 'Vin Rouge',
        price: 25000,
        stock: 45,
        barcode: '3245678901234',
        origin: 'France, Bordeaux',
        vintage: 2015
      }, null, 2);
      this.isScanActive = false;
    }, 2000);
  }

  resetScan(): void {
    this.scanResult = '';
    this.isScanActive = false;
  }

  // ===== GESTION DU PROFIL =====
  openProfileModal(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isProfileModalOpen = true;
    this.isUserDropdownOpen = false;
  }

  closeProfileModal(): void {
    this.isProfileModalOpen = false;
  }

  saveProfile(): void {
    if (!this.userProfile.firstName ||
        !this.userProfile.lastName ||
        !this.userProfile.email) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    alert('✓ Profil mis à jour avec succès !');
    this.closeProfileModal();
  }

  // ===== DÉCONNEXION =====
  logout(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      console.log('👋 Déconnexion...');
      this.router.navigate(['/auth']);
    }
  }

  // ===== UTILITAIRES =====
  formatNumber(value: number): string {
    return value.toLocaleString('fr-FR');
  }

  formatCurrency(value: number): string {
    return `${this.formatNumber(value)} FCFA`;
  }

  getActionTypeClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'success': 'action-success',
      'warning': 'action-warning',
      'info': 'action-info',
      'danger': 'action-danger'
    };
    return classMap[type] || 'action-default';
  }

  getBadgeClass(badge?: string): string {
    const classMap: { [key: string]: string } = {
      'hot': 'badge-hot',
      'new': 'badge-new'
    };
    return badge ? classMap[badge] : '';
  }

  getProductivityColor(productivity: number): string {
    if (productivity >= 80) return 'text-green-500';
    if (productivity >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }

  getProductivityBarColor(productivity: number): string {
    if (productivity >= 80) return 'bg-green-500';
    if (productivity >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // ===== RECHERCHE =====
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      console.log('🔍 Recherche vide');
      return;
    }

    console.log('🔍 Recherche:', this.searchTerm);
    // Implémentation de la recherche
    alert(`Recherche de: ${this.searchTerm}`);
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  // ===== STATISTIQUES =====
  getTotalRevenue(): number {
    return this.caves.reduce((total, cave) => {
      return total + cave.managers.reduce((managerTotal, manager) => {
        const sales = parseFloat(manager.performance.ventes.replace('M', '')) * 1000000;
        return managerTotal + sales;
      }, 0);
    }, 0);
  }

  getTotalBottles(): number {
    return this.caves.reduce((total, cave) => total + cave.bottles, 0);
  }

  getTotalManagers(): number {
    return this.caves.reduce((total, cave) => total + cave.managersCount, 0);
  }

  getTotalEmployees(): number {
    return this.caves.reduce((total, cave) => total + cave.employeesCount, 0);
  }

  getAverageProductivity(): number {
    if (this.caves.length === 0) return 0;
    const total = this.caves.reduce((sum, cave) => sum + cave.productivity, 0);
    return Math.round(total / this.caves.length);
  }

  // ===== GESTION DES ACCORDS METS & VINS =====
  getWinePairingsByCategory(category: string): WinePairing[] {
    return this.winePairings.filter(pairing => pairing.category === category);
  }

  getAllCategories(): string[] {
    const categories = this.winePairings.map(pairing => pairing.category);
    return [...new Set(categories)];
  }

  addWinePairing(pairing: Omit<WinePairing, 'id'>): void {
    const newPairing: WinePairing = {
      ...pairing,
      id: Date.now()
    };
    this.winePairings.push(newPairing);
    alert('✓ Accord mets & vins ajouté avec succès !');
  }

  removeWinePairing(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet accord ?')) {
      this.winePairings = this.winePairings.filter(pairing => pairing.id !== id);
      alert('✓ Accord supprimé avec succès !');
    }
  }

  // ===== GESTION DES PRODUITS =====
  getTopProducts(limit: number = 5): Product[] {
    return [...this.products]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit);
  }

  getTotalSales(): number {
    return this.products.reduce((total, product) => {
      return total + (product.sales * product.price);
    }, 0);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.category === category);
  }

  // ===== EXPORT DE DONNÉES =====
  exportCaveData(cave: Cave): void {
    const data = {
      cave: {
        name: cave.name,
        location: cave.location,
        bottles: cave.bottles,
        productivity: cave.productivity
      },
      managers: cave.managers.map(m => ({
        name: m.name,
        role: m.role,
        performance: m.performance,
        employeesCount: m.employees.length
      })),
      stats: cave.globalStats
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cave.name.replace(/[^a-z0-9]/gi, '_')}_export.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert('✓ Données exportées avec succès !');
  }

  exportAllData(): void {
    const data = {
      caves: this.caves,
      products: this.products,
      recentActions: this.recentActions,
      winePairings: this.winePairings,
      stats: {
        totalRevenue: this.getTotalRevenue(),
        totalBottles: this.getTotalBottles(),
        totalManagers: this.getTotalManagers(),
        totalEmployees: this.getTotalEmployees(),
        averageProductivity: this.getAverageProductivity()
      },
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `caveviking_export_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert('✓ Export complet réalisé avec succès !');
  }

  // ===== NOTIFICATIONS =====
  getUnreadNotificationsCount(): number {
    return 5; // À implémenter avec un vrai service
  }

  getUnreadMessagesCount(): number {
    return 3; // À implémenter avec un vrai service
  }

  // ===== VALIDATION =====
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }

  validateCaveForm(): boolean {
    if (!this.newCaveForm.name.trim()) {
      alert('⚠️ Le nom de la cave est requis');
      return false;
    }
    if (!this.newCaveForm.location.trim()) {
      alert('⚠️ L\'emplacement est requis');
      return false;
    }
    if (this.newCaveForm.capacity < 0) {
      alert('⚠️ La capacité doit être positive');
      return false;
    }
    return true;
  }

  validateManagerForm(): boolean {
    if (!this.newManagerForm.firstName.trim() || !this.newManagerForm.lastName.trim()) {
      alert('⚠️ Le nom complet est requis');
      return false;
    }
    if (this.newManagerForm.email && !this.isValidEmail(this.newManagerForm.email)) {
      alert('⚠️ Email invalide');
      return false;
    }
    if (this.newManagerForm.phone && !this.isValidPhone(this.newManagerForm.phone)) {
      alert('⚠️ Numéro de téléphone invalide');
      return false;
    }
    if (!this.newManagerForm.caveId) {
      alert('⚠️ Veuillez sélectionner une cave');
      return false;
    }
    return true;
  }

  validateEmployeeForm(): boolean {
    if (!this.newEmployeeForm.firstName.trim() || !this.newEmployeeForm.lastName.trim()) {
      alert('⚠️ Le nom complet est requis');
      return false;
    }
    if (this.newEmployeeForm.email && !this.isValidEmail(this.newEmployeeForm.email)) {
      alert('⚠️ Email invalide');
      return false;
    }
    if (this.newEmployeeForm.phone && !this.isValidPhone(this.newEmployeeForm.phone)) {
      alert('⚠️ Numéro de téléphone invalide');
      return false;
    }
    if (!this.newEmployeeForm.caveId) {
      alert('⚠️ Veuillez sélectionner une cave');
      return false;
    }
    if (!this.newEmployeeForm.managerId) {
      alert('⚠️ Veuillez sélectionner un manager');
      return false;
    }
    if (!this.newEmployeeForm.position.trim()) {
      alert('⚠️ Le poste est requis');
      return false;
    }
    return true;
  }

  // ===== DEBUG =====
  debugNavigation(): void {
    console.log('=== DEBUG NAVIGATION ===');
    console.log('URL actuelle:', this.router.url);
    console.log('Page active:', this.activePage);
    console.log('Routes disponibles:', this.router.config);
    console.log('Sidebar mobile:', this.isMobileSidebarOpen);
    console.log('User dropdown:', this.isUserDropdownOpen);
    console.log('Drinks submenu:', this.isDrinksSubmenuOpen);
    console.log('=======================');
  }

  debugCaves(): void {
    console.log('=== DEBUG CAVES ===');
    console.log('Nombre de caves:', this.caves.length);
    console.log('Total bouteilles:', this.getTotalBottles());
    console.log('Total managers:', this.getTotalManagers());
    console.log('Total employés:', this.getTotalEmployees());
    console.log('Productivité moyenne:', this.getAverageProductivity());
    console.log('==================');
  }

  debugStats(): void {
    console.log('=== DEBUG STATISTIQUES ===');
    console.log('Revenu total:', this.formatCurrency(this.getTotalRevenue()));
    console.log('Ventes totales:', this.formatCurrency(this.getTotalSales()));
    console.log('Top produits:', this.getTopProducts(3));
    console.log('=========================');
  }

  // ===== HELPERS POUR LE TEMPLATE =====
  trackByCaveId(index: number, cave: Cave): string {
    return cave.id;
  }

  trackByManagerName(index: number, manager: Manager): string {
    return manager.name;
  }

  trackByEmployeeName(index: number, employee: Employee): string {
    return employee.name;
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  trackByActionTime(index: number, action: RecentAction): string {
    return action.time;
  }

  trackByPairingId(index: number, pairing: WinePairing): number {
    return pairing.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
