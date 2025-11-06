import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagerDashboardComponent } from '../../view/manager-dashboard/manager-dashboard.component';


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
//import { MessagesComponent } from './messages/messages.component';
//import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from '../../view/manager-dashboard/profile/profile.component';
import { SettingsComponent } from '../../view/manager-dashboard/settings/settings.component';
import { FaqComponent } from '../../view/manager-dashboard/faq/faq.component';
import { ContactComponent } from '../../view/manager-dashboard/contact/contact.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { title: 'Tableau de bord' } },
      { path: 'mycave', component: MyCaveComponent, data: { title: 'Ma Cave' } },
      { path: 'team', component: TeamComponent, data: { title: 'Mon Équipe' } },
      { path: 'presence', component: PresenceComponent, data: { title: 'Présences' } },
      { path: 'schedule', component: ScheduleComponent, data: { title: 'Planning' } },
      { path: 'performance', component: PerformanceComponent, data: { title: 'Performance' } },
      { path: 'orders', component: OrdersComponent, data: { title: 'Commandes' } },
      { path: 'sales', component: SalesComponent, data: { title: 'Ventes' } },
      { path: 'stockrequest', component: StockRequestComponent, data: { title: 'Demandes de Stock' } },
      { path: 'inventory', component: InventoryComponent, data: { title: 'Inventaire' } },
      { path: 'dailyreport', component: DailyReportComponent, data: { title: 'Rapport Journalier' } },
      { path: 'cash-register', component: CashRegisterComponent, data: { title: 'Caisse' } },
      { path: 'incident', component: IncidentComponent, data: { title: 'Incidents' } },
      { path: 'customers', component: CustomersComponent, data: { title: 'Clients' } },
      //{ path: 'messages', component: MessagesComponent, data: { title: 'Messages' } },
      //{ path: 'notifications', component: NotificationsComponent, data: { title: 'Notifications' } },
      { path: 'profile', component: ProfileComponent, data: { title: 'Mon Profil' } },
      { path: 'settings', component: SettingsComponent, data: { title: 'Paramètres' } },
      { path: 'faq', component: FaqComponent, data: { title: 'FAQ' } },
      { path: 'contact', component: ContactComponent, data: { title: 'Support' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
