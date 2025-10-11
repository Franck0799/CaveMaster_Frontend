import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

// ===== INTERFACES =====
// Ces interfaces définissent la structure des données
// TypeScript vérifie que les données respectent cette structure

interface Drink {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
  sales?: number;
  badge?: 'HOT' | 'NEW';
}

interface Manager {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

interface Cave {
  id: string;
  name: string;
  location: string;
  bottles: number;
  managers: number;
  employees: number;
  productivity: number;
  icon: string;
  managersList: Manager[];
  monthlyStats: MonthlyStats[];
}

interface MonthlyStats {
  month: string;
  sales: number;
  orders: number;
  avgProductivity: number;
}

interface Action {
  id: string;
  type: 'success' | 'warning' | 'info';
  icon: string;
  title: string;
  details: string;
  time: string;
}

interface StatCard {
  icon: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral' | 'warning';
  colorClass: string;
}

interface Category {
  value: string;
  label: string;
}

interface DrinkCategory {
  name: string;
  icon: string;
}

interface SocialLink {
  name: string;
  icon: string;
}

interface User {
  name: string;
  role: string;
}

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
  // ===== PROPRIÉTÉS D'ÉTAT =====
  // Ces propriétés contrôlent l'affichage de l'interface

  // Suit quelle page est actuellement affichée
  currentPage: 'home' | 'caves' = 'home';

  // Contrôle l'ouverture/fermeture du sous-menu des boissons
  submenuOpen: boolean = false;

  // Contrôle l'affichage du dropdown du profil utilisateur
  userDropdownOpen: boolean = false;

  // Contrôle l'affichage de la modal des détails de cave
  caveModalOpen: boolean = false;

  // Contrôle l'affichage de la modal d'ajout de cave
  addCaveModalOpen: boolean = false;

  // Onglet actif dans la modal de cave ('managers' ou 'productivity')
  currentTab: 'managers' | 'productivity' = 'managers';

  // Index de la boisson actuellement affichée dans le carousel
  currentDrinkIndex: number = 0;

  // Cave sélectionnée pour affichage dans la modal
  selectedCave: Cave | null = null;

  // ===== PROPRIÉTÉS DE RECHERCHE ET FILTRES =====
  searchQuery: string = '';
  selectedCategory: string = '';
  cartCount: number = 3;
  notificationCount: number = 5;

  // ===== DONNÉES =====
  // Ces propriétés contiennent toutes les données affichées

  // Utilisateur actuellement connecté
  currentUser: User = {
    name: 'Admin Principal',
    role: 'Administrateur'
  };

  // Catégories de boissons pour le sous-menu
  drinkCategories: DrinkCategory[] = [
    { name: 'Vins', icon: '🍷' },
    { name: 'Champagnes', icon: '🥂' },
    { name: 'Spiritueux', icon: '🥃' },
    { name: 'Bières', icon: '🍺' },
    { name: 'Softs', icon: '🥤' }
  ];

