// ==========================================
// FICHIER: src/app/server/server-layout/server-layout.component.ts
// DESCRIPTION: Layout principal pour l'interface Serveuse/Serveur (ACTUALISÉ)
// ==========================================

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';


// Interface pour les éléments du menu
interface MenuItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-waitress',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ThemeToggleComponent],
  templateUrl: './waitress-dashboard.component.html',
  styleUrls: ['./waitress-dashboard.component.scss']
})
export class WaitressComponent implements OnInit, OnDestroy {
  // États du composant
  sidebarCollapsed = false; // État de la sidebar (réduite ou non)
  currentTheme = 'dark'; // Thème actuel (light/dark/auto)
  currentUser: any; // Données de l'utilisateur connecté
  isPresent = false; // Statut de présence (en service ou non)
  isMobile = false; // Détection mobile

  // Subscription pour les changements de route
  private routerSubscription?: Subscription;

  // Menu de navigation avec toutes les pages
  menuItems: MenuItem[] = [
    {
      path: './home',
      label: 'Tableau de bord',
      icon: 'home'
    },
    {
      path: './table',
      label: 'Tables',
      icon: 'grid',
      badge: 0 // Nombre de tables actives
    },
    {
      path: './orders',
      label: 'Prendre Commande',
      icon: 'clipboard'
    },
    {
      path: './active-orders',
      label: 'Commandes Actives',
      icon: 'activity',
      badge: 0 // Nombre de commandes actives
    },
    {
      path: './billing',
      label: 'Facturation',
      icon: 'credit-card'
    },
    {
      path: './wine-suggestions',
      label: 'Suggestions Vins',
      icon: 'wine'
    },
    {
      path: './mysales',
      label: 'Mes Ventes',
      icon: 'trending-up'
    },
    {
      path: './schedule',
      label: 'Mon Planning',
      icon: 'calendar'
    },
    {
      path: './profile',
      label: 'Mon Profil',
      icon: 'user'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialisation au chargement du composant
    this.loadCurrentUser();
    this.loadTheme();
    this.checkPresenceStatus();
    this.loadActiveTables();
    this.loadActiveOrders();
    this.checkMobile();
    this.subscribeToRouteChanges();

    // Fermer la sidebar sur mobile après navigation
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  ngOnDestroy(): void {
    // Nettoyage des subscriptions
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Écouter les changements de taille d'écran
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkMobile();
  }

  // Vérifier si on est sur mobile
  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  // S'abonner aux changements de route pour fermer la sidebar sur mobile
  subscribeToRouteChanges(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.sidebarCollapsed = true;
        }
        // Mettre à jour les badges après chaque navigation
        this.updateBadges();
      });
  }

  // Charger les données de l'utilisateur connecté
  loadCurrentUser(): void {
    // TODO: Récupérer depuis AuthService
    this.currentUser = {
      id: 1,
      name: 'Marie Dubois',
      role: 'Serveuse',
      avatar: null
    };
  }

  // Charger le thème depuis le localStorage
  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
      this.applyTheme(savedTheme);
    }
  }

  // Basculer entre les thèmes (light/dark/auto)
  toggleTheme(): void {
    const themes = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];

    // Sauvegarder et appliquer le thème
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme(this.currentTheme);
  }

  // Appliquer le thème au document
  applyTheme(theme: string): void {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    body.classList.add(`theme-${theme}`);
  }

  // Basculer l'état de la sidebar (réduite/étendue)
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Basculer le statut de présence (en service/hors service)
  togglePresence(): void {
    this.isPresent = !this.isPresent;
    // TODO: Enregistrer le statut de présence dans le backend
    console.log('Présence:', this.isPresent ? 'En Service' : 'Hors Service');

    // TODO: Envoyer au serveur
    // this.presenceService.updatePresence(this.isPresent).subscribe();
  }

  // Vérifier le statut de présence initial
  checkPresenceStatus(): void {
    // TODO: Vérifier le statut de présence depuis le backend
    // this.presenceService.getPresence().subscribe(status => {
    //   this.isPresent = status;
    // });
    this.isPresent = false;
  }

  // Charger le nombre de tables actives
  loadActiveTables(): void {
    // TODO: Charger les tables actives depuis le backend
    // this.tableService.getActiveTables().subscribe(tables => {
    //   const activeTablesCount = tables.length;
    //   this.updateMenuBadge('/server/tables', activeTablesCount);
    // });

    // Données de test
    const activeTablesCount = 3;
    this.updateMenuBadge('./tables', activeTablesCount);
  }

  // Charger le nombre de commandes actives
  loadActiveOrders(): void {
    // TODO: Charger les commandes actives depuis le backend
    // this.orderService.getActiveOrders().subscribe(orders => {
    //   const activeOrdersCount = orders.length;
    //   this.updateMenuBadge('/server/active-orders', activeOrdersCount);
    // });

    // Données de test
    const activeOrdersCount = 5;
    this.updateMenuBadge('./active-orders', activeOrdersCount);
  }

  // Mettre à jour le badge d'un élément du menu
  updateMenuBadge(path: string, count: number): void {
    const menuItem = this.menuItems.find(item => item.path === path);
    if (menuItem) {
      menuItem.badge = count;
    }
  }

  // Mettre à jour tous les badges
  updateBadges(): void {
    this.loadActiveTables();
    this.loadActiveOrders();
  }

  // Vérifier si une route est active
  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    // TODO: Implémenter la déconnexion
    // this.authService.logout().subscribe(() => {
    //   this.router.navigate(['/login']);
    // });

    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      localStorage.removeItem('token');
      this.router.navigate(['../../features/auth/login']);
    }
  }

  // Obtenir l'icône du thème actuel
  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light': return 'sun';
      case 'dark': return 'moon';
      case 'auto': return 'monitor';
      default: return 'monitor';
    }
  }

  // Navigation vers une page spécifique
  navigateTo(path: string): void {
    this.router.navigate([path]);

    // Fermer la sidebar sur mobile après navigation
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  // Gérer le clic sur un élément du menu
  onMenuItemClick(item: MenuItem): void {
    this.navigateTo(item.path);
  }
}
