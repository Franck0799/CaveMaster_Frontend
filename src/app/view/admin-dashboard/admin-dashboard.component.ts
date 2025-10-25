// ===== FICHIER: admin-dashboard.component.ts =====
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ===== INTERFACES (gardez toutes vos interfaces existantes) =====
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

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  // Navigation
  activePage: string = 'home';
  isUserDropdownOpen: boolean = false;
  private routerSubscription?: Subscription;

  // Carousel
  featuredDrinks: FeaturedDrink[] = [
    { icon: '🍷', name: 'Château Margaux', category: 'VIN ROUGE', price: '25 000 FCFA', stock: 'Stock: 45 unités' },
    { icon: '🍺', name: 'Heineken Premium', category: 'BIÈRE', price: '1 500 FCFA', stock: 'Stock: 200 unités' },
    { icon: '🥃', name: 'Hennessy VSOP', category: 'LIQUEUR', price: '35 000 FCFA', stock: 'Stock: 30 unités' },
    { icon: '🥂', name: 'Dom Pérignon', category: 'CHAMPAGNE', price: '45 000 FCFA', stock: 'Stock: 12 unités' },
    { icon: '🥂', name: 'Moët & Chandon', category: 'CHAMPAGNE', price: '15 000 FCFA', stock: 'Stock: 15 unités' }
  ];

  currentDrinkIndex: number = 0;
  private carouselSubscription?: Subscription;

  // Données (gardez toutes vos données existantes)
  products: Product[] = [
    { id: 1, name: 'Château Margaux', category: 'Vin Rouge', icon: '🍷', sales: 156, price: 25000, badge: 'hot' },
    { id: 2, name: 'Heineken Premium', category: 'Bière', icon: '🍺', sales: 89, price: 1500, badge: 'new' },
    { id: 3, name: 'Hennessy VSOP', category: 'Liqueur', icon: '🥃', sales: 134, price: 35000 },
    { id: 4, name: 'Dom Pérignon', category: 'Champagne', icon: '🥂', sales: 201, price: 45000, badge: 'hot' },
    { id: 5, name: 'Red Bull Energy', category: 'Boisson Énergisante', icon: '⚡', sales: 312, price: 800 },
    { id: 6, name: 'Bissap Délice', category: 'Boisson Locale', icon: '🍹', sales: 67, price: 500, badge: 'new' }
  ];

  recentActions: RecentAction[] = [
    { icon: '📥', type: 'success', title: 'Nouvelle entrée de stock', details: '50 bouteilles de Château Margaux • Cave Principale • +1 250 000 FCFA', time: 'Il y a 2h' },
    { icon: '📤', type: 'warning', title: 'Sortie de stock importante', details: '30 bouteilles de Dom Pérignon • Cave Premium • -1 350 000 FCFA', time: 'Il y a 5h' },
    { icon: '👤', type: 'info', title: 'Nouvel employé ajouté', details: 'Marie Dubois • Caissière • Cave Secondaire', time: 'Hier' },
    { icon: '💰', type: 'success', title: 'Vente exceptionnelle', details: 'Commande de 100 bouteilles • Client VIP • +2 500 000 FCFA', time: 'Hier' },
    { icon: '🔧', type: 'info', title: 'Maintenance effectuée', details: 'Système de refroidissement • Cave Premium • Opération réussie', time: 'Il y a 2 jours' }
  ];

  // Caves (gardez toutes vos données de caves)
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
            { name: 'Claire Diop', position: 'Vendeuse', avatar: '👩', ventes: '520K', heures: '162h' }
          ]
        }
      ],
      productivityStats: [
        { month: 'Avril 2025', value: '3.2M', label: 'Ventes' },
        { month: 'Mai 2025', value: '3.8M', label: 'Ventes' }
      ],
      globalStats: [
        { label: 'Ventes moyennes/mois', value: '4.05M FCFA' },
        { label: 'Taux de croissance', value: '+12.5%' }
      ]
    }
    // ... ajoutez vos autres caves
  ];

  // Modals
  isCaveModalOpen: boolean = false;
  isAddCaveModalOpen: boolean = false;
  isAddManagerModalOpen: boolean = false;
  isAddEmployeeModalOpen: boolean = false;
  isProfileModalOpen: boolean = false;
  selectedCave?: Cave;
  activeModalTab: string = 'managers';
  isDrinksSubmenuOpen: boolean = false;

  // Accords mets & vins
  winePairings: WinePairing[] = [
    { id: 1, dish: 'Steak grillé', dishIcon: '🥩', wine: 'Château Margaux', wineIcon: '🍷', description: 'Un vin rouge corsé qui sublime la viande rouge', category: 'Viandes rouges' },
    { id: 2, dish: 'Poisson grillé', dishIcon: '🐟', wine: 'Chablis Blanc', wineIcon: '🍾', description: 'Un vin blanc sec parfait pour le poisson', category: 'Poissons' }
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
  newCaveForm = { name: '', location: '', capacity: 0, description: '' };
  newManagerForm = { firstName: '', lastName: '', email: '', phone: '', caveId: '', role: 'Manager' };
  newEmployeeForm = { firstName: '', lastName: '', email: '', phone: '', caveId: '', managerId: '', position: '' };

  // Scan
  scanResult: string = '';
  isScanActive: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('✓ Dashboard Admin initialisé avec succès !');

    // Détecte les changements de route
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActivePageFromRoute();
      });

    // Met à jour la page active au chargement initial
    this.updateActivePageFromRoute();

    this.startCarouselInterval();
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  /**
   * Met à jour activePage en fonction de l'URL actuelle
   */
  private updateActivePageFromRoute(): void {
    const urlSegments = this.router.url.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];

    // Gère les paramètres de query
    const page = lastSegment.split('?')[0];

    if (page && page !== 'admin') {
      this.activePage = page;
    } else {
      this.activePage = 'home';
    }
  }

  /**
   * Navigation avec Router
   */
  navigateTo(page: string): void {
    this.router.navigate(['/admin', page]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleDrinksSubmenu(): void {
    this.isDrinksSubmenuOpen = !this.isDrinksSubmenuOpen;
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  private handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userProfile = target.closest('.user-profile');
    if (!userProfile && this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }

  // ===== CAROUSEL =====
  private startCarouselInterval(): void {
    this.carouselSubscription = interval(5000).subscribe(() => {
      this.nextDrink();
    });
  }

  nextDrink(): void {
    this.currentDrinkIndex = (this.currentDrinkIndex + 1) % this.featuredDrinks.length;
  }

  previousDrink(): void {
    this.currentDrinkIndex = (this.currentDrinkIndex - 1 + this.featuredDrinks.length) % this.featuredDrinks.length;
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

  // ===== CAVES =====
  openCaveModal(cave: Cave): void {
    this.selectedCave = cave;
    this.isCaveModalOpen = true;
    this.activeModalTab = 'managers';
  }

  closeCaveModal(): void {
    this.isCaveModalOpen = false;
    this.selectedCave = undefined;
  }

  switchModalTab(tab: string): void {
    this.activeModalTab = tab;
  }

  toggleEmployees(manager: Manager): void {
    manager.showEmployees = !manager.showEmployees;
  }

  openAddCaveModal(): void {
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
    alert('✓ Nouvelle cave créée avec succès !');
    this.closeAddCaveModal();
  }

  private resetNewCaveForm(): void {
    this.newCaveForm = { name: '', location: '', capacity: 0, description: '' };
  }

  // ===== MANAGERS =====
  getAllManagers(): Manager[] {
    const allManagers: Manager[] = [];
    this.caves.forEach(cave => {
      cave.managers.forEach(manager => {
        allManagers.push({ ...manager, role: `${manager.role} - ${cave.name}` });
      });
    });
    return allManagers;
  }

  openAddManagerModal(): void {
    this.isAddManagerModalOpen = true;
  }

  closeAddManagerModal(): void {
    this.isAddManagerModalOpen = false;
    this.resetNewManagerForm();
  }

  addNewManager(): void {
    if (!this.newManagerForm.firstName || !this.newManagerForm.lastName || !this.newManagerForm.caveId) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }
    alert('✓ Nouveau manager ajouté avec succès !');
    this.closeAddManagerModal();
  }

  private resetNewManagerForm(): void {
    this.newManagerForm = { firstName: '', lastName: '', email: '', phone: '', caveId: '', role: 'Manager' };
  }

  // ===== EMPLOYÉS =====
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

  openAddEmployeeModal(): void {
    this.isAddEmployeeModalOpen = true;
  }

  closeAddEmployeeModal(): void {
    this.isAddEmployeeModalOpen = false;
    this.resetNewEmployeeForm();
  }

  addNewEmployee(): void {
    if (!this.newEmployeeForm.firstName || !this.newEmployeeForm.lastName || !this.newEmployeeForm.caveId) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }
    alert('✓ Nouvel employé ajouté avec succès !');
    this.closeAddEmployeeModal();
  }

  private resetNewEmployeeForm(): void {
    this.newEmployeeForm = { firstName: '', lastName: '', email: '', phone: '', caveId: '', managerId: '', position: '' };
  }

  getManagersByCave(caveId: string): Manager[] {
    const cave = this.caves.find(c => c.id === caveId);
    return cave ? cave.managers : [];
  }

  // ===== SCAN =====
  startScan(): void {
    this.isScanActive = true;
    this.scanResult = '';
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

  resetScan(): void {
    this.scanResult = '';
    this.isScanActive = false;
  }

  // ===== PROFIL =====
  openProfileModal(): void {
    this.isProfileModalOpen = true;
  }

  closeProfileModal(): void {
    this.isProfileModalOpen = false;
  }

  saveProfile(): void {
    alert('✓ Profil mis à jour avec succès !');
    this.closeProfileModal();
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      alert('👋 À bientôt !');
      this.router.navigate(['/auth']);
    }
  }

  // ===== UTILITAIRES =====
  formatNumber(value: number): string {
    return value.toLocaleString('fr-FR');
  }

  getActionTypeClass(type: string): string {
    return type;
  }
}
