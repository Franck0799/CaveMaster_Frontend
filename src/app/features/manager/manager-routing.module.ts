import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ⭐ Import du composant dashboard
import { ManagerDashboardComponent } from '../../view/manager-dashboard/manager-dashboard.component';

// ⭐ Import de tous les composants de pages
import { HomeComponent } from '../../view/manager-dashboard/home/home.component';
import { MyCaveComponent } from '../../view/manager-dashboard/mycave/mycave.component';
import { TeamComponent } from '../../view/manager-dashboard/team/team.component';
import { PresenceComponent } from '../../view/manager-dashboard/presence/presence.component';
import { ScheduleComponent } from '../../view/manager-dashboard/schedule/schedule.component';
import { PerformanceComponent } from '../../view/manager-dashboard/performance/performance.component';
import { OrdersComponent } from '../../view/manager-dashboard/orders/orders.component';
import { SalesComponent } from '../../view/manager-dashboard/sales/sales.component';
import { StockRequestComponent } from '../../view/manager-dashboard/stockrequest/stockrequest.component';
import { InventoryComponent } from '../../view/manager-dashboard/inventory/inventory.component';
import { DailyReportComponent } from '../../view/manager-dashboard/dailyreport/dailyreport.component';
import { CashRegisterComponent } from '../../view/manager-dashboard/cashregister/cashregister.component';
import { IncidentComponent } from '../../view/manager-dashboard/incident/incident.component';
import { CustomersComponent } from '../../view/manager-dashboard/customers/customers.component';
import { ProfileComponent } from '../../view/manager-dashboard/profile/profile.component';
import { SettingsComponent } from '../../view/manager-dashboard/settings/settings.component';
import { FaqComponent } from '../../view/manager-dashboard/faq/faq.component';
import { ContactComponent } from '../../view/manager-dashboard/contact/contact.component';

// ⭐ Configuration des routes CORRIGÉES
const routes: Routes = [
  {
    path: '',
    component: ManagerDashboardComponent,
    children: [
      // ⭐ Redirection par défaut vers home
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

      // ⭐ Pages principales
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Tableau de bord' }
      },

      // ⭐ CORRECTION: Ajouter les deux variantes (avec et sans tiret)
      {
        path: 'my-cave',
        component: MyCaveComponent,
        data: { title: 'Ma Cave' }
      },
      {
        path: 'mycave',
        redirectTo: 'my-cave',
        pathMatch: 'full'
      },

      // ⭐ Section Équipe
      {
        path: 'team',
        component: TeamComponent,
        data: { title: 'Mon Équipe' }
      },
      {
        path: 'presence',
        component: PresenceComponent,
        data: { title: 'Présences' }
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
        data: { title: 'Planning' }
      },
      {
        path: 'performance',
        component: PerformanceComponent,
        data: { title: 'Performance' }
      },

      // ⭐ Section Opérations
      {
        path: 'orders',
        component: OrdersComponent,
        data: { title: 'Commandes' }
      },
      {
        path: 'sales',
        component: SalesComponent,
        data: { title: 'Ventes' }
      },

      // ⭐ CORRECTION: Ajouter les deux variantes
      {
        path: 'stock-requests',
        component: StockRequestComponent,
        data: { title: 'Demandes de Stock' }
      },
      {
        path: 'stockrequest',
        redirectTo: 'stock-requests',
        pathMatch: 'full'
      },

      {
        path: 'inventory',
        component: InventoryComponent,
        data: { title: 'Inventaire' }
      },

      // ⭐ Section Rapports
      // CORRECTION: Ajouter les deux variantes
      {
        path: 'daily-report',
        component: DailyReportComponent,
        data: { title: 'Rapport Journalier' }
      },
      {
        path: 'dailyreport',
        redirectTo: 'daily-report',
        pathMatch: 'full'
      },

      {
        path: 'cashregister',
        component: CashRegisterComponent,
        data: { title: 'Caisse' }
      },

      // ⭐ CORRECTION: Ajouter les deux variantes
      {
        path: 'incidents',
        component: IncidentComponent,
        data: { title: 'Incidents' }
      },
      {
        path: 'incident',
        redirectTo: 'incidents',
        pathMatch: 'full'
      },

      // ⭐ Clients
      {
        path: 'customers',
        component: CustomersComponent,
        data: { title: 'Clients' }
      },

      // ⭐ Compte
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Mon Profil' }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { title: 'Paramètres' }
      },

      // ⭐ Aide
      {
        path: 'faq',
        component: FaqComponent,
        data: { title: 'FAQ' }
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Support' }
      },
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
export class ManagerRoutingModule { }
