import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../view/admin-dashboard/admin-dashboard.component';

// Import des composants des pages
import { HomeComponent } from '../../view/admin-dashboard/home/home.component';
import { CaveListComponent } from '../../view/admin-dashboard/cave-list/cave-list.component';
import { CaveCreateComponent } from '../../view/admin-dashboard/cave-create/cave-create.component';
import { WinePairingComponent } from '../../view/admin-dashboard/wine-pairing/wine-pairing.component';
import { ManagersComponent } from '../../view/admin-dashboard/managers/managers.component';
import { EmployeesComponent } from '../../view/admin-dashboard/employees/employees.component';
import { ScanComponent } from '../../view/admin-dashboard/scan/scan.component';
import { ProfileComponent } from '../../view/admin-dashboard/profile/profile.component';
import { UserProfileComponent } from '../../view/admin-dashboard/user-profile/user-profile.component';
import { EntriesComponent } from '../../view/admin-dashboard/entries/entries.component';
import { ExitsComponent } from '../../view/admin-dashboard/exits/exits.component';
import { DrinksComponent } from '../../view/admin-dashboard/drinks/drinks.component';
import { FaqComponent } from '../../view/admin-dashboard/faq/faq.component';
import { ImprovementsComponent } from '../../view/admin-dashboard/improvements/improvements.component';
import { ContactComponent } from '../../view/admin-dashboard/contact/contact.component';
import { AboutComponent } from '../../view/admin-dashboard/about/about.component';
import { RecentActionsComponent } from '../../view/admin-dashboard/recent-actions/recent-actions.component';
import { SettingsComponent } from '../../view/admin-dashboard/settings/settings.component';
import { UserCreateComponent } from '../../view/admin-dashboard/user-create/user-create.component';
import { UserListComponent } from '../../view/admin-dashboard/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      // Redirection par défaut
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

      // ===== PAGES PRINCIPALES =====

      // 🏠 Accueil
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Accueil', icon: '🏠' }
      },

      // 🍷 Gestion des caves
      {
        path: 'caves',
        component: CaveListComponent,
        data: { title: 'Mes Caves', icon: '🍷' }
      },
      {
        path: 'caves/create',
        component: CaveCreateComponent,
        data: { title: 'Créer une cave', icon: '➕' }
      },
      {
        path: 'caves/:id',
        component: CaveListComponent, // ou CaveDetailComponent si vous en avez un
        data: { title: 'Détails de la cave', icon: '🍷' }
      },

      // ===== SECTION MA CAVE =====

      // 🍾 Gestion des boissons
      {
        path: 'drinks',
        component: DrinksComponent,
        data: { title: 'Mes Boissons', icon: '🍾' }
      },

      // Routes pour chaque catégorie de boissons
      {
        path: 'drinks/Bières',
        component: DrinksComponent,
        data: { title: 'Bières', icon: '🍺', category: 'Bières' }
      },
      {
        path: 'drinks/Sucreries',
        component: DrinksComponent,
        data: { title: 'Sucreries', icon: '🍬', category: 'Sucreries' }
      },
      {
        path: 'drinks/Champagne',
        component: DrinksComponent,
        data: { title: 'Champagne', icon: '🥂', category: 'Champagne' }
      },
      {
        path: 'drinks/Vin Blanc',
        component: DrinksComponent,
        data: { title: 'Vin Blanc', icon: '🍷', category: 'Vin Blanc' }
      },
      {
        path: 'drinks/Vin Rouge',
        component: DrinksComponent,
        data: { title: 'Vin Rouge', icon: '🍷', category: 'Vin Rouge' }
      },
      {
        path: 'drinks/Vin Rosé',
        component: DrinksComponent,
        data: { title: 'Vin Rosé', icon: '🍷', category: 'Vin Rosé' }
      },
      {
        path: 'drinks/Vin Mousseux',
        component: DrinksComponent,
        data: { title: 'Vin Mousseux', icon: '✨', category: 'Vin Mousseux' }
      },
      {
        path: 'drinks/Liqueurs',
        component: DrinksComponent,
        data: { title: 'Liqueurs', icon: '🥃', category: 'Liqueurs' }
      },
      {
        path: 'drinks/Boissons Énergisantes',
        component: DrinksComponent,
        data: { title: 'Boissons Énergisantes', icon: '⚡', category: 'Boissons Énergisantes' }
      },
      {
        path: 'drinks/Boissons Locales',
        component: DrinksComponent,
        data: { title: 'Boissons Locales', icon: '🍹', category: 'Boissons Locales' }
      },

      // 📥 Mes entrées
      {
        path: 'entries',
        component: EntriesComponent,
        data: { title: 'Mes Entrées', icon: '📥' }
      },

      // 📤 Mes sorties
      {
        path: 'exits',
        component: ExitsComponent,
        data: { title: 'Mes Sorties', icon: '📤' }
      },

      // 🍽️ Mets & Vins
      {
        path: 'wine-pairing',
        component: WinePairingComponent,
        data: { title: 'Mets & Vins', icon: '🍽️' }
      },

      // 👥 Mes managers
      {
        path: 'managers',
        component: ManagersComponent,
        data: { title: 'Mes Managers', icon: '👥' }
      },

      // 👨‍💼 Mes employés
      {
        path: 'employees',
        component: EmployeesComponent,
        data: { title: 'Mes Employés', icon: '👨‍💼' }
      },

      // 📷 Scan
      {
        path: 'scan',
        component: ScanComponent,
        data: { title: 'Scanner un Produit', icon: '📷' }
      },

      // 👤 Mon compte / Profil
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Mon Profil', icon: '👤' }
      },

      // ===== SECTION INFOS =====

      // ❓ FAQ
      {
        path: 'faq',
        component: FaqComponent,
        data: { title: 'FAQ', icon: '❓' }
      },

      // 📝 Notes d'amélioration
      {
        path: 'improvements',
        component: ImprovementsComponent,
        data: { title: 'Notes d\'amélioration', icon: '📝' }
      },

      // 📧 Nous contacter
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Nous Contacter', icon: '📧' }
      },

      // 📚 En savoir plus
      {
        path: 'about',
        component: AboutComponent,
        data: { title: 'En Savoir Plus', icon: '📚' }
      },

      // ===== AUTRES PAGES =====

      // 📋 Actions récentes
      {
        path: 'recent-actions',
        component: RecentActionsComponent,
        data: { title: 'Actions Récentes', icon: '📋' }
      },

      // ⚙️ Paramètres
      {
        path: 'settings',
        component: SettingsComponent,
        data: { title: 'Paramètres', icon: '⚙️' }
      },

      // ===== GESTION DES UTILISATEURS =====

      // 👥 Liste des utilisateurs
      {
        path: 'users',
        component: UserListComponent,
        data: { title: 'Liste des Utilisateurs', icon: '👥' }
      },

      // ➕ Créer un utilisateur
      {
        path: 'users/create',
        component: UserCreateComponent,
        data: { title: 'Créer un Utilisateur', icon: '➕' }
      },

      // 👤 Profil utilisateur
      {
        path: 'users/:id',
        component: UserProfileComponent,
        data: { title: 'Profil Utilisateur', icon: '👤' }
      },

      // ===== ROUTE 404 (pour les routes admin non trouvées) =====
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
