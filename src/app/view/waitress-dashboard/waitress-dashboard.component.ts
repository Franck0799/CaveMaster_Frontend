// ==========================================
// FICHIER CORRIGÉ ET OPTIMISÉ
// ==========================================

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth/auth.service';

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
  // ✅ États du composant
  sidebarCollapsed = false;
  currentTheme = 'dark';
  currentUser: any = null;
  isPresent = false;
  isMobile = false;

  private routerSubscription?: Subscription;
  private themeSubscription?: Subscription;

  // ✅ Menu de navigation COMPLET avec icônes correctes
  menuItems: MenuItem[] = [
    { path: './home', label: 'Tableau de bord', icon: 'layout-dashboard', badge: 0 },
    { path: './table', label: 'Tables', icon: 'grid', badge: 0 },
    { path: './orders', label: 'Prendre Commande', icon: 'clipboard', badge: 0 },
    { path: './active-orders', label: 'Commandes Actives', icon: 'activity', badge: 0 },
    { path: './billing', label: 'Facturation', icon: 'credit-card', badge: 0 },
    { path: './wine-suggestions', label: 'Suggestions Vins', icon: 'wine', badge: 0 },
    { path: './mysales', label: 'Mes Ventes', icon: 'trending-up', badge: 0 },
    { path: './schedule', label: 'Mon Planning', icon: 'calendar', badge: 0 },
    { path: './profile', label: 'Mon Profil', icon: 'user', badge: 0 }
  ];

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  // ✅ Initialisation complète
  private initializeComponent(): void {
    this.loadCurrentUser();
    this.subscribeToTheme();
    this.checkPresenceStatus();
    this.loadActiveTables();
    this.loadActiveOrders();
    this.checkMobile();
    this.subscribeToRouteChanges();

    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  // ✅ Gestion du redimensionnement
  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  // ✅ Vérification mobile
  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  // ✅ Abonnement aux changements de route
  private subscribeToRouteChanges(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.sidebarCollapsed = true;
        }
        this.updateBadges();
      });
  }

  // ✅ Charger l'utilisateur connecté
  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          role: user.roles,
          avatar: user.avatar || null
        };
      }
    });
  }

  // ✅ S'abonner au service de thème
  private subscribeToTheme(): void {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  // ✅ Basculer le thème
  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.notificationService.info(`Thème changé : ${this.getThemeLabel()}`);
  }

  // ✅ Obtenir le label du thème
  private getThemeLabel(): string {
    const labels: Record<string, string> = {
      'light': 'Clair',
      'dark': 'Sombre',
      'auto': 'Automatique'
    };
    return labels[this.currentTheme] || 'Inconnu';
  }

  // ✅ Basculer la sidebar
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // ✅ Basculer le statut de présence
  togglePresence(): void {
    this.isPresent = !this.isPresent;

    const message = this.isPresent
      ? '✅ Vous êtes maintenant en service'
      : '⏸️ Vous êtes hors service';

    this.notificationService.success(message);

    // TODO: Enregistrer dans le backend
    console.log('Présence:', this.isPresent ? 'En Service' : 'Hors Service');
  }

  // ✅ Vérifier le statut de présence
  private checkPresenceStatus(): void {
    // TODO: Charger depuis le backend
    this.isPresent = false;
  }

  // ✅ Charger les tables actives
  private loadActiveTables(): void {
    // TODO: Implémenter avec le service réel
    const activeTablesCount = 3;
    this.updateMenuBadge('./table', activeTablesCount);
  }

  // ✅ Charger les commandes actives
  private loadActiveOrders(): void {
    // TODO: Implémenter avec le service réel
    const activeOrdersCount = 5;
    this.updateMenuBadge('./active-orders', activeOrdersCount);
  }

  // ✅ Mettre à jour le badge d'un menu
  private updateMenuBadge(path: string, count: number): void {
    const menuItem = this.menuItems.find(item => item.path === path);
    if (menuItem) {
      menuItem.badge = count;
    }
  }

  // ✅ Mettre à jour tous les badges
  private updateBadges(): void {
    this.loadActiveTables();
    this.loadActiveOrders();
  }

  // ✅ Vérifier si une route est active
  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  // ✅ Déconnexion
  logout(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
      this.notificationService.info('Vous avez été déconnecté');
      this.router.navigate(['/auth/login']);
    }
  }

  // ✅ Obtenir l'icône du thème
  getThemeIcon(): string {
    const icons: Record<string, string> = {
      'light': 'sun',
      'dark': 'moon',
      'auto': 'monitor'
    };
    return icons[this.currentTheme] || 'monitor';
  }

  // ✅ Navigation
  navigateTo(path: string): void {
    this.router.navigate([path]);

    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  // ✅ Gestion du clic sur un élément du menu
  onMenuItemClick(item: MenuItem): void {
    this.navigateTo(item.path);
  }

  // ✅ Nettoyage des subscriptions
  private cleanupSubscriptions(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
