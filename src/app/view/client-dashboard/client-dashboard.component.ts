// ==========================================
// FICHIER: src/app/client/client-layout/client-layout.component.ts
// DESCRIPTION: Layout principal avec sidebar - ACTUALISÉ standalone
// ==========================================

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

// Interface pour un item du menu
interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

// Interface pour une section du menu
interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {

  // État de la sidebar (ouverte/fermée sur mobile)
  sidebarOpen = false;

  // Badge pour les notifications (nombre de notifications non lues)
  notificationCount = 3;

  // Sections du menu avec leurs items
  menuSections: MenuSection[] = [
    {
      title: '',
      items: [
        { label: 'Tableau de bord', icon: '📊', route: '/client/home' }
      ]
    },
    {
      title: '',
      items: [
        { label: 'Mes commandes', icon: '🛒', route: '/client/orders', badge: 1 },
        { label: 'Catalogue', icon: '🍷', route: '/client/catalogue' },
        { label: 'Favoris', icon: '❤️', route: '/client/favorites' }
      ]
    },
    {
      title: 'MON COMPTE',
      items: [
        { label: 'Fidélité', icon: '🎁', route: '/client/loyalty' },
        { label: 'Paiements', icon: '💳', route: '/client/payments' },
        { label: 'Adresses', icon: '📍', route: '/client/addresses' },
        { label: 'Notifications', icon: '🔔', route: '/client/notifications', badge: this.notificationCount }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { label: 'Chat Support', icon: '💬', route: '/client/support' },
        { label: 'FAQ', icon: '❓', route: '/client/faq' },
        { label: 'Paramètres', icon: '⚙️', route: '/client/settings' },
        { label: 'Déconnexion', icon: '🚪', route: '/logout' }
      ]
    }
  ];

  // Informations de l'utilisateur connecté
  user = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    avatar: '👤'
  };

  // Injection du Router pour la navigation
  constructor(private router: Router) {}

  ngOnInit(): void {
    // S'abonner aux événements de navigation pour fermer la sidebar automatiquement
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Fermer la sidebar après navigation sur mobile
        this.closeSidebar();
      });
  }

  // Toggle (ouvrir/fermer) la sidebar
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Fermer la sidebar (seulement sur mobile)
  closeSidebar(): void {
    // Vérifier si on est sur mobile (largeur < 1024px)
    if (window.innerWidth < 1024) {
      this.sidebarOpen = false;
    }
  }

  // Vérifier si une route est active
  isActive(route: string): boolean {
    // Retourner true si l'URL actuelle correspond à la route
    return this.router.url === route;
  }

  // Navigation vers une route
  navigate(route: string): void {
    // Gérer la déconnexion
    if (route === '/logout') {
      // Logique de déconnexion
      console.log('Déconnexion en cours...');

      // TODO: Appeler le service d'authentification
      // this.authService.logout();

      // Rediriger vers la page de login
      this.router.navigate(['/login']);
    } else {
      // Navigation normale vers la route demandée
      this.router.navigate([route]);

      // Fermer la sidebar sur mobile après navigation
      this.closeSidebar();
    }
  }
}
