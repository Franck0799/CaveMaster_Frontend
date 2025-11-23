import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component'; // ✅ Ajout

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: Observable<number>; // ✅ Observable pour les badges dynamiques
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ThemeToggleComponent // ✅ Ajout
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  sidebarOpen = false;
  cartCount$!: Observable<number>; // ✅ Ajout
  notificationCount = 3;

  menuSections: MenuSection[] = [];

  user = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    avatar: '👤'
  };

  constructor(
    private router: Router,
    private cartService: CartService // ✅ Ajout
  ) {}

  ngOnInit(): void {
    // ✅ Initialiser l'observable du compteur de panier
    this.cartCount$ = this.cartService.cartCount$;

    // Initialiser les sections de menu avec badge dynamique
    this.menuSections = [
      {
        title: '',
        items: [
          { label: 'Tableau de bord', icon: '📊', route: '/client/home' }
        ]
      },
      {
        title: '',
        items: [
          { label: 'Mes commandes', icon: '🛒', route: '/client/orders' },
          {
            label: 'Mon Panier',
            icon: '🛒',
            route: '/client/cart',
            badge: this.cartCount$ // ✅ Badge dynamique
          },
          { label: 'Catalogue', icon: '🍷', route: '/client/catalogue' },
          { label: 'Favoris', icon: '❤️', route: '/client/favoris' }
        ]
      },
      {
        title: 'MON COMPTE',
        items: [
          { label: 'Fidélité', icon: '🎁', route: '/client/loyalty' },
          { label: 'Paiements', icon: '💳', route: '/client/payments' },
          { label: 'Adresses', icon: '📍', route: '/client/addresses' },
          {
            label: 'Notifications',
            icon: '🔔',
            route: '/client/notifications',
            badge: this.notificationCount as any
          }
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

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeSidebar();
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    if (window.innerWidth < 1024) {
      this.sidebarOpen = false;
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  navigate(route: string): void {
    if (route === '/logout') {
      console.log('Déconnexion en cours...');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate([route]);
      this.closeSidebar();
    }
  }
}