  // Liens des réseaux sociaux
  socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: '📘' },
    { name: 'Instagram', icon: '📸' },
    { name: 'Twitter', icon: '🐦' },
    { name: 'LinkedIn', icon: '💼' }
  ];

  // Catégories pour le sélecteur du header
  categories: Category[] = [
    { value: 'wines', label: 'Vins' },
    { value: 'champagnes', label: 'Champagnes' },
    { value: 'spirits', label: 'Spiritueux' },
    { value: 'beers', label: 'Bières' }
  ];

  // Liste des boissons pour le carousel
  featuredDrinks: Drink[] = [
    { id: '1', name: 'Moët & Chandon', category: 'CHAMPAGNE', price: 15000, stock: 15, icon: '🥂' },
    { id: '2', name: 'Château Margaux', category: 'VIN ROUGE', price: 25000, stock: 20, icon: '🍷' },
    { id: '3', name: 'Dom Pérignon', category: 'CHAMPAGNE', price: 45000, stock: 8, icon: '🥂' },
    { id: '4', name: 'Hennessy VSOP', category: 'LIQUEUR', price: 35000, stock: 12, icon: '🥃' },
    { id: '5', name: 'Heineken Premium', category: 'BIÈRE', price: 1500, stock: 150, icon: '🍺' }
  ];

  // Produits populaires affichés sur la page d'accueil
  popularProducts: Drink[] = [
    { id: '1', name: 'Château Margaux', category: 'Vin Rouge', price: 25000, stock: 20, icon: '🍷', sales: 156, badge: 'HOT' },
    { id: '2', name: 'Heineken Premium', category: 'Bière', price: 1500, stock: 150, icon: '🍺', sales: 89, badge: 'NEW' },
    { id: '3', name: 'Hennessy VSOP', category: 'Liqueur', price: 35000, stock: 12, icon: '🥃', sales: 134 },
    { id: '4', name: 'Dom Pérignon', category: 'Champagne', price: 45000, stock: 8, icon: '🥂', sales: 201, badge: 'HOT' },
    { id: '5', name: 'Red Bull Energy', category: 'Boisson Énergisante', price: 800, stock: 300, icon: '⚡', sales: 312 },
    { id: '6', name: 'Bissap Délice', category: 'Boisson Locale', price: 500, stock: 100, icon: '🍹', sales: 67, badge: 'NEW' }
  ];

  // Cartes de statistiques affichées sur le dashboard
  statsCards: StatCard[] = [
    { icon: '🔥', label: 'Ventes du jour', value: '1 250 000 FCFA', change: '+18,5% ce mois', changeType: 'positive', colorClass: 'stat-card-orange' },
    { icon: '🛒', label: 'Commandes Aujourd\'hui', value: '45', change: '+8 depuis hier', changeType: 'positive', colorClass: 'stat-card-green' },
    { icon: '🍷', label: 'Stock de Vin', value: '350', change: 'Stable', changeType: 'neutral', colorClass: 'stat-card-purple' },
    { icon: '⚠️', label: 'Stock Faible', value: '12', change: 'Attention requise', changeType: 'warning', colorClass: 'stat-card-warning' },
    { icon: '👥', label: 'Clients Actifs', value: '892', change: '+35 ce mois', changeType: 'positive', colorClass: 'stat-card-blue' },
    { icon: '🍾', label: 'Commandes en Attente', value: '8', change: 'À traiter', changeType: 'neutral', colorClass: 'stat-card-yellow' }
  ];

  // Actions récentes affichées sur le dashboard
  recentActions: Action[] = [
    { id: '1', type: 'success', icon: '📥', title: 'Nouvelle entrée de stock', details: '50 bouteilles de Château Margaux • Cave Principale • +1 250 000 FCFA', time: 'Il y a 2h' },
    { id: '2', type: 'warning', icon: '📤', title: 'Sortie de stock importante', details: '30 bouteilles de Dom Pérignon • Cave Premium • -1 350 000 FCFA', time: 'Il y a 5h' },
    { id: '3', type: 'info', icon: '👤', title: 'Nouvel employé ajouté', details: 'Marie Dubois • Caissière • Cave Secondaire', time: 'Hier' },
    { id: '4', type: 'success', icon: '💰', title: 'Vente exceptionnelle', details: 'Commande de 100 bouteilles • Client VIP • +2 500 000 FCFA', time: 'Hier' },
    { id: '5', type: 'info', icon: '🔧', title: 'Maintenance effectuée', details: 'Système de refroidissement • Cave Premium • Opération réussie', time: 'Il y a 2 jours' }
  ];

  // Liste des caves
  caves: Cave[] = [
    {
      id: 'principale',
      name: '🍷 Cave Principale',
      location: '📍 Lekki Phase 1, Lagos',
      bottles: 450,
      managers: 3,
      employees: 12,
      productivity: 87,
      icon: '🍷',
      managersList: [
        { id: '1', name: 'Jean Dupont', role: 'Manager Principal', email: 'jean.dupont@drinkstore.com', phone: '+225 07 12 34 56 78', avatar: '👨‍💼' },
        { id: '2', name: 'Sophie Martin', role: 'Manager Adjoint', email: 'sophie.martin@drinkstore.com', phone: '+225 07 23 45 67 89', avatar: '👩‍💼' },
        { id: '3', name: 'Pierre Kouassi', role: 'Manager Stock', email: 'pierre.kouassi@drinkstore.com', phone: '+225 07 34 56 78 90', avatar: '👨‍💼' }
      ],
      monthlyStats: [
        { month: 'Janvier', sales: 1250000, orders: 45, avgProductivity: 85 },
        { month: 'Février', sales: 1380000, orders: 52, avgProductivity: 87 },
        { month: 'Mars', sales: 1420000, orders: 48, avgProductivity: 89 }
      ]
    },
    {
      id: 'secondaire',
      name: '🥂 Cave Secondaire',
      location: '📍 Victoria Island, Lagos',
      bottles: 320,
      managers: 2,
      employees: 8,
      productivity: 92,
      icon: '🥂',
      managersList: [
        { id: '4', name: 'Marie Touré', role: 'Manager Principal', email: 'marie.toure@drinkstore.com', phone: '+225 07 45 67 89 01', avatar: '👩‍💼' },
        { id: '5', name: 'Amadou Diallo', role: 'Manager Adjoint', email: 'amadou.diallo@drinkstore.com', phone: '+225 07 56 78 90 12', avatar: '👨‍💼' }
      ],
      monthlyStats: [
        { month: 'Janvier', sales: 980000, orders: 38, avgProductivity: 90 },
        { month: 'Février', sales: 1050000, orders: 42, avgProductivity: 92 },
        { month: 'Mars', sales: 1120000, orders: 45, avgProductivity: 94 }
      ]
    },
    {
      id: 'premium',
      name: '✨ Cave Premium',
      location: '📍 Ikoyi, Lagos',
      bottles: 180,
      managers: 1,
      employees: 5,
      productivity: 95,
      icon: '✨',
      managersList: [
        { id: '6', name: 'Fatou Ndiaye', role: 'Manager Premium', email: 'fatou.ndiaye@drinkstore.com', phone: '+225 07 67 89 01 23', avatar: '👩‍💼' }
      ],
      monthlyStats: [
        { month: 'Janvier', sales: 2100000, orders: 28, avgProductivity: 93 },
        { month: 'Février', sales: 2250000, orders: 32, avgProductivity: 95 },
        { month: 'Mars', sales: 2400000, orders: 35, avgProductivity: 97 }
      ]
    }
  ];

  // Formulaire réactif pour l'ajout de cave
  // FormBuilder crée et gère les formulaires avec validation
  addCaveForm: FormGroup;

  // Interval pour le carousel automatique
  private carouselInterval: any;

  // ===== CONSTRUCTEUR =====
  // Le constructeur est appelé en premier quand le composant est créé
  // On injecte FormBuilder pour créer des formulaires
  constructor(private fb: FormBuilder) {
    // Création du formulaire avec validation
    // Validators.required signifie que le champ est obligatoire
    this.addCaveForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      capacity: ['', Validators.required],
      description: ['']
    });
  }

  // ===== LIFECYCLE HOOKS =====
  // ngOnInit s'exécute une fois que le composant est initialisé
  // C'est l'équivalent de window.onload en JavaScript vanilla
  ngOnInit(): void {
    // Démarre la rotation automatique du carousel toutes les 5 secondes
    this.carouselInterval = setInterval(() => {
      this.nextDrink();
    }, 5000);
  }

  // ngOnDestroy s'exécute juste avant que le composant soit détruit
  // Important pour nettoyer les intervals et éviter les fuites mémoire
  ngOnDestroy(): void {
    // Arrête la rotation automatique du carousel
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  // ===== MÉTHODES DE NAVIGATION =====

  // Change la page affichée (Accueil ou Mes caves)
  navigateTo(page: 'home' | 'caves'): void {
    this.currentPage = page;
    // Ferme le dropdown utilisateur si ouvert
    this.userDropdownOpen = false;
  }

  // Ouvre/ferme le sous-menu des catégories de boissons
  // $event.stopPropagation() empêche l'événement de remonter aux parents
  toggleSubmenu(event: Event): void {
    event.stopPropagation();
    this.submenuOpen = !this.submenuOpen;
  }

  // Ouvre/ferme le menu déroulant du profil utilisateur
  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  // ===== MÉTHODES DU CAROUSEL =====

  // Getter qui retourne la boisson actuellement affichée
  // Un getter est comme une propriété calculée qui se met à jour automatiquement
  get currentDrink(): Drink | null {
    return this.featuredDrinks[this.currentDrinkIndex] || null;
  }

  // Passe à la boisson suivante dans le carousel
  nextDrink(): void {
    // Utilise le modulo (%) pour revenir au début après la dernière boisson
    // Exemple: si currentDrinkIndex = 4 et length = 5, alors (4 + 1) % 5 = 0
    this.currentDrinkIndex = (this.currentDrinkIndex + 1) % this.featuredDrinks.length;
  }

  // Passe à la boisson précédente dans le carousel
  previousDrink(): void {
    // Si on est à 0, on va à la dernière boisson grâce au + length
    this.currentDrinkIndex = (this.currentDrinkIndex - 1 + this.featuredDrinks.length) % this.featuredDrinks.length;
  }

  // Va directement à une boisson spécifique (clic sur un indicateur)
  goToDrink(index: number): void {
    this.currentDrinkIndex = index;
  }

  // ===== MÉTHODES DE RECHERCHE ET FILTRES =====

  onSearch(): void {
    console.log('Recherche:', this.searchQuery);
    // Ici vous ajouteriez la logique de recherche
  }

  onCategoryChange(): void {
    console.log('Catégorie sélectionnée:', this.selectedCategory);
    // Ici vous ajouteriez la logique de filtrage
  }

  // ===== MÉTHODES DU HEADER =====

  openCart(): void {
    console.log('Ouverture du panier');
    // Ici vous ajouteriez la navigation vers le panier
  }

  openNotifications(): void {
    console.log('Ouverture des notifications');
    // Ici vous ajouteriez l'affichage des notifications
  }

  goToProfile(): void {
    console.log('Navigation vers le profil');
    this.userDropdownOpen = false;
  }

  goToSettings(): void {
    console.log('Navigation vers les paramètres');
    this.userDropdownOpen = false;
  }

  openSupport(): void {
    console.log('Ouverture de l\'assistance');
    this.userDropdownOpen = false;
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      console.log('Déconnexion');
      // Ici vous ajouteriez la logique de déconnexion
    }
    this.userDropdownOpen = false;
  }

  // ===== MÉTHODES DES PRODUITS =====

  viewDrinkDetails(drink: Drink): void {
    console.log('Affichage des détails de:', drink.name);
    // Ici vous ajouteriez la navigation vers la page de détails
  }

  viewProductDetails(product: Drink): void {
    console.log('Affichage du produit:', product.name);
    // Ici vous ajouteriez la navigation vers la page de détails du produit
  }

  // ===== MÉTHODES DES CAVES =====

  // Ouvre la modal avec les détails d'une cave
  openCaveModal(cave: Cave): void {
    this.selectedCave = cave;
    this.caveModalOpen = true;
    // Réinitialise l'onglet à "managers" à chaque ouverture
    this.currentTab = 'managers';
  }

  // Ferme la modal des détails de cave
  closeCaveModal(): void {
    this.caveModalOpen = false;
    this.selectedCave = null;
  }

  // Change d'onglet dans la modal de cave
  switchTab(tab: 'managers' | 'productivity'): void {
    this.currentTab = tab;
  }

  // Affiche les statistiques d'une cave
  viewCaveStats(cave: Cave): void {
    this.openCaveModal(cave);
    this.switchTab('productivity');
  }

  // ===== MÉTHODES POUR LES STATISTIQUES =====

  // Calcule la moyenne des ventes pour une cave
  getAverageSales(cave: Cave): number {
    const total = cave.monthlyStats.reduce((sum, stat) => sum + stat.sales, 0);
    return total / cave.monthlyStats.length;
  }

  // Calcule la moyenne des commandes pour une cave
  getAverageOrders(cave: Cave): number {
    const total = cave.monthlyStats.reduce((sum, stat) => sum + stat.orders, 0);
    return Math.round(total / cave.monthlyStats.length);
  }

  // Calcule la moyenne de productivité pour une cave
  getAverageProductivity(cave: Cave): number {
    const total = cave.monthlyStats.reduce((sum, stat) => sum + stat.avgProductivity, 0);
    return Math.round((total / cave.monthlyStats.length) * 10) / 10;
  }

  // ===== MÉTHODES POUR L'AJOUT DE CAVE =====

  // Ouvre la modal d'ajout de nouvelle cave
  openAddCaveModal(): void {
    this.addCaveModalOpen = true;
  }

  // Ferme la modal d'ajout et réinitialise le formulaire
  closeAddCaveModal(): void {
    this.addCaveModalOpen = false;
    this.addCaveForm.reset();
  }

  // Traite la soumission du formulaire d'ajout de cave
  onAddCave(): void {
    // Vérifie si le formulaire est valide
    if (this.addCaveForm.invalid) {
      // Marque tous les champs comme "touched" pour afficher les erreurs
      Object.keys(this.addCaveForm.controls).forEach(key => {
        this.addCaveForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Récupère les valeurs du formulaire
    const formValue = this.addCaveForm.value;
    console.log('Nouvelle cave:', formValue);

    // Ici vous ajouteriez la logique pour créer la cave dans la base de données
    alert('Nouvelle cave créée avec succès!');
    this.closeAddCaveModal();
  }
}
