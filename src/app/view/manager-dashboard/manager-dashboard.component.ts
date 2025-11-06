// ===== FICHIER: manager-dashboard.component.ts (CORRIGÉ) =====
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

interface UserProfile {
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
  caveAssigned: string;
  isPresent: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'present' | 'absent' | 'leave' | 'off';
  avatar: string;
  checkInTime?: string;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ThemeToggleComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit, OnDestroy {

  // Propriété qui stocke la page actuellement active dans le dashboard
  activePage: string = 'home';

  // Gestion du sidebar mobile
  isMobileSidebarOpen = false;

  // Gestion des dropdowns
  isUserDropdownOpen = false;
  activeSubmenu: string | null = null;
  submenuTimeout: any = null;

  // ⭐ AJOUT: Subscription pour écouter les changements de route
  private routerSubscription?: Subscription;

  // Profil utilisateur
  userProfile: UserProfile = {
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'Manager',
    avatar: '👨‍💼',
    caveAssigned: 'Cave Bordeaux',
    isPresent: false
  };

  // Équipe du manager
  teamMembers: TeamMember[] = [
    { id: '1', name: 'Marie Martin', role: 'Serveuse', status: 'present', avatar: '👩', checkInTime: '09:00' },
    { id: '2', name: 'Pierre Dubois', role: 'Serveur', status: 'present', avatar: '👨', checkInTime: '09:15' },
    { id: '3', name: 'Sophie Laurent', role: 'Serveuse', status: 'leave', avatar: '👩' },
    { id: '4', name: 'Thomas Bernard', role: 'Serveur', status: 'off', avatar: '👨' }
  ];

  // Recherche
  searchTerm = '';

  // Notifications
  unreadMessages = 3;
  unreadNotifications = 5;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('✓ Dashboard Manager initialisé avec succès !');

    // ⭐ CORRECTION 1: Charger la présence
    this.loadUserPresence();

    // ⭐ CORRECTION 2: Initialiser l'écoute des routes
    this.initializeRouterSubscription();

    // ⭐ CORRECTION 3: Mettre à jour la page active dès le départ
    this.updateActivePageFromRoute();

    // ⭐ CORRECTION 4: Vérifier si on est sur mobile
    this.checkMobileView();
  }

  // ⭐ AJOUT: Méthode ngOnDestroy pour nettoyer les subscriptions
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.submenuTimeout) {
      clearTimeout(this.submenuTimeout);
    }
  }

  // ⭐ AJOUT: Initialise l'écoute des changements de route
  private initializeRouterSubscription(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActivePageFromRoute();
        this.closeMobileSidebar();
      });
  }

  // ⭐ AJOUT: Vérifie la taille de l'écran
  private checkMobileView(): void {
    if (window.innerWidth < 768) {
      this.isMobileSidebarOpen = false;
      this.activeSubmenu = null;
    }
  }

  // ===== GESTION DE LA PRÉSENCE =====
  togglePresence(): void {
    this.userProfile.isPresent = !this.userProfile.isPresent;
    const status = this.userProfile.isPresent ? 'présent' : 'absent';
    console.log(`Statut changé: ${status}`);
    this.saveUserPresence();
  }

  loadUserPresence(): void {
    const savedPresence = localStorage.getItem('manager_presence');
    if (savedPresence) {
      this.userProfile.isPresent = savedPresence === 'true';
    }
  }

  saveUserPresence(): void {
    localStorage.setItem('manager_presence', this.userProfile.isPresent.toString());
  }

  getPresenceCount(status: string): number {
    return this.teamMembers.filter(m => m.status === status).length;
  }

  // ===== GESTION DU SIDEBAR MOBILE =====
  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    if (window.innerWidth < 768) {
      this.isMobileSidebarOpen = false;
    }
    this.activeSubmenu = null;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth > 768) {
      this.isMobileSidebarOpen = false;
    }
  }

  // ===== GESTION DES SOUS-MENUS AU SURVOL =====
  onSectionMouseEnter(section: string): void {
    if (this.submenuTimeout) {
      clearTimeout(this.submenuTimeout);
    }
    this.submenuTimeout = setTimeout(() => {
      this.activeSubmenu = section;
      console.log('📂 Sous-menu ouvert:', section);
    }, 200);
  }

  onSectionMouseLeave(): void {
    if (this.submenuTimeout) {
      clearTimeout(this.submenuTimeout);
    }
    this.submenuTimeout = setTimeout(() => {
      this.activeSubmenu = null;
      console.log('📂 Sous-menu fermé');
    }, 300);
  }

  onSubmenuMouseEnter(): void {
    if (this.submenuTimeout) {
      clearTimeout(this.submenuTimeout);
    }
  }

  onSubmenuMouseLeave(): void {
    this.submenuTimeout = setTimeout(() => {
      this.activeSubmenu = null;
      console.log('📂 Sous-menu fermé (sortie du submenu)');
    }, 300);
  }

  isSubmenuOpen(section: string): boolean {
    return this.activeSubmenu === section;
  }

  // ===== GESTION DU DROPDOWN UTILISATEUR =====
  toggleUserDropdown(event: Event): void {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.isUserDropdownOpen = false;
  }

  // ===== RECHERCHE =====
  onSearch(): void {
    if (this.searchTerm.trim()) {
      console.log('Recherche:', this.searchTerm);
      // TODO: Implémenter la recherche
    }
  }

  // ===== NOTIFICATIONS =====
  getUnreadMessagesCount(): number {
    return this.unreadMessages;
  }

  getUnreadNotificationsCount(): number {
    return this.unreadNotifications;
  }

  // ===== NAVIGATION =====

  /**
   * ⭐ CORRECTION: Met à jour la propriété activePage en fonction de l'URL actuelle
   */
  private updateActivePageFromRoute(): void {
    const url = this.router.url;
    console.log('🔍 URL actuelle:', url);

    // ⭐ CORRECTION: Liste des pages valides avec les bons noms de routes
    const validPages = [
      'home', 'my-cave', 'team', 'presence', 'schedule', 'performance',
      'orders', 'sales', 'stock-requests', 'inventory',
      'daily-report', 'cash-register', 'incidents', 'customers',
      'messages', 'notifications', 'profile', 'settings', 'faq', 'contact'
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

  /**
   * ⭐ AJOUT: Navigation vers une page
   */
  navigateTo(page: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('🚀 Navigation vers:', page);
    this.isUserDropdownOpen = false;

    const navigationPath = ['/manager', page];

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

  /**
   * ⭐ AJOUT: Vérifie si une page est active
   */
  isPageActive(page: string): boolean {
    return this.activePage === page;
  }

  // ===== DÉCONNEXION =====
  logout(event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.userProfile.isPresent = false;
      this.saveUserPresence();
      this.router.navigate(['/login']);
    }
  }

  // ===== UTILITAIRES =====

  /**
   * ⭐ AJOUT: Formater les nombres
   */
  formatNumber(value: number): string {
    return value.toLocaleString('fr-FR');
  }

  /**
   * ⭐ AJOUT: Formater les montants
   */
  formatCurrency(value: number): string {
    return `${this.formatNumber(value)} €`;
  }
}
