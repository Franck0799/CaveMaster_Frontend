// ==========================================
// FICHIER: src/app/server/server-routing.module.ts
// DESCRIPTION: Routes pour l'interface Serveuse/Serveur
// ==========================================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaitressComponent } from '../../view/waitress-dashboard/waitress-dashboard.component';

import { HomeComponent } from '../../view/waitress-dashboard/home/home.component';
import { ActiveOrdersComponent } from '../../view/waitress-dashboard/active-orders/active-orders.component';
import { BillingComponent } from '../../view/waitress-dashboard/billing/billing.component';
import { MySalesComponent } from '../../view/waitress-dashboard/mysales/mysales.component';
import { OrdersComponent} from '../../view/waitress-dashboard/orders/orders.component';
import { ProfileComponent } from '../../view/waitress-dashboard/profile/profile.component';
import { ScheduleComponent } from '../../view/waitress-dashboard/schedule/schedule.component';
import { TablesComponent } from '../../view/waitress-dashboard/table/table.component';
import { WineSuggestionsComponent } from '../../view/waitress-dashboard/wine-suggestions/wine-suggestions.component';

const routes: Routes = [
  {
    path: '',
    component: WaitressComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Tableau de bord' }
      },

      {
        path: 'active-orders',
        component: ActiveOrdersComponent,
        data: { title: 'Suivie des commandes' }
      },

      {
        path: 'billing',
        component: BillingComponent,
        data: { title: 'Factures' }
      },

      {
        path: 'orders',
        component: OrdersComponent,
        data: { title: 'Commandes' }
      },

      {
        path: 'wine-suggestions',
        component: WineSuggestionsComponent,
        data: { title: 'Suggestions des accords' }
      },

      {
        path: 'mysales',
        component: MySalesComponent,
        data: { title: 'Mes ventes' }
      },


      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Profil' }
      },

      {
        path: 'schedule',
        component: ScheduleComponent,
        data: { title: 'Planning' }
      },

      {
        path: 'table',
        component: TablesComponent,
        data: { title: 'Tables' }
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
export class WaitressRoutingModule { }
